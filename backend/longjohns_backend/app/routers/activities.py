import uuid
from fastapi import APIRouter, HTTPException, Header, Depends
from typing import List, Optional

from ..schemas.schemas import ActivityCreate, ActivityResponse
from ..models.models import Activity, users_db, activities_db, feed_db

router = APIRouter(prefix="/activities", tags=["activities"])

async def get_user_id(x_user_id: Optional[str] = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-ID header is required")
    return x_user_id

@router.post("/", response_model=ActivityResponse)
async def create_activity(activity_data: ActivityCreate, user_id: str = Depends(get_user_id)):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    activity_id = str(uuid.uuid4())
    new_activity = Activity(
        id=activity_id,
        user_id=user_id,
        title=activity_data.title,
        description=activity_data.description,
        weather_data=activity_data.weather_data.model_dump(),
        gardening_actions=activity_data.gardening_actions,
        photos=activity_data.photos or []
    )
    
    activities_db[activity_id] = new_activity
    
    if user_id not in feed_db:
        feed_db[user_id] = []
    feed_db[user_id].append(activity_id)
    
    user = users_db[user_id]
    return ActivityResponse(
        id=new_activity.id,
        user_id=new_activity.user_id,
        username=user.username,
        title=new_activity.title,
        description=new_activity.description,
        weather_data=activity_data.weather_data,
        gardening_actions=new_activity.gardening_actions,
        photos=new_activity.photos,
        created_at=new_activity.created_at
    )

@router.get("/", response_model=List[ActivityResponse])
async def get_user_activities(user_id: str = Depends(get_user_id)):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_activities = []
    for activity_id, activity in activities_db.items():
        if activity.user_id == user_id:
            user = users_db[activity.user_id]
            user_activities.append(ActivityResponse(
                id=activity.id,
                user_id=activity.user_id,
                username=user.username,
                title=activity.title,
                description=activity.description,
                weather_data=activity.weather_data,
                gardening_actions=activity.gardening_actions,
                photos=activity.photos,
                created_at=activity.created_at
            ))
    
    return user_activities

@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(activity_id: str, user_id: str = Depends(get_user_id)):
    if activity_id not in activities_db:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    activity = activities_db[activity_id]
    user = users_db[activity.user_id]
    
    return ActivityResponse(
        id=activity.id,
        user_id=activity.user_id,
        username=user.username,
        title=activity.title,
        description=activity.description,
        weather_data=activity.weather_data,
        gardening_actions=activity.gardening_actions,
        photos=activity.photos,
        created_at=activity.created_at
    )
