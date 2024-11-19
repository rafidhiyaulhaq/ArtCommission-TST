from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config.firebase import initialize_firebase  # Import first
from .routers import auth  # Import after firebase

app = FastAPI(title="ArtCommission API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase before including routers
initialize_firebase()

# Include routers
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to ArtCommission API",
        "version": "1.0"
    }