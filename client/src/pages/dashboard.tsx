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
import { 
  SriYantra, 
  FlowerOfLife, 
  Merkaba, 
  MetatronsCube, 
  TorusField 
} from "@/components/sacred-geometry";
import { FIELD_TYPES } from "@/lib/constants";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Mystical header with sacred geometry background */}
      <header className="relative py-16 overflow-hidden">
        {/* Background sacred geometry patterns */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-0 left-1/4 transform -translate-x-1/2">
            <FlowerOfLife size={400} color="#ffffff" animated={false} />
          </div>
          <div className="absolute bottom-0 right-1/4 transform translate-x-1/2">
            <SriYantra size={400} color="#ffffff" animated={false} />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-300 mb-4">
            Sacred Computing Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Integrate sacred geometry principles with digital technology to create energetic harmony
          </p>
          
          {/* Connection indicator */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm">
              <div 
                className={`w-4 h-4 rounded-full mr-3 ${
                  connectionStatus === "connected" ? "bg-green-400 animate-pulse" : 
                  connectionStatus === "connecting" ? "bg-yellow-400" : 
                  "bg-red-400"
                }`}
              />
              <span className="text-white">
                {connectionStatus === "connected" ? "Connected to Energetic Field" : 
                 connectionStatus === "connecting" ? "Establishing Connection..." : 
                 "Disconnected from Energetic Field"}
              </span>
              
              {connectionStatus !== "connected" && connectionStatus !== "connecting" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={connectToWebSocket}
                  className="ml-2 text-indigo-300 hover:text-indigo-200"
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Sacred geometry showcase */}
      <section className="py-12 bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Sacred Geometry Patterns
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {FIELD_TYPES.map((field, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-48 h-48 mb-4 flex items-center justify-center p-2 rounded-full bg-gray-900/50 backdrop-blur-sm">
                  {field.value === "flower_of_life" && <FlowerOfLife size={180} color="#f0f0ff" />}
                  {field.value === "sri_yantra" && <SriYantra size={180} color="#f5f0ff" />}
                  {field.value === "merkaba" && <Merkaba size={180} color="#f0f8ff" />}
                  {field.value === "metatron" && <MetatronsCube size={180} color="#fff0f5" />}
                  {field.value === "torus" && <TorusField size={180} color="#f0fff4" />}
                  {field.value === "platonic_solid" && <MetatronsCube size={180} color="#fffaf0" boost={true} />}
                </div>
                <h3 className="text-xl font-semibold text-white">{field.label}</h3>
                <p className="text-gray-400 text-center mt-1">{field.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Healing Codes Card */}
          <Card className="flex flex-col overflow-hidden border-0 shadow-lg bg-gradient-to-b from-gray-800 to-gray-900">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white relative overflow-hidden pb-6">
              <div className="absolute top-0 right-0 opacity-20">
                <SriYantra size={120} color="#ffffff" animated={false} />
              </div>
              <CardTitle className="text-2xl">Sacred Healing Codes</CardTitle>
              <CardDescription className="text-white/90">
                Access ancient numerical sequences for healing
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 flex-grow text-gray-200">
              <p className="mb-4">
                Discover and apply numerical codes that resonate with specific healing frequencies 
                for physical, emotional, and spiritual wellbeing.
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">✧</span> 
                  <span>Search both Divine and Grabovoi codes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">✧</span> 
                  <span>Find codes by keyword or category</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">✧</span> 
                  <span>Get semantic matches for your specific issues</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">✧</span> 
                  <span>Receive personalized usage instructions</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Link href="/healing-search">
                  Access Healing Codes
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Intention Recommendation Card */}
          <Card className="flex flex-col overflow-hidden border-0 shadow-lg bg-gradient-to-b from-gray-800 to-gray-900">
            <CardHeader className="bg-gradient-to-r from-pink-700 to-purple-700 text-white relative overflow-hidden pb-6">
              <div className="absolute top-0 right-0 opacity-20">
                <TorusField size={120} color="#ffffff" animated={false} />
              </div>
              <CardTitle className="text-2xl">Intention Formulator</CardTitle>
              <CardDescription className="text-white/90">
                Create optimized intentions for manifestation
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 flex-grow text-gray-200">
              <p className="mb-4">
                Transform your desires into perfectly structured intentions using sacred 
                geometry principles and divine frequencies.
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start">
                  <span className="mr-2 text-pink-400">✧</span> 
                  <span>AI-powered intention optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-pink-400">✧</span> 
                  <span>Context-specific intention phrasing</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-pink-400">✧</span> 
                  <span>Receive optimal geometric field recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-pink-400">✧</span> 
                  <span>Get mathematically precise frequency guidance</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                <Link href="/intention-recommendation">
                  Formulate Intentions
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Soul Archive Card */}
          <Card className="flex flex-col overflow-hidden border-0 shadow-lg bg-gradient-to-b from-gray-800 to-gray-900">
            <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white relative overflow-hidden pb-6">
              <div className="absolute top-0 right-0 opacity-20">
                <FlowerOfLife size={120} color="#ffffff" animated={false} />
              </div>
              <CardTitle className="text-2xl">Soul Archive</CardTitle>
              <CardDescription className="text-white/90">
                Store and access your sacred patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 flex-grow text-gray-200">
              <p className="mb-4">
                Create, save, and retrieve your personal sacred geometry patterns and intentions 
                for consistent energetic access.
              </p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">✧</span> 
                  <span>Store multiple sacred geometry patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">✧</span> 
                  <span>Save torus fields, merkabas, and more</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">✧</span> 
                  <span>Track intention amplification results</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">✧</span> 
                  <span>Create personal energetic templates</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full text-blue-400 border-blue-500/50 hover:bg-blue-950/30">
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Console Output */}
        <Card className="mt-12 overflow-hidden border-0 shadow-lg bg-gradient-to-b from-gray-800 to-gray-900">
          <CardHeader className="bg-gray-800/80 text-white border-b border-gray-700">
            <CardTitle className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              Energetic Console
            </CardTitle>
            <CardDescription className="text-white/80">
              Live energetic communications from the sacred field
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 bg-black/90 text-green-400 font-mono text-sm overflow-auto max-h-[300px]">
            {messages.length > 0 ? (
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div key={index} className="border-b border-gray-800/50 pb-2">
                    <div className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()} • {msg.type}
                    </div>
                    <div>
                      {msg.data.message || JSON.stringify(msg.data)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500">
                <div className="mb-4 text-3xl">⦿</div>
                No messages yet. Connect to the Sacred Computing Platform to begin receiving energetic communications.
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-900/90 border-t border-gray-800/50">
            <Button 
              onClick={connectToWebSocket} 
              disabled={connectionStatus === "connected" || connectionStatus === "connecting"}
              variant="outline"
              className="w-full"
            >
              {connectionStatus === "connected" ? "Connected to Sacred Field" : 
               connectionStatus === "connecting" ? "Establishing Connection..." : 
               "Reconnect to Sacred Field"}
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-6">
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
