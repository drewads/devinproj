import uuid
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import List, Optional

from ..schemas.schemas import UserCreate, UserResponse, UserLogin
from ..models.models import User, users_db

router = APIRouter(prefix="/users", tags=["users"])

async def get_user_id(x_user_id: Optional[str] = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-ID header is required")
    return x_user_id

@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    for user_id, user in users_db.items():
        if user.email == user_data.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    new_user = User(
        id=user_id,
        username=user_data.username,
        email=user_data.email,
        password=user_data.password  # In a real app, this would be hashed
    )
    
    users_db[user_id] = new_user
    
    return UserResponse(
        id=new_user.id,
        username=new_user.username,
        email=new_user.email,
        created_at=new_user.created_at
    )

@router.post("/login")
async def login_user(user_data: UserLogin):
    user = None
    for user_id, u in users_db.items():
        if u.email == user_data.email:
            user = u
            break
    
    if not user or user.password != user_data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"id": user.id, "username": user.username, "email": user.email}

@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: str = Depends(get_user_id)):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        created_at=user.created_at
    )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        created_at=user.created_at
    )
