import pandas as pd
import numpy as np
from app.config import settings
from app.model_loader import model_loader
from app.utils import logger, validate_file_path

class PreprocessingPipeline:
    def __init__(self):
        self.loader = model_loader

    def clean_column_names(self, df: pd.DataFrame) -> pd.DataFrame:
        """Removes whitespace from column names."""
        df.columns = df.columns.str.strip()
        return df

    def validate_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Validates that all retained features are present.
        Returns the DataFrame with only the retained features in the correct order.
        """
        # Check for missing features
        missing_features = [f for f in settings.RETAINED_FEATURES if f not in df.columns]
        if missing_features:
            error_msg = f"Missing features: {missing_features}"
            logger.error(error_msg)
            raise ValueError(error_msg)
            
        # Select and reorder columns to match strict training order
        df_selected = df[settings.RETAINED_FEATURES]
        
        if df_selected.shape[1] != settings.EXPECTED_FEATURE_COUNT:
            error_msg = f"Expected {settings.EXPECTED_FEATURE_COUNT} features, got {df_selected.shape[1]}"
            logger.error(error_msg)
            raise ValueError(error_msg)
            
        return df_selected

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        """
        Applies separation of concerns:
        1. Clean names
        2. Validate count & Reorder using RETAINED_FEATURES
        3. Variance Threshold (using saved selector)
        4. Standardization (using saved scaler)
        """
        try:
            # Step 1: Clean
            df = self.clean_column_names(df)
            
            # Step 2: Validate & Reorder
            # This ensures the dataframe has exactly the 70 features in correct order
            df = self.validate_features(df)
            
            # Step 3: Selector
            # Note: The selector expects the original dataframe shape
            # We assume the input DF matches the TRAINING input structure
            # If the user provides a dict, it must be converted to DF with correct order
            
            # Step 2.5: Handle Infinity and NaNs
            # Replace infinity with NaN
            df.replace([np.inf, -np.inf], np.nan, inplace=True)
            # Fill NaN with 0 (or median/mean if we had access to training stats easily, but 0 is safe for now)
            df.fillna(0, inplace=True)
            
            # Additional check: The input logic in main.py must ensure feature order
            # matching the training data if passed as dict. 
            # For CSV upload, we assume headers match.
            
            X_selected = self.loader.selector.transform(df)
            
            # Step 4: Scaler
            X_scaled = self.loader.scaler.transform(X_selected)
            
            return X_scaled
            
        except Exception as e:
            logger.error(f"Preprocessing failed: {e}")
            raise e

preprocessor = PreprocessingPipeline()
