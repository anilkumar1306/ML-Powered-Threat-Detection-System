import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ML Threat Detection System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Path Configuration
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MODEL_DIR: str = os.path.join(BASE_DIR, "saved_models")
    
    # Model Filenames
    MODEL_FILES: dict = {
        "Random Forest": "random_forest_model.pkl",
        "XGBoost": "xgboost_model.pkl",
        "Decision Tree": "decision_tree_model.pkl",
        "Gradient Boosting": "gradient_boosting_model.pkl",
        "Logistic Regression": "logistic_regression_model.pkl",
    }
    
    ANOMALY_MODEL_FILE: str = "isolation_forest_anomaly.pkl"
    SCALER_FILE: str = "scaler.pkl"
    LABEL_ENCODER_FILE: str = "label_encoder.pkl"
    SELECTOR_FILE: str = "feature_selector_variance.pkl"
    
    # Validation Constants
    RETAINED_FEATURES: list = [
        "Destination Port", "Flow Duration", "Total Fwd Packets", "Total Backward Packets",
        "Total Length of Fwd Packets", "Total Length of Bwd Packets", "Fwd Packet Length Max",
        "Fwd Packet Length Min", "Fwd Packet Length Mean", "Fwd Packet Length Std",
        "Bwd Packet Length Max", "Bwd Packet Length Min", "Bwd Packet Length Mean",
        "Bwd Packet Length Std", "Flow Bytes/s", "Flow Packets/s", "Flow IAT Mean",
        "Flow IAT Std", "Flow IAT Max", "Flow IAT Min", "Fwd IAT Total", "Fwd IAT Mean",
        "Fwd IAT Std", "Fwd IAT Max", "Fwd IAT Min", "Bwd IAT Total", "Bwd IAT Mean",
        "Bwd IAT Std", "Bwd IAT Max", "Bwd IAT Min", "Fwd PSH Flags", "Fwd URG Flags",
        "Fwd Header Length", "Bwd Header Length", "Fwd Packets/s", "Bwd Packets/s",
        "Min Packet Length", "Max Packet Length", "Packet Length Mean", "Packet Length Std",
        "Packet Length Variance", "FIN Flag Count", "SYN Flag Count", "RST Flag Count",
        "PSH Flag Count", "ACK Flag Count", "URG Flag Count", "CWE Flag Count",
        "ECE Flag Count", "Down/Up Ratio", "Average Packet Size", "Avg Fwd Segment Size",
        "Avg Bwd Segment Size", "Fwd Header Length.1", "Subflow Fwd Packets",
        "Subflow Fwd Bytes", "Subflow Bwd Packets", "Subflow Bwd Bytes",
        "Init_Win_bytes_forward", "Init_Win_bytes_backward", "act_data_pkt_fwd",
        "min_seg_size_forward", "Active Mean", "Active Std", "Active Max", "Active Min",
        "Idle Mean", "Idle Std", "Idle Max", "Idle Min"
    ]
    
    @property
    def EXPECTED_FEATURE_COUNT(self) -> int:
        return len(self.RETAINED_FEATURES)
    
    # Labels
    CLASS_LABELS: dict = {
        0: "BENIGN",
        1: "Bot",
        2: "DDoS",
        3: "DoS GoldenEye",
        4: "DoS Hulk",
        5: "DoS Slowhttptest",
        6: "DoS slowloris",
        7: "FTP-Patator",
        8: "Heartbleed",
        9: "Infiltration",
        10: "PortScan",
        11: "SSH-Patator",
        12: "Web Attack - Brute Force",
        13: "Web Attack - Sql Injection",
        14: "Web Attack - XSS"
    }
    
    ANOMALY_LABEL: str = "ANOMALY"

    class Config:
        case_sensitive = True

settings = Settings()
