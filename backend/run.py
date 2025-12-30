"""
Application entry point
"""
import uvicorn
from logger_config import logger

if __name__ == "__main__":
    logger.info("Starting ShopKeeperAI Backend...")
    uvicorn.run(
        "main:app",
        reload=True,
        log_level="info"
    )
