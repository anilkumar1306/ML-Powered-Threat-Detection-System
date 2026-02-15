import pandas as pd
import numpy as np
from app.config import settings
from app.model_loader import model_loader
from app.preprocessing import preprocessor
from app.utils import logger
import time

class InferenceEngine:
    def __init__(self):
        self.loader = model_loader
        self.preprocessor = preprocessor

    def predict_single(self, features: dict, model_name: str):
        """
        Runs prediction for a single row.
        features: Dict matching the training columns.
        """
        try:
            start_time = time.time()
            
            # Convert dict to DataFrame
            # IMPORTANT: We need to ensure the order of columns matches training!
            # Since dict is unordered (mostly), we rely on the dict keys being consistent with training data
            # OR we should assume the user sends them in order if we convert simply.
            # Ideally, we should reindex based on a known feature list, but we don't have the feature list saved explicitly
            # other than in the scaler/selector.
            # For now, we assume the input dict keys are correct and we convert to DF.
            
            df = pd.DataFrame([features])
            
            # Preprocessing
            # 1. Clean & Validate
            # 2. Selector
            # 3. Scaler
            X_processed = self.preprocessor.transform(df) # Returns numpy array
            
            # Anomaly Detection
            # Isolation Forest predicts: 1 for inlier, -1 for outlier
            anomaly_score = self.loader.anomaly_model.predict(X_processed)[0]
            is_anomaly = anomaly_score == -1
            
            if is_anomaly:
                prediction = settings.ANOMALY_LABEL
                confidence = 1.0 # High confidence it's an anomaly based on the model
                label_index = -1
            else:
                # Supervised Model Prediction
                model = self.loader.get_model(model_name)
                
                # Check directly for predict_proba, otherwise use predict
                if hasattr(model, "predict_proba"):
                    probs = model.predict_proba(X_processed)[0]
                    label_index = np.argmax(probs)
                    confidence = float(np.max(probs))
                    prediction = settings.CLASS_LABELS.get(label_index, f"Unknown-{label_index}")
                else:
                    label_index = int(model.predict(X_processed)[0])
                    confidence = 1.0 # deterministic
                    prediction = settings.CLASS_LABELS.get(label_index, f"Unknown-{label_index}")

            return {
                "prediction": prediction,
                "confidence": confidence,
                "anomaly_flag": is_anomaly,
                "label_index": int(label_index)
            }

        except Exception as e:
            logger.error(f"Inference error: {e}")
            raise e

    def predict_batch(self, df: pd.DataFrame, model_name: str):
        """
        Runs prediction for a batch (DataFrame).
        """
        results = []
        
        # Preprocessing
        # We process the whole batch at once for efficiency
        # But we need to handle potential errors in individual rows if strict?
        # The requirements say "Efficient batch inference".
        # So we process all.
        
        try:
            # 1. Transform
            # This applies cleaning and validation
            # transform returns dict or array? It returns numpy array.
            X_processed = self.preprocessor.transform(df)
            
            # 2. Anomaly Detection
            anomaly_preds = self.loader.anomaly_model.predict(X_processed) # 1 or -1
            
            # 3. Supervised Model
            model = self.loader.get_model(model_name)
            
            if hasattr(model, "predict_proba"):
                all_probs = model.predict_proba(X_processed)
                all_indices = np.argmax(all_probs, axis=1)
                all_confidences = np.max(all_probs, axis=1)
            else:
                all_indices = model.predict(X_processed).astype(int)
                all_confidences = np.ones(len(all_indices)) # Placeholder for models without proba

            # 4. Combine Results
            for i in range(len(df)):
                is_anomaly = anomaly_preds[i] == -1
                
                if is_anomaly:
                     pred_label = settings.ANOMALY_LABEL
                     conf = 1.0
                     idx = -1
                else:
                     idx = int(all_indices[i])
                     pred_label = settings.CLASS_LABELS.get(idx, f"Unknown-{idx}")
                     conf = float(all_confidences[i])
                
                results.append({
                    "row_id": str(i), 
                    "prediction": pred_label,
                    "confidence": conf,
                    "anomaly_flag": bool(is_anomaly),
                    "label_index": idx
                })
                
            return results

        except Exception as e:
            logger.error(f"Batch inference error: {e}")
            raise e

inference_engine = InferenceEngine()
