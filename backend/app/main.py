from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import onboarding
import os

app = FastAPI(
    title="WriteBot API",
    description="Backend API for WriteBot onboarding workflow",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend dev server
        "http://localhost:5173",  # Alternative Vite port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(onboarding.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "WriteBot API is running",
        "version": "1.0.0",
        "endpoints": {
            "scenario": "/api/onboarding/scenario",
            "session": "/api/onboarding/session/{session_id}"
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

