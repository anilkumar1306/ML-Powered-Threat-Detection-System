import sys
import os
import pandas as pd
import numpy as np

# Add backend to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "app"))
sys.path.append(os.path.dirname(__file__))

# Mock settings if needed, or rely on env vars
os.environ["PROJECT_NAME"] = "Test"

try:
    print("Importing model_loader...")
    from app.model_loader import model_loader
    
    print("Checking loaded models...")
    print(f"Models: {list(model_loader.models.keys())}")
    print(f"Scaler: {model_loader.scaler}")
    print(f"Selector: {model_loader.selector}")
    print(f"Label Encoder: {model_loader.label_encoder}")
    print(f"Anomaly Model: {model_loader.anomaly_model}")
    
    if not model_loader.models:
        print("ERROR: No models loaded!")
        sys.exit(1)

    print("\nImporting inference_engine...")
    from app.inference import inference_engine
    
    # Create dummy data (70 features)
    print("Creating dummy input...")
    dummy_features = {f"Feature_{i}": np.random.rand() for i in range(70)}
    
    # Test Prediction
    print("Testing Random Forest prediction...")
    result = inference_engine.predict_single(dummy_features, "Random Forest")
    print(f"Result: {result}")
    
    print("\nVERIFICATION SUCCESSFUL!")

except Exception as e:
    print(f"\nVERIFICATION FAILED: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
