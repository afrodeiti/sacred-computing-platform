import { useSacred } from "@/context/sacred-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function EnergeticConsole() {
  const { consoleMessages, clearConsole } = useSacred();

  // Get color class based on message type
  const getMessageColor = (type: string) => {
    switch (type) {
      case 'TORUS_FIELD':
        return 'text-teal-500';
      case 'MERKABA':
        return 'text-pink-500';
      case 'INTENTION':
      case 'AMPLIFICATION':
        return 'text-yellow-500';
      case 'METATRON':
        return 'text-violet-500';
      case 'SRI_YANTRA':
        return 'text-purple-500';
      case 'FLOWER_OF_LIFE':
        return 'text-blue-500';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="mt-6 bg-black p-4 rounded-lg border border-purple-800/20 dark:bg-sacred-black">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-medium text-lg text-white font-montserrat">Energetic Response Console</h2>
        <Button 
          onClick={clearConsole}
          className="text-xs bg-purple-800 bg-opacity-30 hover:bg-opacity-50 px-2 py-1 rounded-md transition-colors"
          variant="outline"
          size="sm"
        >
          Clear
        </Button>
      </div>
      
      <ScrollArea className="bg-gray-900 rounded-md p-3 h-40 font-mono text-xs">
        {consoleMessages.length === 0 ? (
          <div className="text-gray-400 text-center p-2">No energetic responses yet</div>
        ) : (
          consoleMessages.map((message, index) => (
            <div key={index} className="mb-2 pb-2 border-b border-purple-800/10">
              <div className="flex justify-between text-xxs text-gray-500 mb-1">
                <span>
                  {new Date(message.timestamp).toLocaleString()}
                </span>
                <span>{message.type}</span>
              </div>
              <div className={cn(getMessageColor(message.type))}>
                {message.data?.message || 
                 (typeof message.data === 'object' 
                  ? JSON.stringify(message.data)
                  : message.data.toString())
                }
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
