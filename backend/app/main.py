"""VeriBrand AI - Automated Pre-Publication Governance & Compliance Verification Platform.

Main FastAPI application entry point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.audit import router as audit_router
from app.core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and shutdown routines."""
    print(f"[VeriBrand AI] Engine initialized. Environment: {settings.ENVIRONMENT}")
    yield
    print("[VeriBrand AI] Engine shutdown complete.")


app = FastAPI(
    title="VeriBrand AI - Compliance & Governance API",
    description=(
        "Automated pre-publication brand governance, advertising compliance (ASCI Chapter I), "
        "numerical claim substantiation, and visual accessibility (WCAG 2.1 AA) verification platform."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS explicitly for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers at both /api/v1 and /api for smooth frontend routing
app.include_router(audit_router, prefix="/api/v1")
app.include_router(audit_router, prefix="/api")


@app.get("/", tags=["Health"])
async def root():
    """Service status and meta info."""
    return {
        "service": "VeriBrand AI Compliance Engine",
        "status": "operational",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "endpoints": {
            "audit_text": "/api/v1/audit/text",
            "audit_visual": "/api/v1/audit/visual",
            "presets": "/api/v1/audit/presets",
        },
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Liveness probe."""
    return {"status": "healthy"}
