from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class PredictionRequest(BaseModel):
    """
    Schema for single row prediction request.
    Use a dictionary to allow flexible feature names, 
    but validation will ensure strict count and preprocessing.
    """
    features: Dict[str, Any] = Field(..., description="Dictionary of features. Must contain all 70 retained features defined in config.")

class PredictionResponse(BaseModel):
    row_id: Optional[str] = None
    prediction: str
    confidence: float
    anomaly_flag: bool
    label_index: int

class BatchPredictionSummary(BaseModel):
    total_rows: int
    benign_count: int
    attack_count: int
    anomaly_count: int
    results: List[PredictionResponse]

class ModelInfo(BaseModel):
    name: str
    filename: str
    description: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    version: str
    loaded_models: List[str]
