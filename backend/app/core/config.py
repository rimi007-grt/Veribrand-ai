"""Application configuration using Pydantic Settings."""

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "VeriBrand AI Compliance Engine"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-pro"

    # Base directory paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    SHARED_DATA_DIR: Path = BASE_DIR.parent / "shared_data"


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()

