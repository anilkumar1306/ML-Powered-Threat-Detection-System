from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import pandas as pd
import io
import uuid
import os
from typing import List

from app.config import settings
from app.schemas import PredictionRequest, PredictionResponse, BatchPredictionSummary, ModelInfo, HealthResponse
from app.model_loader import model_loader
from app.inference import inference_engine
from app.utils import logger

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ML-Powered Threat Detection API"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for batch results (for downloading)
# In production, use Redis or Database
BATCH_RESULTS_STORE = {}

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up...")
    # Models are loaded by singleton instantiation in model_loader
    # But we can force check here
    if not model_loader.models:
        logger.warning("Models might not be loaded properly!")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {
        "status": "active",
        "version": settings.VERSION,
        "loaded_models": list(model_loader.models.keys())
    }

@app.get("/models", response_model=List[ModelInfo])
async def list_models():
    info_list = []
    for name, filename in settings.MODEL_FILES.items():
        info_list.append(ModelInfo(name=name, filename=filename, description=f"Trained {name} model"))
    return info_list

@app.post("/predict", response_model=PredictionResponse)
async def predict_single(request: PredictionRequest, model_name: str = "Random Forest"):
    try:
        if model_name not in model_loader.models:
            raise HTTPException(status_code=404, detail=f"Model {model_name} not found")
            
        result = inference_engine.predict_single(request.features, model_name)
        return result
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload", response_model=BatchPredictionSummary)
async def predict_batch(file: UploadFile = File(...), model_name: str = "Random Forest"):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Run inference
        results = inference_engine.predict_batch(df, model_name)
        
        # Calculate stats
        total = len(results)
        benign = sum(1 for r in results if r['prediction'] == 'BENIGN')
        anomalies = sum(1 for r in results if r['anomaly_flag'])
        attacks = total - benign - anomalies # Note: Anomalies deemed attacks are counted as anomalies here for strict separation, or we can count them as attacks.
        # Requirement: "One of the 15 attack classes OR flagged as ANOMALY". 
        # So Anomalies are separate category in stats.
        
        # Store for download
        file_id = str(uuid.uuid4())
        BATCH_RESULTS_STORE[file_id] = results
        
        return {
            "total_rows": total,
            "benign_count": benign,
            "attack_count": attacks,
            "anomaly_count": anomalies,
            "results": results # Return all results
        }
        
    except Exception as e:
        logger.error(f"Batch processing failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{file_id}")
async def download_results(file_id: str):
    if file_id not in BATCH_RESULTS_STORE:
        raise HTTPException(status_code=404, detail="File ID not found")
        
    results = BATCH_RESULTS_STORE[file_id]
    
    # Convert to CSV
    df = pd.DataFrame(results)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    response = stream.getvalue()
    
    return JSONResponse(
        content=response,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=predictions_{file_id}.csv"}
    )
