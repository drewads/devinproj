import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.models import users_db, activities_db, friends_db

client = TestClient(app)

def test_get_feed():
    users_db.clear()
    activities_db.clear()
    friends_db.clear()
    
    response = client.post(
        "/users/register",
        json={"username": "user1", "email": "user1@example.com", "password": "password123"}
    )
    user1_id = response.json()["id"]
    
    response = client.post(
        "/users/register",
        json={"username": "user2", "email": "user2@example.com", "password": "password123"}
    )
    user2_id = response.json()["id"]
    
    response = client.post(
        "/friends/request",
        json={"friend_id": user2_id},
        headers={"X-User-ID": user1_id}
    )
    
    relation_id = None
    for rel_id, relation in friends_db.items():
        if relation.user_id == user1_id and relation.friend_id == user2_id:
            relation_id = rel_id
            break
    
    client.post(
        f"/friends/accept/{relation_id}",
        headers={"X-User-ID": user2_id}
    )
    
    client.post(
        "/activities/",
        json={
            "title": "User1 Activity",
            "description": "Activity from user 1",
            "weather_data": {
                "temperature": 75.5,
                "humidity": 65.0,
                "conditions": "Sunny",
                "precipitation": 0.0
            },
            "gardening_actions": ["planting"],
            "photos": []
        },
        headers={"X-User-ID": user1_id}
    )
    
    client.post(
        "/activities/",
        json={
            "title": "User2 Activity",
            "description": "Activity from user 2",
            "weather_data": {
                "temperature": 80.0,
                "humidity": 70.0,
                "conditions": "Partly Cloudy",
                "precipitation": 0.0
            },
            "gardening_actions": ["weeding"],
            "photos": []
        },
        headers={"X-User-ID": user2_id}
    )
    
    response = client.get(
        "/feed/",
        headers={"X-User-ID": user1_id}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["activities"]) == 2
    
    titles = [activity["title"] for activity in data["activities"]]
    assert "User1 Activity" in titles
    assert "User2 Activity" in titles

def test_get_recommendations():
    users_db.clear()
    
    response = client.post(
        "/users/register",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    
    user_id = response.json()["id"]
    
    response = client.get(
        "/feed/recommendations",
        headers={"X-User-ID": user_id}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    
    for recommendation in data:
        assert "title" in recommendation
        assert "description" in recommendation
        assert "reason" in recommendation
