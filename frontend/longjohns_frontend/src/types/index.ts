export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Friend {
  id: string;
  username: string;
  status: string;
  relation_id?: string;
}

export interface WeatherData {
  temperature: number;
  humidity?: number;
  conditions?: string;
  precipitation?: number;
}

export interface Activity {
  id: string;
  user_id: string;
  username: string;
  title: string;
  description: string;
  weather_data: WeatherData;
  gardening_actions: string[];
  photos: string[];
  created_at: string;
}

export interface Recommendation {
  title: string;
  description: string;
  reason: string;
}
