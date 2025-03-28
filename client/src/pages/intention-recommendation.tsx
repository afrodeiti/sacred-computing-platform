import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface IntentionRecommendation {
  original_input: string;
  recommended_intention: string;
  reason: string;
  suggested_field_type: string;
  suggested_frequency: number;
}

export default function IntentionRecommendation() {
  const [userInput, setUserInput] = useState('');
  const [context, setContext] = useState('general');
  const { toast } = useToast();

  // Intention recommendation mutation
  const recommendationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/intention-recommendation', {
        userInput,
        context,
      });
      return await response.json() as IntentionRecommendation;
    },
    onSuccess: () => {
      toast({
        title: 'Intention Formulated',
        description: 'Your intention has been optimized for maximum effectiveness.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Recommendation Failed',
        description: 'Could not generate intention recommendation. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handler for generating recommendation
  const handleGenerateRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      recommendationMutation.mutate();
    } else {
      toast({
        title: 'Input Required',
        description: 'Please enter your intention.',
        variant: 'destructive',
      });
    }
  };

  // Handler for copying intention
  const handleCopyIntention = () => {
    if (recommendationMutation.data) {
      navigator.clipboard.writeText(recommendationMutation.data.recommended_intention);
      toast({
        title: 'Copied to Clipboard',
        description: 'Sacred intention has been copied to your clipboard.',
      });
    }
  };

  const getFieldTypeName = (type: string) => {
    const types: {[key: string]: string} = {
      torus: 'Torus Field',
      merkaba: 'Merkaba',
      metatron: 'Metatron\'s Cube',
      sri_yantra: 'Sri Yantra',
      flower_of_life: 'Flower of Life',
    };
    return types[type] || type;
  };

  const getFieldTypeDescription = (type: string) => {
    const descriptions: {[key: string]: string} = {
      torus: 'A donut-shaped energy field that circulates intention energy through its central axis.',
      merkaba: 'A counter-rotating energy field that creates a protective and transformational vehicle.',
      metatron: 'A complex sacred geometric pattern containing all Platonic solids for multidimensional transformation.',
      sri_yantra: 'An ancient sacred geometry pattern representing the cosmos and divine feminine energy.',
      flower_of_life: 'A pattern consisting of overlapping circles creating a flower-like structure that represents creation.',
    };
    return descriptions[type] || '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
        Sacred Intention Formulator
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Transform your desires into optimized intentions by leveraging sacred geometry 
        principles and divine frequencies for maximum manifestation potential.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Create Your Intention</CardTitle>
            <CardDescription>
              Enter what you want to manifest or heal, then select the appropriate context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateRecommendation} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="intention-input" className="text-sm font-medium">
                  Your Desire or Goal
                </label>
                <Textarea
                  id="intention-input"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter what you want to manifest, heal, or transform..."
                  className="h-28"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="context-select" className="text-sm font-medium">
                  Intention Context
                </label>
                <Select
                  value={context}
                  onValueChange={setContext}
                >
                  <SelectTrigger id="context-select">
                    <SelectValue placeholder="Select a context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Purpose</SelectItem>
                    <SelectItem value="healing">Physical/Emotional Healing</SelectItem>
                    <SelectItem value="manifestation">Material Manifestation</SelectItem>
                    <SelectItem value="protection">Protection & Safety</SelectItem>
                    <SelectItem value="transformation">Personal Transformation</SelectItem>
                    <SelectItem value="connection">Spiritual Connection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={recommendationMutation.isPending}
              >
                {recommendationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Formulating...
                  </>
                ) : (
                  'Formulate Sacred Intention'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Optimized Intention</CardTitle>
            <CardDescription>
              Your intention formatted for maximum effectiveness
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendationMutation.isPending ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">
                    Aligning with divine intelligence...
                  </p>
                </div>
              </div>
            ) : recommendationMutation.data ? (
              <>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-lg font-medium italic">
                    "{recommendationMutation.data.recommended_intention}"
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Why This Works:</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {recommendationMutation.data.reason}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Recommended Field:</h3>
                      <p className="text-sm">
                        {getFieldTypeName(recommendationMutation.data.suggested_field_type)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getFieldTypeDescription(recommendationMutation.data.suggested_field_type)}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Optimal Frequency:</h3>
                      <p className="text-sm">
                        {recommendationMutation.data.suggested_frequency} Hz
                      </p>
                      {recommendationMutation.data.suggested_frequency === 7.83 && (
                        <p className="text-xs text-gray-500">
                          Schumann resonance (Earth's natural frequency)
                        </p>
                      )}
                      {recommendationMutation.data.suggested_frequency === 528 && (
                        <p className="text-xs text-gray-500">
                          DNA repair frequency ("Miracle tone")
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleCopyIntention}>
                  Copy Intention
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Enter your desire and click "Formulate Sacred Intention"</p>
                <p className="text-sm mt-2">
                  Your intention will be optimized with the perfect phrasing, sacred 
                  geometry field, and frequency.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 bg-muted/50 p-6 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-3">How to Use Your Sacred Intention</h2>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>Copy your formulated intention</li>
          <li>Find a quiet space where you won't be disturbed</li>
          <li>Take 3 deep breaths to center yourself</li>
          <li>Visualize the recommended sacred geometry field surrounding you</li>
          <li>Recite the intention 9 times with clear focus and belief</li>
          <li>End by expressing gratitude to the universal consciousness</li>
        </ol>
        <p className="mt-4 text-sm">
          For maximum effectiveness, repeat this practice daily for 21 days, 
          preferably at the same time each day.
        </p>
      </div>
    </div>
  );
}