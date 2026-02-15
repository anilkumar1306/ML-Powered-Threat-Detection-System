import joblib
import os
import pandas as pd
from app.config import settings
from app.utils import logger, validate_file_path

class ModelLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance.models = {}
            cls._instance.scaler = None
            cls._instance.label_encoder = None
            cls._instance.selector = None
            cls._instance.anomaly_model = None
            cls._instance.load_models()
        return cls._instance

    def load_models(self):
        """Loads all models and artifacts from disk."""
        logger.info("Loading models and artifacts...")
        
        try:
            # Load Preprocessing Artifacts
            scaler_path = os.path.join(settings.MODEL_DIR, settings.SCALER_FILE)
            le_path = os.path.join(settings.MODEL_DIR, settings.LABEL_ENCODER_FILE)
            selector_path = os.path.join(settings.MODEL_DIR, settings.SELECTOR_FILE)
            
            validate_file_path(scaler_path)
            validate_file_path(le_path)
            validate_file_path(selector_path)

            self.scaler = joblib.load(scaler_path)
            self.label_encoder = joblib.load(le_path)
            self.selector = joblib.load(selector_path)
            logger.info("Preprocessing artifacts loaded successfully.")

            # Load Supervised Models
            for name, filename in settings.MODEL_FILES.items():
                path = os.path.join(settings.MODEL_DIR, filename)
                validate_file_path(path)
                self.models[name] = joblib.load(path)
                logger.info(f"Loaded model: {name}")

            # Load Anomaly Detection Model
            anomaly_path = os.path.join(settings.MODEL_DIR, settings.ANOMALY_MODEL_FILE)
            validate_file_path(anomaly_path)
            self.anomaly_model = joblib.load(anomaly_path)
            logger.info("Isolation Forest Anomaly Model loaded successfully.")
            
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            raise RuntimeError(f"Failed to load models: {e}")

    def get_model(self, model_name: str):
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found. Available: {list(self.models.keys())}")
        return self.models[model_name]

model_loader = ModelLoader()
