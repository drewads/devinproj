from fastapi import APIRouter, HTTPException, Header, Depends
from typing import List, Optional
import random
from datetime import datetime

from ..schemas.schemas import ActivityResponse, FeedResponse, RecommendationResponse
from ..models.models import users_db, activities_db, friends_db, feed_db

router = APIRouter(prefix="/feed", tags=["feed"])

async def get_user_id(x_user_id: Optional[str] = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-ID header is required")
    return x_user_id

@router.get("/", response_model=FeedResponse)
async def get_feed(user_id: str = Depends(get_user_id)):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    friend_ids = []
    for relation_id, relation in friends_db.items():
        if relation.status == "accepted":
            if relation.user_id == user_id:
                friend_ids.append(relation.friend_id)
            elif relation.friend_id == user_id:
                friend_ids.append(relation.user_id)
    
    feed_activities = []
    for activity_id, activity in activities_db.items():
        if activity.user_id in friend_ids or activity.user_id == user_id:
            user = users_db[activity.user_id]
            feed_activities.append(ActivityResponse(
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
    
    feed_activities.sort(key=lambda x: x.created_at, reverse=True)
    
    return FeedResponse(activities=feed_activities)

@router.get("/neighborhood", response_model=FeedResponse)
async def get_neighborhood_feed(user_id: str = Depends(get_user_id)):
    
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    neighborhood_activities = []
    for activity_id, activity in activities_db.items():
        user = users_db[activity.user_id]
        neighborhood_activities.append(ActivityResponse(
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
    
    neighborhood_activities.sort(key=lambda x: x.created_at, reverse=True)
    
    return FeedResponse(activities=neighborhood_activities)

@router.get("/recommendations", response_model=List[RecommendationResponse])
async def get_recommendations(user_id: str = Depends(get_user_id)):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    
    current_month = datetime.now().month
    
    recommendations = []
    
    if 3 <= current_month <= 5:  # Spring
        recommendations.append(RecommendationResponse(
            title="Plant Spring Vegetables",
            description="Now is a great time to plant lettuce, spinach, and peas.",
            reason="Spring season is perfect for cool-weather crops."
        ))
        recommendations.append(RecommendationResponse(
            title="Prepare Soil for Summer",
            description="Add compost to your garden beds to prepare for summer planting.",
            reason="Based on the current season."
        ))
    elif 6 <= current_month <= 8:  # Summer
        recommendations.append(RecommendationResponse(
            title="Water Regularly",
            description="Make sure to water your garden regularly during hot days.",
            reason="Summer heat requires more frequent watering."
        ))
        recommendations.append(RecommendationResponse(
            title="Plant Heat-Loving Vegetables",
            description="Now is a great time to plant tomatoes, peppers, and cucumbers.",
            reason="Based on the current season."
        ))
    elif 9 <= current_month <= 11:  # Fall
        recommendations.append(RecommendationResponse(
            title="Plant Fall Crops",
            description="Consider planting kale, carrots, and radishes for fall harvest.",
            reason="Fall season is perfect for these crops."
        ))
        recommendations.append(RecommendationResponse(
            title="Prepare for Winter",
            description="Start cleaning up garden beds and adding mulch for winter protection.",
            reason="Based on the current season."
        ))
    else:  # Winter
        recommendations.append(RecommendationResponse(
            title="Plan Your Spring Garden",
            description="Use this time to plan your spring garden layout and order seeds.",
            reason="Winter is perfect for garden planning."
        ))
        recommendations.append(RecommendationResponse(
            title="Indoor Gardening",
            description="Try growing herbs or microgreens indoors during winter months.",
            reason="Based on the current season."
        ))
    
    weather_recommendations = [
        RecommendationResponse(
            title="Rainy Day Tasks",
            description="Take advantage of the rain to transplant seedlings.",
            reason="Rain provides natural watering for new plants."
        ),
        RecommendationResponse(
            title="Sunny Day Activities",
            description="Good day for harvesting and drying herbs.",
            reason="Sunny weather is perfect for herb drying."
        ),
        RecommendationResponse(
            title="Wind Protection",
            description="Consider adding stakes or supports to tall plants.",
            reason="Windy conditions can damage unsupported plants."
        )
    ]
    
    recommendations.append(random.choice(weather_recommendations))
    
    return recommendations
