# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth, firestore
from ..schemas.user import UserCreate, UserLogin, UserResponse
from ..middleware.auth_middleware import verify_token
from ..config.firebase import db
from datetime import datetime

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    try:
        # Validate role
        if user_data.role not in ["artist", "client"]:
            raise HTTPException(
                status_code=400,
                detail="Role must be either 'artist' or 'client'"
            )
        
        # Create user in Firebase Auth
        user = auth.create_user(
            email=user_data.email,
            password=user_data.password
        )
        
        # Create user document in Firestore
        user_doc = {
            "user_id": user.uid,
            "email": user_data.email,
            "role": user_data.role,
            "created_at": firestore.SERVER_TIMESTAMP
        }
        
        # Save to Firestore
        await db.collection("users").document(user.uid).set(user_doc)
        
        # Create custom token
        token = auth.create_custom_token(user.uid)
        
        return UserResponse(
            user_id=user.uid,
            email=user_data.email,
            role=user_data.role,
            created_at=datetime.now()
        )
        
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/login", response_model=UserResponse)
async def login_user(user_data: UserLogin):
    try:
        # Get user from Firebase Auth
        user = auth.get_user_by_email(user_data.email)
        
        # Get user data from Firestore
        user_doc = db.collection("users").document(user.uid).get()
        
        if not user_doc.exists:
            raise HTTPException(
                status_code=404,
                detail="User data not found"
            )
            
        user_data = user_doc.to_dict()
        
        # Create custom token
        token = auth.create_custom_token(user.uid)
        
        return UserResponse(
            user_id=user.uid,
            email=user_data["email"],
            role=user_data["role"],
            created_at=user_data.get("created_at")
        )
        
    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user(decoded_token: dict = Depends(verify_token)):
    try:
        user_id = decoded_token.get("uid")
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )
            
        # Get user data from Firestore
        user_doc = db.collection("users").document(user_id).get()
        
        if not user_doc.exists:
            raise HTTPException(
                status_code=404,
                detail="User data not found"
            )
            
        user_data = user_doc.to_dict()
        
        return UserResponse(
            user_id=user_id,
            email=user_data["email"],
            role=user_data["role"],
            created_at=user_data.get("created_at")
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )