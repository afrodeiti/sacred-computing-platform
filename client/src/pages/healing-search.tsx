import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";

interface HealingCode {
  id: number;
  code: string;
  description: string;
  category: string;
  affirmation?: string;
}

interface SemanticSearchResult {
  matched_codes: HealingCode[];
  semantic_match: boolean;
  explanation: string;
  recommended_practice: string;
}

export default function HealingSearch() {
  const [issueDescription, setIssueDescription] = useState("");
  const { toast } = useToast();
  
  const searchMutation = useMutation({
    mutationFn: async (issue: string): Promise<SemanticSearchResult> => {
      const response = await apiRequest('POST', '/api/healing-codes/semantic', { issue });
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: "Unable to search for healing codes. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) {
      toast({
        title: "Description required",
        description: "Please describe your health issue or concern.",
        variant: "destructive",
      });
      return;
    }
    
    searchMutation.mutate(issueDescription);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 border-gray-700 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Sacred Healing Code Search</CardTitle>
              <CardDescription className="text-gray-400">
                Describe your health concern or emotional issue and we'll find the most appropriate healing codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Describe your issue or concern
                  </label>
                  <Textarea
                    placeholder="E.g., I've been experiencing anxiety and trouble sleeping..."
                    className="bg-gray-900 border-gray-700 text-white"
                    rows={5}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  disabled={searchMutation.isPending}
                >
                  {searchMutation.isPending ? "Searching..." : "Find Healing Codes"}
                </Button>
              </form>
              
              {searchMutation.isSuccess && searchMutation.data.matched_codes.length > 0 && (
                <div className="mt-8 space-y-6">
                  <div className="rounded-lg bg-gray-900 p-4 border border-gray-700">
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Recommended Practice</h3>
                    <p className="text-gray-300">{searchMutation.data.recommended_practice}</p>
                    {searchMutation.data.explanation && (
                      <div className="mt-4 text-sm text-gray-400">
                        <p><em>{searchMutation.data.explanation}</em></p>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-medium text-gray-200">Matched Healing Codes</h3>
                  <div className="space-y-4">
                    {searchMutation.data.matched_codes.map((code) => (
                      <Card key={code.id} className="bg-gray-900 border-gray-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-bold font-mono text-amber-400">
                            {code.code}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Category: {code.category}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300">{code.description}</p>
                          {code.affirmation && (
                            <div className="mt-2">
                              <p className="text-purple-400 italic">"{code.affirmation}"</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {searchMutation.isSuccess && searchMutation.data.matched_codes.length === 0 && (
                <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700 text-center">
                  <p className="text-gray-300">No matching healing codes found. Try describing your issue differently.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}