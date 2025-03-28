import { Link } from "wouter";
import { useSacred } from "@/context/sacred-context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { isConnected, connect } = useSacred();
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  
  // Connect to WebSocket when component mounts
  useEffect(() => {
    connectToWebSocket();
  }, []);
  
  // Function to connect to WebSocket
  const connectToWebSocket = () => {
    try {
      setConnectionStatus("connecting");
      
      // Get WebSocket URL
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      // Create WebSocket connection
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        setConnectionStatus("connected");
        toast({
          title: "Energetic Connection Established",
          description: "You are now connected to the Sacred Computing Platform",
        });
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, data].slice(-20)); // Keep last 20 messages
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      socket.onclose = () => {
        setConnectionStatus("disconnected");
        toast({
          title: "Connection Closed",
          description: "Your connection to the Sacred Computing Platform has ended",
          variant: "destructive",
        });
        
        // Try to reconnect after a delay
        setTimeout(connectToWebSocket, 5000);
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
        toast({
          title: "Connection Error",
          description: "Could not connect to the Sacred Computing Platform",
          variant: "destructive",
        });
      };
      
      // Save socket in context for future use
      connect(socket);
      
      // Clean up on unmount
      return () => {
        socket.close();
      };
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      setConnectionStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Sacred Computing Platform</h1>
          <p className="text-center mt-2 text-white/80">
            Integrate sacred geometry principles with digital technology
          </p>
          
          {/* Connection indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center bg-black/20 px-4 py-2 rounded-full">
              <div 
                className={`w-3 h-3 rounded-full mr-2 ${
                  connectionStatus === "connected" ? "bg-green-400" : 
                  connectionStatus === "connecting" ? "bg-yellow-400" : 
                  "bg-red-400"
                }`}
              />
              <span className="text-sm">
                {connectionStatus === "connected" ? "Connected" : 
                 connectionStatus === "connecting" ? "Connecting..." : 
                 "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Healing Codes Card */}
          <Card className="flex flex-col">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <CardTitle>Sacred Healing Codes</CardTitle>
              <CardDescription className="text-white/80">
                Access ancient numerical sequences for healing
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 flex-grow">
              <p className="mb-4">
                Discover and apply numerical codes that resonate with specific healing frequencies 
                for physical, emotional, and spiritual wellbeing.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Search from 92+ Grabovoi and healing codes</li>
                <li>Find codes by keyword or category</li>
                <li>Get semantic matches for your specific issues</li>
                <li>Receive personalized usage instructions</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full">
                <Link href="/healing-search">
                  Access Healing Codes
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Intention Recommendation Card */}
          <Card className="flex flex-col">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
              <CardTitle>Intention Formulator</CardTitle>
              <CardDescription className="text-white/80">
                Create optimized intentions for manifestation
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 flex-grow">
              <p className="mb-4">
                Transform your desires into perfectly structured intentions using sacred 
                geometry principles and divine frequencies.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>AI-powered intention optimization</li>
                <li>Context-specific intention phrasing</li>
                <li>Receive optimal geometric field recommendations</li>
                <li>Get mathematically precise frequency guidance</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full">
                <Link href="/intention-recommendation">
                  Formulate Intentions
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Soul Archive Card */}
          <Card className="flex flex-col">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle>Soul Archive</CardTitle>
              <CardDescription className="text-white/80">
                Store and access your sacred patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 flex-grow">
              <p className="mb-4">
                Create, save, and retrieve your personal sacred geometry patterns and intentions 
                for consistent energetic access.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Store multiple sacred geometry patterns</li>
                <li>Save torus fields, merkabas, and more</li>
                <li>Track intention amplification results</li>
                <li>Create personal energetic templates</li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Console Output */}
        <Card className="mt-8">
          <CardHeader className="bg-gray-800 text-white">
            <CardTitle>Energetic Console</CardTitle>
            <CardDescription className="text-white/80">
              Live energetic communications
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 bg-black text-green-400 font-mono text-sm overflow-auto max-h-[300px]">
            {messages.length > 0 ? (
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div key={index} className="border-b border-gray-800 pb-2">
                    <div className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                    <div>
                      {msg.type}: {msg.data.message || JSON.stringify(msg.data)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No messages yet. Connect to the Sacred Computing Platform to begin receiving energetic communications.
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={connectToWebSocket} 
              disabled={connectionStatus === "connected" || connectionStatus === "connecting"}
              variant="outline"
              className="w-full"
            >
              {connectionStatus === "connected" ? "Connected" : 
               connectionStatus === "connecting" ? "Connecting..." : 
               "Reconnect"}
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>Sacred Computing Platform &copy; {new Date().getFullYear()}</p>
          <p className="text-gray-400 text-sm mt-2">
            Integrating ancient wisdom with modern technology for energetic harmony
          </p>
        </div>
      </footer>
    </div>
  );
}
