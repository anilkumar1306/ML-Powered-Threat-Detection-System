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
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return response.getcode(), response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return None, str(e)

def test_valid_request():
    logger.info("Testing VALID request with 70 features...")
    payload = {
        "features": {feature: 0.0 for feature in RETAINED_FEATURES}
    }
    
    code, response = send_request("/predict", payload)
    
    if code == 200:
        logger.info("✅ Valid request SUCCESS")
        print(json.dumps(json.loads(response), indent=2))
    else:
        logger.error(f"❌ Valid request FAILED: {code} - {response}")

def test_missing_features():
    logger.info("\nTesting INVALID request with MISSING features...")
    features = {feature: 0.0 for feature in RETAINED_FEATURES}
    del features["Destination Port"]
    
    payload = {"features": features}
    
    code, response = send_request("/predict", payload)
    
    # Expecting 500 because ValueError raises 500 in this app
    if code == 500: 
        logger.info("✅ Missing feature request CORRECTLY FAILED (500 expected)")
        logger.info(f"Response: {response}")
    else:
        logger.warning(f"⚠️ Unexpected status for missing feature: {code} - {response}")

def test_extra_features():
    logger.info("\nTesting request with EXTRA features...")
    features = {feature: 0.0 for feature in RETAINED_FEATURES}
    features["Extra_Junk_Feature"] = 999.0
    
    payload = {"features": features}
    
    code, response = send_request("/predict", payload)
    
    if code == 200:
        logger.info("✅ Extra feature request SUCCESS (Should be filtered out)")
    else:
        logger.error(f"❌ Extra feature request FAILED: {code} - {response}")

if __name__ == "__main__":
    test_valid_request()
    test_missing_features()
    test_extra_features()
