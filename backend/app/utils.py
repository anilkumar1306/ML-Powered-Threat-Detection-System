import logging
import sys
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger("ml_threat_detection")

def setup_logging():
    """Returns the configured logger instance."""
    return logger

def validate_file_path(path: str):
    """Checks if a file exists."""
    if not Path(path).exists():
        logger.error(f"File not found: {path}")
        raise FileNotFoundError(f"File not found: {path}")
    return True
