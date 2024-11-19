from fastapi import APIRouter, HTTPException, status
from firebase_admin import auth
from ..schemas.user import UserCreate, UserLogin, UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    try:
        user_record = auth.create_user(
            email=user.email,
            password=user.password
        )
        
        auth.set_custom_user_claims(user_record.uid, {'role': user.role})
        
        return UserResponse(
            user_id=user_record.uid,
            email=user_record.email,
            role=user.role
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login")
async def login(user: UserLogin):
    try:
        user_record = auth.get_user_by_email(user.email)
        custom_token = auth.create_custom_token(user_record.uid)
        
        return {
            "token": custom_token,
            "user_id": user_record.uid,
            "email": user_record.email
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )