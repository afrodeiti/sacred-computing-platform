import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSacred } from "@/context/sacred-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HealingCode {
  id: number;
  code: string;
  description: string;
  category?: string;
}

export default function HealingCodes() {
  const { setIntention } = useSacred();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: healingCodes = [], isLoading } = useQuery<HealingCode[]>({
    queryKey: ['/api/healing-codes', searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/healing-codes?search=${encodeURIComponent(searchQuery)}` 
        : '/api/healing-codes';
      const res = await fetch(url);
      return res.json();
    }
  });
  
  const applyHealingCode = (code: string) => {
    setIntention(code);
  };
  
  return (
    <div className="bg-black p-4 rounded-lg border border-purple-800/20 dark:bg-sacred-black">
      <h2 className="font-medium text-lg mb-3 text-white font-montserrat">Healing Codes</h2>
      <p className="text-sm text-gray-400 mb-4">Access divine numerical sequences</p>
      
      <div className="space-y-3">
        <Input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-purple-800/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50" 
          placeholder="Search for healing codes..."
        />
        
        <ScrollArea className="h-60 pr-2">
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-gray-400">Loading healing codes...</div>
            ) : healingCodes.length === 0 ? (
              <div className="text-center py-4 text-gray-400">No healing codes found</div>
            ) : (
              healingCodes.map((code) => (
                <div key={code.id} className="bg-gray-900 bg-opacity-60 p-2 rounded border border-purple-800/10">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-teal-500 font-medium">{code.code}</span>
                    <Button 
                      onClick={() => applyHealingCode(code.code)}
                      size="sm"
                      variant="outline"
                      className="text-xs bg-purple-800 bg-opacity-30 hover:bg-opacity-50 px-2 py-1 rounded-md transition-colors"
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{code.description}</p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
