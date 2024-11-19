from fastapi import APIRouter, HTTPException, status
from firebase_admin import auth, firestore
from ..schemas.user import UserCreate, UserLogin, UserResponse
from datetime import datetime

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Get Firestore client
db = firestore.client()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    try:
        # Create user in Firebase Auth
        user_record = auth.create_user(
            email=user.email,
            password=user.password
        )
        
        # Add custom claims for role
        auth.set_custom_user_claims(user_record.uid, {'role': user.role})
        
        # Store user data in Firestore
        user_data = {
            'email': user.email,
            'role': user.role,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        
        # Add to 'users' collection
        db.collection('users').document(user_record.uid).set(user_data)
        
        return UserResponse(
            user_id=user_record.uid,
            email=user_record.email,
            role=user.role,
            created_at=datetime.now()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login")
async def login(user: UserLogin):
    try:
        # Get user from Firebase Auth
        user_record = auth.get_user_by_email(user.email)
        
        # Get user data from Firestore
        user_data = db.collection('users').document(user_record.uid).get()
        
        # Create custom token
        custom_token = auth.create_custom_token(user_record.uid)
        
        return {
            "token": custom_token,
            "user_id": user_record.uid,
            "email": user_record.email,
            "role": user_data.to_dict().get('role')
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

# Optional: Endpoint to get user profile
@router.get("/profile/{user_id}", response_model=UserResponse)
async def get_profile(user_id: str):
    try:
        # Get user from Firestore
        user_doc = db.collection('users').document(user_id).get()
        if not user_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user_data = user_doc.to_dict()
        return UserResponse(
            user_id=user_id,
            email=user_data['email'],
            role=user_data['role'],
            created_at=user_data.get('createdAt')
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )