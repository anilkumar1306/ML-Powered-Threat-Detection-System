import urllib.request
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_URL = "http://127.0.0.1:8000"

RETAINED_FEATURES = [
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

def send_request(endpoint, data):
    url = f"{BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    # Serialize with allow_nan=True if using standard json, but standard json.dumps converts inf to Infinity
    # Python's json library produces 'Infinity' which is valid JSON5 but not strict JSON.
    # However, many parsers handle it. Let's see if FastAPI/pydantic accepts it or if we need to pass a string.
    # Actually, standard JSON does not support Infinity. It will be 'Infinity' (no quotes) which is invalid.
    # But let's try passing a very large number instead if Infinity fails serialization.
    
    # Or we can treat it as a float: float('inf')
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req) as response:
            return response.getcode(), response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return None, str(e)

def test_infinity_request():
    logger.info("Testing request with INFINITY...")
    features = {feature: 0.0 for feature in RETAINED_FEATURES}
    # Set one feature to Infinity
    features["Flow Duration"] = 1e309 # Larger than float64 max, becomes inf in Python usually or overflows
    
    payload = {"features": features}
    
    code, response = send_request("/predict", payload)
    
    if code == 500:
        logger.info(f"✅ Infinity request CORRECTLY FAILED (500 expected initially): {code} - {response}")
    else:
        logger.warning(f"⚠️ Unexpected status for Infinity: {code} - {response}")

if __name__ == "__main__":
    test_infinity_request()
