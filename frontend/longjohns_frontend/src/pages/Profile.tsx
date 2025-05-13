import { useEffect, useState } from 'react';
import { getUserActivities } from '../services/api';
import { Activity } from '../types';
import { useAuth } from '../context/AuthContext';
import ActivityCard from '../components/ActivityCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function Profile() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

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

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied to clipboard!`);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      {copySuccess && (
        <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
          <AlertDescription>{copySuccess}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center">
          <div className="bg-green-100 p-4 rounded-full mr-4">
            <User size={48} className="text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 flex items-center" 
                onClick={() => copyToClipboard(user?.username || '', 'Username')}
              >
                {copySuccess === 'Username copied to clipboard!' ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                Copy
              </Button>
            </div>
            <p className="text-gray-500">{user?.email}</p>
            <div className="mt-2 p-2 bg-gray-100 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Your User ID: <span className="font-mono font-semibold">{user?.id}</span>
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2 flex items-center" 
                  onClick={() => copyToClipboard(user?.id || '', 'User ID')}
                >
                  {copySuccess === 'User ID copied to clipboard!' ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Share this ID with friends who want to add you</p>
            </div>
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
