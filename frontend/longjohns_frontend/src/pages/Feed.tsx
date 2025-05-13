import React, { useEffect, useState } from 'react';
import { getFeed, getRecommendations } from '../services/api';
import { Activity, Recommendation } from '../types';
import ActivityCard from '../components/ActivityCard';
import RecommendationCard from '../components/RecommendationCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Feed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedData = await getFeed();
        setActivities(feedData.activities);
        
        const recommendationsData = await getRecommendations();
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Lawn Johns</h1>
      
      <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed">
          {loading ? (
            <p>Loading feed...</p>
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
                <p>Your feed is empty. Add friends or create activities to see them here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="recommendations">
          {loading ? (
            <p>Loading recommendations...</p>
          ) : recommendations.length > 0 ? (
            <div>
              {recommendations.map((recommendation, index) => (
                <RecommendationCard key={index} recommendation={recommendation} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No gardening recommendations available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
