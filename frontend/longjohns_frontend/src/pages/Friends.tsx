import React, { useEffect, useState } from 'react';
import { getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../services/api';
import { Friend } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { UserPlus, UserCheck, UserX } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendId, setFriendId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('friends');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsData = await getFriends();
        setFriends(friendsData);
        
        const requestsData = await getFriendRequests();
        setFriendRequests(requestsData);
      } catch (error) {
        console.error('Error fetching friends data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!friendId.trim()) {
      setError('Please enter a friend ID');
      return;
    }
    
    try {
      await sendFriendRequest(friendId);
      setSuccess('Friend request sent successfully');
      setFriendId('');
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Failed to send friend request. Make sure the ID is valid.');
    }
  };

  const handleAcceptRequest = async (relationId: string) => {
    try {
      await acceptFriendRequest(relationId);
      
      const updatedRequests = friendRequests.filter(request => request.id !== relationId);
      setFriendRequests(updatedRequests);
      
      const friendsData = await getFriends();
      setFriends(friendsData);
      
      setSuccess('Friend request accepted');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError('Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (relationId: string) => {
    try {
      await rejectFriendRequest(relationId);
      
      const updatedRequests = friendRequests.filter(request => request.id !== relationId);
      setFriendRequests(updatedRequests);
      
      setSuccess('Friend request rejected');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      setError('Failed to reject friend request');
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Friend</CardTitle>
          <CardDescription>Send a friend request using their user ID</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendRequest} className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="friendId" className="sr-only">Friend ID</Label>
              <Input
                id="friendId"
                placeholder="Enter friend's user ID"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
              />
            </div>
            <Button type="submit">
              <UserPlus className="mr-2 h-4 w-4" />
              Send Request
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="friends" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="friends">My Friends</TabsTrigger>
          <TabsTrigger value="requests">Friend Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="friends">
          {loading ? (
            <p>Loading friends...</p>
          ) : friends.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {friends.map((friend) => (
                <Card key={friend.id}>
                  <CardHeader>
                    <CardTitle>{friend.username}</CardTitle>
                    <CardDescription>User ID: {friend.id}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <UserCheck className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No friends yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You don't have any friends yet. Send friend requests to connect with other gardeners.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="requests">
          {loading ? (
            <p>Loading friend requests...</p>
          ) : friendRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {friendRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle>{request.username}</CardTitle>
                    <CardDescription>User ID: {request.id}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <Button onClick={() => handleAcceptRequest(request.id)} className="flex-1 mr-2">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button onClick={() => handleRejectRequest(request.id)} variant="outline" className="flex-1">
                      <UserX className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No pending requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You don't have any pending friend requests.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
