import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
TEMP_DIR = BASE_DIR / "temp"

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OpenVINO and Intel AI settings
OPENVINO_DEVICE = "CPU"
MODEL_PRECISION = "FP16"

# API configurations
API_V1_PREFIX = "/api/v1"
PROJECT_NAME = "ScanSense AI"
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Database settings
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./scansense.db")

# Model configurations
CNN_MODEL_PATH = MODELS_DIR / "cnn_models"
CHATBOT_MODEL_PATH = MODELS_DIR / "chatbot"

# Security and compliance
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",") 