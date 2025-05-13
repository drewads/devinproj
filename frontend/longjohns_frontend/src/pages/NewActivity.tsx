import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createActivity } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Thermometer, Droplets, Cloud, Upload, Plus, Trash2 } from 'lucide-react';

export default function NewActivity() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [conditions, setConditions] = useState('');
  const [precipitation, setPrecipitation] = useState('');
  const [gardeningActions, setGardeningActions] = useState<string[]>(['']);
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddAction = () => {
    setGardeningActions([...gardeningActions, '']);
  };

  const handleRemoveAction = (index: number) => {
    const updatedActions = [...gardeningActions];
    updatedActions.splice(index, 1);
    setGardeningActions(updatedActions);
  };

  const handleActionChange = (index: number, value: string) => {
    const updatedActions = [...gardeningActions];
    updatedActions[index] = value;
    setGardeningActions(updatedActions);
  };

  const handleAddPhoto = () => {
    const photoName = `photo_${Date.now()}.jpg`;
    setPhotos([...photos, photoName]);
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!temperature) {
      setError('Temperature is required');
      return;
    }
    
    const filteredActions = gardeningActions.filter(action => action.trim());
    if (filteredActions.length === 0) {
      setError('At least one gardening action is required');
      return;
    }
    
    try {
      setLoading(true);
      
      await createActivity(
        title,
        description,
        {
          temperature: parseFloat(temperature),
          humidity: humidity ? parseFloat(humidity) : undefined,
          conditions: conditions || undefined,
          precipitation: precipitation ? parseFloat(precipitation) : undefined,
        },
        filteredActions,
        photos
      );
      
      navigate('/profile');
    } catch (error) {
      console.error('Error creating activity:', error);
      setError('Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">New Gardening Activity</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
            <CardDescription>
              Tell us about your gardening activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Spring Planting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you did in your garden..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Weather Conditions</CardTitle>
            <CardDescription>
              Record the weather during your activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center">
                  <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
                  Temperature (°F)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  placeholder="e.g., 75"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="humidity" className="flex items-center">
                  <Droplets className="mr-2 h-4 w-4 text-blue-500" />
                  Humidity (%)
                </Label>
                <Input
                  id="humidity"
                  type="number"
                  placeholder="e.g., 65"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conditions" className="flex items-center">
                  <Cloud className="mr-2 h-4 w-4 text-gray-500" />
                  Conditions
                </Label>
                <Input
                  id="conditions"
                  placeholder="e.g., Sunny, Cloudy, Rainy"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="precipitation" className="flex items-center">
                  <Cloud className="mr-2 h-4 w-4 text-blue-500" />
                  Precipitation (inches)
                </Label>
                <Input
                  id="precipitation"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0.5"
                  value={precipitation}
                  onChange={(e) => setPrecipitation(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gardening Actions</CardTitle>
            <CardDescription>
              What gardening activities did you perform?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gardeningActions.map((action, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder={`Action ${index + 1} (e.g., Planting, Weeding, Watering)`}
                  value={action}
                  onChange={(e) => handleActionChange(index, e.target.value)}
                />
                {gardeningActions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveAction(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAction}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Action
            </Button>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Add photos of your gardening activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative bg-gray-100 p-4 rounded-md flex flex-col items-center">
                    <div className="text-gray-500 mb-2">{photo}</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleAddPhoto}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
            <p className="text-xs text-gray-500">
              Note: In this prototype, photos are simulated and not actually uploaded.
            </p>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Activity'}
          </Button>
        </div>
      </form>
    </div>
  );
}
