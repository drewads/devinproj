# Lawn Johns - Gardening Social Media Platform

A Strava-like social media platform for gardening and farming enthusiasts. Share your gardening activities, connect with friends, and get seasonal recommendations.

## Features

- User authentication (register/login)
- Activity feed from friends and neighborhood
- Friend management system
- Create gardening activities with weather data and photos
- Seasonal and weather-based recommendations

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- npm or yarn (for frontend package management)

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/drewads/devinproj.git
cd devinproj/longjohns
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/longjohns_backend
```

2. Install dependencies using Poetry (if you have Poetry installed):
```bash
poetry install
```

Alternatively, you can use pip:
```bash
pip install fastapi uvicorn pytest httpx
```

3. Start the backend server:
```bash
python -m uvicorn app.main:app --reload
```

The backend server will run at http://localhost:8000

You can access the API documentation at http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../../frontend/longjohns_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Register a new account or login with an existing account
3. Explore the feed, add friends, and create gardening activities
4. View your profile to see your activities
5. Check recommendations based on the current season and weather

## Testing

### Backend Tests

Run the backend tests from the backend directory:
```bash
cd backend/longjohns_backend
pytest
```

### Frontend Testing

The frontend can be manually tested by navigating through the application and verifying that all features work as expected.

## Notes

- This is a prototype implementation with an in-memory database
- Data will be lost when the server restarts
- Weather data and photos are simulated for the prototype

## Project Structure

- `backend/` - FastAPI backend application
  - `app/` - Main application code
    - `models/` - Data models
    - `routers/` - API endpoints
    - `schemas/` - Pydantic schemas
  - `tests/` - Backend unit tests

- `frontend/` - React frontend application
  - `src/` - Source code
    - `components/` - Reusable UI components
    - `context/` - React context providers
    - `pages/` - Application pages
    - `services/` - API service functions
    - `types/` - TypeScript type definitions
