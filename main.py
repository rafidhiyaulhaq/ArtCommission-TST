from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .app.config.firebase import initialize_firebase

app = FastAPI(title="ArtCommission API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase
initialize_firebase()

# Import routers
from .app.routers import auth

# Include routers
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to ArtCommission API",
        "version": "1.0"
    }