from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

users_db = {}
activities_db = {}
friends_db = {}
feed_db = {}

class User:
    def __init__(self, id: str, username: str, email: str, password: str):
        self.id = id
        self.username = username
        self.email = email
        self.password = password  # In a real app, this would be hashed
        self.created_at = datetime.now()
        
class Activity:
    def __init__(
        self, 
        id: str, 
        user_id: str, 
        title: str, 
        description: str, 
        weather_data: Dict[str, Any],
        gardening_actions: List[str],
        photos: List[str],
        created_at: Optional[datetime] = None
    ):
        self.id = id
        self.user_id = user_id
        self.title = title
        self.description = description
        self.weather_data = weather_data
        self.gardening_actions = gardening_actions
        self.photos = photos
        self.created_at = created_at or datetime.now()

class FriendRelation:
    def __init__(self, user_id: str, friend_id: str, status: str = "pending"):
        self.user_id = user_id
        self.friend_id = friend_id
        self.status = status  # pending, accepted, rejected
        self.created_at = datetime.now()
