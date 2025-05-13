import uuid
from fastapi import APIRouter, HTTPException, Header, Depends
from typing import List, Optional

from ..schemas.schemas import FriendRequest, FriendResponse
from ..models.models import FriendRelation, users_db, friends_db

router = APIRouter(prefix="/friends", tags=["friends"])

async def get_user_id(x_user_id: Optional[str] = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-ID header is required")
    return x_user_id

@router.post("/request", response_model=FriendResponse)
async def send_friend_request(request: FriendRequest, user_id: str = Depends(get_user_id)):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    if request.friend_id not in users_db:
        raise HTTPException(status_code=404, detail="Friend not found")
    
    for relation_id, relation in friends_db.items():
        if (relation.user_id == user_id and relation.friend_id == request.friend_id) or \
           (relation.user_id == request.friend_id and relation.friend_id == user_id):
            if relation.status == "accepted":
                raise HTTPException(status_code=400, detail="Already friends")
            elif relation.status == "pending":
                raise HTTPException(status_code=400, detail="Friend request already pending")
    
    relation_id = str(uuid.uuid4())
    relation = FriendRelation(user_id=user_id, friend_id=request.friend_id)
    friends_db[relation_id] = relation
    
    friend = users_db[request.friend_id]
    return FriendResponse(
        id=friend.id,
        username=friend.username,
        status="pending"
    )

@router.post("/accept/{relation_id}", response_model=FriendResponse)
async def accept_friend_request(relation_id: str, user_id: str = Depends(get_user_id)):
    if relation_id not in friends_db:
        raise HTTPException(status_code=404, detail="Friend request not found")
    
    relation = friends_db[relation_id]
    
    if relation.friend_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to accept this request")
    
    relation.status = "accepted"
    
    friend = users_db[relation.user_id]
    return FriendResponse(
        id=friend.id,
        username=friend.username,
        status="accepted"
    )

@router.post("/reject/{relation_id}")
async def reject_friend_request(relation_id: str, user_id: str = Depends(get_user_id)):
    if relation_id not in friends_db:
        raise HTTPException(status_code=404, detail="Friend request not found")
    
    relation = friends_db[relation_id]
    
    if relation.friend_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to reject this request")
    
    relation.status = "rejected"
    
    return {"message": "Friend request rejected"}

@router.get("/", response_model=List[FriendResponse])
async def get_friends(user_id: str = Depends(get_user_id)):
    friends = []
    for relation_id, relation in friends_db.items():
        if relation.status == "accepted":
            if relation.user_id == user_id:
                friend = users_db[relation.friend_id]
                friends.append(FriendResponse(
                    id=friend.id,
                    username=friend.username,
                    status="accepted"
                ))
            elif relation.friend_id == user_id:
                friend = users_db[relation.user_id]
                friends.append(FriendResponse(
                    id=friend.id,
                    username=friend.username,
                    status="accepted"
                ))
    
    return friends

@router.get("/requests", response_model=List[FriendResponse])
async def get_friend_requests(user_id: str = Depends(get_user_id)):
    requests = []
    for relation_id, relation in friends_db.items():
        if relation.status == "pending" and relation.friend_id == user_id:
            friend = users_db[relation.user_id]
            requests.append(FriendResponse(
                id=friend.id,
                username=friend.username,
                status="pending"
            ))
    
    return requests
