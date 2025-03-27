import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSacred } from "@/context/sacred-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, truncate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SoulArchive {
  id: number;
  title: string;
  description?: string;
  intention: string;
  frequency: string;
  boost: boolean;
  multiplier: number;
  pattern_type: string;
  pattern_data: any;
  created_at: string;
}

export default function SoulArchive() {
  const { intention, frequency, boost, multiplier, torusField, merkabaField, metatronCube, sriYantra, flowerOfLife, setIntention, setFrequency, setBoost, setMultiplier } = useSacred();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: archives = [], isLoading } = useQuery<SoulArchive[]>({
    queryKey: ['/api/soul-archives'],
    queryFn: async () => {
      const res = await fetch('/api/soul-archives');
      return res.json();
    }
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: Omit<SoulArchive, 'id' | 'created_at'>) => {
      const res = await apiRequest('POST', '/api/soul-archives', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Soul Archive Saved",
        description: "Your energetic pattern has been stored in the soul archive.",
      });
      setDialogOpen(false);
      setTitle("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ['/api/soul-archives'] });
    },
    onError: (error) => {
      toast({
        title: "Error Saving Archive",
        description: `Could not save to soul archive: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const saveSoulPattern = () => {
    if (!intention) {
      toast({
        title: "No Intention Set",
        description: "Please set an intention before saving to the soul archive.",
        variant: "destructive",
      });
      return;
    }
    
    // Open dialog to enter title and description
    setDialogOpen(true);
  };
  
  const confirmSave = () => {
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your soul archive entry.",
        variant: "destructive",
      });
      return;
    }
    
    // Determine which pattern is active
    let patternType = "torus";
    let patternData = torusField;
    
    if (merkabaField) {
      patternType = "merkaba";
      patternData = merkabaField;
    } else if (metatronCube) {
      patternType = "metatron";
      patternData = metatronCube;
    } else if (sriYantra) {
      patternType = "sri_yantra";
      patternData = sriYantra;
    } else if (flowerOfLife) {
      patternType = "flower_of_life";
      patternData = flowerOfLife;
    }
    
    // Create the archive entry
    createMutation.mutate({
      title,
      description,
      intention,
      frequency: frequency.toString(),
      boost,
      multiplier,
      pattern_type: patternType,
      pattern_data: patternData || {},
    });
  };
  
  const loadArchive = (archive: SoulArchive) => {
    // Load the archive data into the current session
    setIntention(archive.intention);
    setFrequency(parseFloat(archive.frequency));
    setBoost(archive.boost);
    setMultiplier(archive.multiplier);
    
    toast({
      title: "Archive Loaded",
      description: `"${archive.title}" has been loaded into the sacred field.`,
    });
  };
  
  return (
    <div className="bg-black p-4 rounded-lg border border-purple-800/20 dark:bg-sacred-black">
      <h2 className="font-medium text-lg mb-3 text-white font-montserrat">Soul Archive</h2>
      <p className="text-sm text-gray-400 mb-4">Access your soul's energetic records</p>
      
      <div className="space-y-3">
        <div className="flex space-x-2">
          <Button 
            onClick={() => {}}
            variant="outline"
            className="flex-1 bg-black border border-purple-800/50 py-1 rounded-md text-sm text-white font-medium hover:bg-purple-800/20 transition-colors"
          >
            Load Archive
          </Button>
          <Button 
            onClick={saveSoulPattern}
            variant="outline"
            className="flex-1 bg-black border border-purple-800/50 py-1 rounded-md text-sm text-white font-medium hover:bg-purple-800/20 transition-colors"
          >
            Save Pattern
          </Button>
        </div>
        
        <ScrollArea className="h-60 pr-2">
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-gray-400">Loading archives...</div>
            ) : archives.length === 0 ? (
              <div className="text-center py-4 text-gray-400">No soul archives found</div>
            ) : (
              archives.map((archive) => (
                <div 
                  key={archive.id} 
                  className="bg-gray-900 bg-opacity-60 p-2 rounded border border-purple-800/10 cursor-pointer"
                  onClick={() => loadArchive(archive)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">{archive.title}</span>
                    <span className="text-xs text-gray-400">{formatDate(archive.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {archive.description || `${archive.intention} (${archive.pattern_type})`}
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Save Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Save to Soul Archive</DialogTitle>
            <DialogDescription>
              Create a new entry in your soul's energetic record
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for this pattern"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this energetic pattern"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            <div className="space-y-1">
              <Label>Intention</Label>
              <div className="text-sm text-gray-300 bg-gray-800 p-2 rounded">{intention}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label>Frequency</Label>
                <div className="text-sm text-gray-300 bg-gray-800 p-2 rounded">{frequency} Hz</div>
              </div>
              <div className="space-y-1">
                <Label>Amplified</Label>
                <div className="text-sm text-gray-300 bg-gray-800 p-2 rounded">{boost ? "Yes" : "No"}</div>
              </div>
              <div className="space-y-1">
                <Label>Multiplier</Label>
                <div className="text-sm text-gray-300 bg-gray-800 p-2 rounded">{multiplier}</div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSave} className="bg-gradient-to-r from-violet-500 to-blue-500">
              Save to Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
