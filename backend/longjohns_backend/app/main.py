from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from .routers import users, friends, activities, feed

app = FastAPI(title="Lawn Johns API", description="Gardening Social Media API")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

async def get_current_user(x_user_id: Optional[str] = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-ID header is required")
    return x_user_id

app.include_router(users.router)
app.include_router(friends.router, dependencies=[Depends(get_current_user)])
app.include_router(activities.router, dependencies=[Depends(get_current_user)])
app.include_router(feed.router, dependencies=[Depends(get_current_user)])

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "message": "Welcome to Lawn Johns API",
        "description": "A gardening social media platform",
        "docs": "/docs"
    }
