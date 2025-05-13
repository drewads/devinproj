import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.models import users_db

client = TestClient(app)

def test_register_user():
    users_db.clear()
    
    response = client.post(
        "/users/register",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "created_at" in data
    
    response = client.post(
        "/users/register",
        json={"username": "testuser2", "email": "test@example.com", "password": "password123"}
    )
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_user():
    users_db.clear()
    
    response = client.post(
        "/users/register",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    
    response = client.post(
        "/users/login",
        json={"email": "test@example.com", "password": "password123"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "id" in data
    
    response = client.post(
        "/users/login",
        json={"email": "test@example.com", "password": "wrongpassword"}
    )
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_get_user():
    users_db.clear()
    
    response = client.post(
        "/users/register",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    
    user_id = response.json()["id"]
    
    response = client.get(f"/users/{user_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert data["id"] == user_id
    
    response = client.get("/users/nonexistent-id")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"
