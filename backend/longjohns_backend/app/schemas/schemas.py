from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime

class FriendRequest(BaseModel):
    friend_id: str

class FriendResponse(BaseModel):
    id: str
    username: str
    status: str

class WeatherData(BaseModel):
    temperature: float
    humidity: Optional[float] = None
    conditions: Optional[str] = None
    precipitation: Optional[float] = None

class ActivityCreate(BaseModel):
    title: str
    description: str
    weather_data: WeatherData
    gardening_actions: List[str]
    photos: Optional[List[str]] = []

class ActivityResponse(BaseModel):
    id: str
    user_id: str
    username: str
    title: str
    description: str
    weather_data: WeatherData
    gardening_actions: List[str]
    photos: List[str]
    created_at: datetime

class FeedResponse(BaseModel):
    activities: List[ActivityResponse]

class RecommendationResponse(BaseModel):
    title: str
    description: str
    reason: str
