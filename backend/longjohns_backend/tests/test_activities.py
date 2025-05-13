import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.models import users_db, activities_db

client = TestClient(app)

def test_create_activity():
    users_db.clear()
    activities_db.clear()
    
    response = client.post(
        "/users/register",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    
    user_id = response.json()["id"]
    
    response = client.post(
        "/activities/",
        json={
            "title": "Spring Planting",
            "description": "Planted tomatoes and peppers",
            "weather_data": {
                "temperature": 75.5,
                "humidity": 65.0,
                "conditions": "Sunny",
                "precipitation": 0.0
            },
            "gardening_actions": ["planting", "watering"],
            "photos": ["photo1.jpg", "photo2.jpg"]
        },
        headers={"X-User-ID": user_id}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Spring Planting"
    assert data["description"] == "Planted tomatoes and peppers"
    assert data["weather_data"]["temperature"] == 75.5
    assert data["gardening_actions"] == ["planting", "watering"]
    assert data["photos"] == ["photo1.jpg", "photo2.jpg"]
    assert data["user_id"] == user_id
    assert "id" in data
    assert "created_at" in data
    
    response = client.post(
        "/activities/",
        json={
            "title": "Spring Planting",
            "description": "Planted tomatoes and peppers",
            "weather_data": {
                "temperature": 75.5,
                "humidity": 65.0,
                "conditions": "Sunny",
                "precipitation": 0.0
            },
            "gardening_actions": ["planting", "watering"],
            "photos": ["photo1.jpg", "photo2.jpg"]
        },
        headers={"X-User-ID": "nonexistent-id"}
    )
    
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"

def test_get_user_activities():
    users_db.clear()
    activities_db.clear()
    
    response = client.post(
        "/users/register",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    
    user_id = response.json()["id"]
    
    client.post(
        "/activities/",
        json={
            "title": "Spring Planting",
            "description": "Planted tomatoes and peppers",
            "weather_data": {
                "temperature": 75.5,
                "humidity": 65.0,
                "conditions": "Sunny",
                "precipitation": 0.0
            },
            "gardening_actions": ["planting", "watering"],
            "photos": ["photo1.jpg", "photo2.jpg"]
        },
        headers={"X-User-ID": user_id}
    )
    
    client.post(
        "/activities/",
        json={
            "title": "Weeding",
            "description": "Removed weeds from garden beds",
            "weather_data": {
                "temperature": 80.0,
                "humidity": 70.0,
                "conditions": "Partly Cloudy",
                "precipitation": 0.0
            },
            "gardening_actions": ["weeding"],
            "photos": []
        },
        headers={"X-User-ID": user_id}
    )
    
    response = client.get(
        "/activities/",
        headers={"X-User-ID": user_id}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] in ["Spring Planting", "Weeding"]
    assert data[1]["title"] in ["Spring Planting", "Weeding"]
    assert data[0]["user_id"] == user_id
    assert data[1]["user_id"] == user_id
