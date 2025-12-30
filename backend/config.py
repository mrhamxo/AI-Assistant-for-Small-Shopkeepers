"""
Configuration module - loads settings from environment variables
"""
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Groq API Configuration (Free LLM API)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "shopkeeper-ai-secret-key-change-in-production-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "43200"))  # 30 days

# Database Configuration
DB_PATH = os.getenv("DB_PATH", "shopkeeper_assistant.db")

# Application Settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
