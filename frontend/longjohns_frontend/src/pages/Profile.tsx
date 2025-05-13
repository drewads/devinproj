import React, { useEffect, useState } from 'react';
import { getUserActivities } from '../services/api';
import { Activity } from '../types';
import { useAuth } from '../context/AuthContext';
import ActivityCard from '../components/ActivityCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { User } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const userActivities = await getUserActivities();
        setActivities(userActivities);
      } catch (error) {
        console.error('Error fetching user activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center">
          <div className="bg-green-100 p-4 rounded-full mr-4">
            <User size={48} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Activities</h2>
      
      {loading ? (
        <p>Loading activities...</p>
      ) : activities.length > 0 ? (
        <div>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No activities yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You haven't created any gardening activities yet. Create your first activity to see it here!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
