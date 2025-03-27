import { useSacred } from "@/context/sacred-context";
import { cn } from "@/lib/utils";

export default function WebSocketStatus() {
  const { isConnected } = useSacred();

  return (
    <div className="flex items-center">
      <div
        className={cn(
          "px-3 py-1 rounded-full text-xs font-mono bg-black border-2 flex items-center",
          isConnected 
            ? "websocket-active border-green-500" 
            : "websocket-inactive border-red-500"
        )}
      >
        <span 
          className={cn(
            "w-2 h-2 rounded-full mr-2",
            isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
          )}
        />
        <span>{isConnected ? "CONNECTED" : "DISCONNECTED"}</span>
      </div>
    </div>
  );
}
