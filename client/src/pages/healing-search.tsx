import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface HealingCode {
  id: number;
  code: string;
  description: string;
  category: string | null;
}

interface SemanticSearchResult {
  matched_codes: HealingCode[];
  semantic_match: boolean;
  explanation: string;
  recommended_practice: string;
}

export default function HealingSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const { toast } = useToast();

  // Basic keyword search query
  const keywordSearchQuery = useQuery({
    queryKey: ['/api/healing-codes', searchTerm],
    queryFn: async () => {
      const url = searchTerm
        ? `/api/healing-codes?search=${encodeURIComponent(searchTerm)}`
        : '/api/healing-codes';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch healing codes');
      }
      return response.json() as Promise<HealingCode[]>;
    },
    enabled: searchTerm !== '',
  });

  // Semantic search mutation
  const semanticSearchMutation = useMutation({
    mutationFn: async (issue: string) => {
      const response = await apiRequest('POST', '/api/healing-codes/semantic', {
        issue,
        limit: 10,
      });
      return await response.json();
    },
    onSuccess: (data: SemanticSearchResult) => {
      if (data.semantic_match) {
        toast({
          title: 'Semantic Search Complete',
          description: 'Found personalized healing codes based on your description.',
        });
      } else {
        toast({
          title: 'Basic Matching Used',
          description: data.explanation,
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Search Failed',
        description: 'Could not perform healing code search. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handler for keyword search
  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    keywordSearchQuery.refetch();
  };

  // Handler for semantic search
  const handleSemanticSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (issueDescription.trim()) {
      semanticSearchMutation.mutate(issueDescription);
    } else {
      toast({
        title: 'Description Required',
        description: 'Please describe your issue for semantic search.',
        variant: 'destructive',
      });
    }
  };

  // Render healing code cards
  const renderHealingCodes = (codes: HealingCode[]) => {
    if (codes.length === 0) {
      return (
        <p className="text-center text-gray-500 py-6">
          No healing codes found. Try a different search term.
        </p>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {codes.map((code) => (
          <Card key={code.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-mono text-xl tracking-wide">
                {code.code}
              </CardTitle>
              <CardDescription>
                {code.category || 'General Purpose'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{code.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(code.code);
                  toast({
                    title: 'Code Copied',
                    description: 'Healing code copied to clipboard',
                  });
                }}
              >
                Copy Code
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
        Sacred Healing Codes
      </h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Access ancient numerical codes for healing various conditions. Use keyword
        search to find specific codes or try semantic search for personalized recommendations.
      </p>

      <Tabs defaultValue="keyword" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="keyword">Keyword Search</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Search</TabsTrigger>
        </TabsList>

        <TabsContent value="keyword" className="p-4 border rounded-lg mt-4">
          <form onSubmit={handleKeywordSearch} className="flex gap-2 mb-6">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword (e.g., headache, love, protection)"
              className="flex-grow"
            />
            <Button type="submit" disabled={keywordSearchQuery.isLoading}>
              {keywordSearchQuery.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </form>

          {keywordSearchQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : keywordSearchQuery.data ? (
            renderHealingCodes(keywordSearchQuery.data)
          ) : searchTerm ? (
            <p className="text-center text-gray-500 py-6">
              Enter a search term and click Search to find healing codes.
            </p>
          ) : (
            <p className="text-center text-gray-500 py-6">
              Enter a search term and click Search to find healing codes.
            </p>
          )}
        </TabsContent>

        <TabsContent value="semantic" className="p-4 border rounded-lg mt-4">
          <form onSubmit={handleSemanticSearch} className="mb-6">
            <Textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Describe your issue in detail for a personalized healing code recommendation..."
              className="mb-2 h-32"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={semanticSearchMutation.isPending}
            >
              {semanticSearchMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Healing Code Recommendations'
              )}
            </Button>
          </form>

          {semanticSearchMutation.isPending ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">
                  Using sacred algorithms to analyze your description...
                </p>
              </div>
            </div>
          ) : semanticSearchMutation.data ? (
            <div>
              <div className="bg-muted p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2">Analysis</h3>
                <p className="mb-4">{semanticSearchMutation.data.explanation}</p>
                <h3 className="font-bold mb-2">Recommended Practice</h3>
                <p>{semanticSearchMutation.data.recommended_practice}</p>
              </div>
              {renderHealingCodes(semanticSearchMutation.data.matched_codes)}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">
              Describe your issue for personalized healing code recommendations.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}