import { Recommendation } from '../types';
import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <Card className="mb-4 border-l-4 border-l-yellow-400">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Lightbulb className="text-yellow-500 mr-2" size={20} />
          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{recommendation.description}</p>
        <CardDescription className="text-xs italic">
          {recommendation.reason}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
