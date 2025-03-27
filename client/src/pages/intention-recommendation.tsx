import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import { useSacred } from "@/context/sacred-context";

interface IntentionRecommendation {
  original_input: string;
  recommended_intention: string;
  reason: string;
  suggested_field_type: string;
  suggested_frequency: number;
}

export default function IntentionRecommendation() {
  const [userInput, setUserInput] = useState("");
  const [context, setContext] = useState("general");
  const { toast } = useToast();
  const { sendIntention } = useSacred();
  
  const recommendationMutation = useMutation({
    mutationFn: async (data: { userInput: string; context: string }): Promise<IntentionRecommendation> => {
      const response = await apiRequest('POST', '/api/intention-recommendation', data);
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Recommendation failed",
        description: "Unable to generate intention recommendation. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter your desired intention or outcome.",
        variant: "destructive",
      });
      return;
    }
    
    recommendationMutation.mutate({ userInput, context });
  };
  
  const handleApplyIntention = () => {
    if (recommendationMutation.data) {
      const { recommended_intention, suggested_field_type, suggested_frequency } = recommendationMutation.data;
      
      sendIntention(recommended_intention, suggested_frequency, suggested_field_type);
      
      toast({
        title: "Intention Applied",
        description: "Your optimized intention has been broadcast to the sacred field.",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 border-gray-700 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Sacred Intention Optimizer
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter your desired outcome and receive an optimized intention statement for manifestation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="input" className="text-gray-300">
                    What would you like to manifest or experience?
                  </Label>
                  <Input
                    id="input"
                    placeholder="E.g., better health, financial abundance, a new job..."
                    className="bg-gray-900 border-gray-700 text-white"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="context" className="text-gray-300">
                    Intention Context
                  </Label>
                  <Select value={context} onValueChange={setContext}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select context" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="general">General Purpose</SelectItem>
                      <SelectItem value="healing">Physical Healing</SelectItem>
                      <SelectItem value="manifestation">Manifestation</SelectItem>
                      <SelectItem value="protection">Protection</SelectItem>
                      <SelectItem value="transformation">Transformation</SelectItem>
                      <SelectItem value="connection">Connection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  disabled={recommendationMutation.isPending}
                >
                  {recommendationMutation.isPending ? "Optimizing..." : "Optimize Intention"}
                </Button>
              </form>
              
              {recommendationMutation.isSuccess && (
                <div className="mt-8 space-y-6">
                  <div className="rounded-lg bg-gray-900 p-4 border border-gray-700 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-200 mb-2">Optimized Intention</h3>
                      <p className="text-xl font-medium text-indigo-400">
                        "{recommendationMutation.data.recommended_intention}"
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Suggested Field</h4>
                        <p className="text-indigo-400 capitalize">{recommendationMutation.data.suggested_field_type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Resonant Frequency</h4>
                        <p className="text-indigo-400">{recommendationMutation.data.suggested_frequency} Hz</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Optimization Explanation</h4>
                      <p className="text-gray-400">{recommendationMutation.data.reason}</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleApplyIntention}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  >
                    Apply and Broadcast Intention
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}