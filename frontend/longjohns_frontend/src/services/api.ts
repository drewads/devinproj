import { User, Activity, Friend, Recommendation } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const userId = localStorage.getItem('userId');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(userId && { 'X-User-ID': userId }),
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Something went wrong');
  }
  
  return response.json();
};

export const registerUser = async (username: string, email: string, password: string): Promise<User> => {
  return apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
};

export const loginUser = async (email: string, password: string): Promise<{ id: string; username: string; email: string }> => {
  return apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const getCurrentUser = async (): Promise<User> => {
  const userId = localStorage.getItem('userId');
  return apiRequest(`/users/${userId}`);
};

export const getFriends = async (): Promise<Friend[]> => {
  return apiRequest('/friends/');
};

export const getFriendRequests = async (): Promise<Friend[]> => {
  return apiRequest('/friends/requests');
};

export const sendFriendRequest = async (friendId: string): Promise<Friend> => {
  return apiRequest('/friends/request', {
    method: 'POST',
    body: JSON.stringify({ friend_id: friendId }),
  });
};

export const acceptFriendRequest = async (relationId: string): Promise<Friend> => {
  return apiRequest(`/friends/accept/${relationId}`, {
    method: 'POST',
  });
};

export const rejectFriendRequest = async (relationId: string): Promise<{ message: string }> => {
  return apiRequest(`/friends/reject/${relationId}`, {
    method: 'POST',
  });
};

export const createActivity = async (
  title: string,
  description: string,
  weatherData: {
    temperature: number;
    humidity?: number;
    conditions?: string;
    precipitation?: number;
  },
  gardeningActions: string[],
  photos: string[] = []
): Promise<Activity> => {
  return apiRequest('/activities/', {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      weather_data: weatherData,
      gardening_actions: gardeningActions,
      photos,
    }),
  });
};

export const getUserActivities = async (): Promise<Activity[]> => {
  return apiRequest('/activities/');
};

export const getActivity = async (activityId: string): Promise<Activity> => {
  return apiRequest(`/activities/${activityId}`);
};

export const getFeed = async (): Promise<{ activities: Activity[] }> => {
  return apiRequest('/feed/');
};

export const getNeighborhoodFeed = async (): Promise<{ activities: Activity[] }> => {
  return apiRequest('/feed/neighborhood');
};

export const getRecommendations = async (): Promise<Recommendation[]> => {
  return apiRequest('/feed/recommendations');
};
