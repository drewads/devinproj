import { Activity } from '../types';
import { Calendar, Thermometer, Droplets, Cloud, Image } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-green-700">{activity.title}</CardTitle>
            <CardDescription className="text-sm">
              By {activity.username} • {formatDate(activity.created_at)}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-gray-500">{formatDate(activity.created_at)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{activity.description}</p>
        
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Weather Conditions</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center">
              <Thermometer size={16} className="text-orange-500 mr-2" />
              <span>{activity.weather_data.temperature}°F</span>
            </div>
            {activity.weather_data.humidity && (
              <div className="flex items-center">
                <Droplets size={16} className="text-blue-500 mr-2" />
                <span>{activity.weather_data.humidity}% Humidity</span>
              </div>
            )}
            {activity.weather_data.conditions && (
              <div className="flex items-center">
                <Cloud size={16} className="text-gray-500 mr-2" />
                <span>{activity.weather_data.conditions}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Gardening Actions</h4>
          <div className="flex flex-wrap gap-2">
            {activity.gardening_actions.map((action, index) => (
              <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {action}
              </Badge>
            ))}
          </div>
        </div>
        
        {activity.photos.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Photos</h4>
            <div className="grid grid-cols-2 gap-2">
              {activity.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                  <Image size={24} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">{photo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="flex justify-between w-full text-sm text-gray-500">
          <span>Activity ID: {activity.id.substring(0, 8)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
