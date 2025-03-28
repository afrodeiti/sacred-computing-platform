import { useState, useEffect } from "react";
import { 
  FlowerOfLife, 
  SriYantra, 
  Merkaba, 
  MetatronsCube, 
  TorusField 
} from "@/components/sacred-geometry";
import { useSacred } from "@/context/sacred-context";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  FIELD_TYPES, 
  SCHUMANN_RESONANCE, 
  SOLFEGGIO,
  PHI
} from "@/lib/constants";

export default function SacredGeometryPage() {
  const { isConnected, connect, sendIntention } = useSacred();
  const { toast } = useToast();
  const [activePattern, setActivePattern] = useState("torus");
  const [intention, setIntention] = useState("");
  const [frequency, setFrequency] = useState(SCHUMANN_RESONANCE);
  const [intensity, setIntensity] = useState(1.0);
  const [context, setContext] = useState("general");
  const [boost, setBoost] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [visualizationSize, setVisualizationSize] = useState(280);
  const [animation, setAnimation] = useState(false);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    connectToWebSocket();
    
    // Adjust visualization size based on window width
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisualizationSize(220);
      } else if (width < 1024) {
        setVisualizationSize(260);
      } else {
        setVisualizationSize(280);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
          
          // Add to messages
          setMessages(prev => [...prev, data].slice(-20)); // Keep last 20 messages
          
          // Process specific message types
          if (data.type === activePattern.toUpperCase() || 
              (activePattern === "torus" && data.type === "TORUS_FIELD") ||
              (activePattern === "platonic_solid" && data.type === "PLATONIC_SOLID") ||
              (activePattern === "metatron" && data.type === "METATRON")) {
            setResponse(data.data);
            setIsProcessing(false);
            
            // Trigger animation
            setAnimation(true);
            setTimeout(() => setAnimation(false), 2500);
            
            // Show toast based on pattern type
            switch(activePattern) {
              case "flower_of_life":
                toast({
                  title: "Divine Harmony Activated",
                  description: "The Flower of Life pattern has blessed your intention with cosmic harmony.",
                });
                break;
              case "sri_yantra":
                toast({
                  title: "Consciousness Expansion",
                  description: "The Sri Yantra has elevated your intention to higher dimensions of awareness.",
                });
                break;
              case "merkaba":
                toast({
                  title: "Protection Activated",
                  description: "The Merkaba has created a light vehicle for your intention to manifest.",
                });
                break;
              case "metatron":
                toast({
                  title: "Sacred Transformation",
                  description: "Metatron's Cube has unlocked the sacred geometry within your intention.",
                });
                break;
              case "torus":
                toast({
                  title: "Creation Field Activated",
                  description: "Your intention has been embedded in the universal Torus field.",
                });
                break;
              case "platonic_solid":
                toast({
                  title: "Elemental Balance",
                  description: "Your intention is now aligned with the elemental forces of creation.",
                });
                break;
            }
          }
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

  // Function to process the intention
  const processIntention = () => {
    if (!intention.trim()) {
      toast({
        title: "Intention Required",
        description: "Please enter an intention to proceed",
        variant: "destructive",
      });
      return;
    }
    
    if (connectionStatus !== "connected") {
      toast({
        title: "Not Connected",
        description: "Please connect to the sacred field first",
        variant: "destructive",
      });
      return;
    }
    
    // Set processing state
    setIsProcessing(true);
    setResponse(null);
    
    // Create the message type based on the active pattern
    const messageType = activePattern === "torus" 
      ? "TORUS_FIELD" 
      : activePattern === "platonic_solid" 
        ? "PLATONIC_SOLID"
        : activePattern.toUpperCase();
    
    // Send the WebSocket message
    try {
      const socket = (useSacred().socket as WebSocket);
      if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
          type: messageType,
          data: {
            intention,
            frequency,
            boost,
            multiplier: intensity,
            context,
            duration: 60 // Used for Flower of Life
          },
          timestamp: new Date().toISOString()
        };
        
        socket.send(JSON.stringify(message));
      } else {
        setIsProcessing(false);
        toast({
          title: "Connection Error",
          description: "WebSocket connection is not open",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process your intention",
        variant: "destructive",
      });
    }
  };
  
  // Render the active sacred geometry pattern
  const renderSacredPattern = () => {
    const props = {
      size: visualizationSize,
      color: "#ffffff",
      animated: animation
    };
    
    switch(activePattern) {
      case "flower_of_life":
        return <FlowerOfLife {...props} />;
      case "sri_yantra":
        return <SriYantra {...props} />;
      case "merkaba":
        return <Merkaba {...props} />;
      case "metatron":
        return <MetatronsCube {...props} boost={boost} />;
      case "torus":
        return <TorusField {...props} frequency={frequency} />;
      case "platonic_solid":
        return <MetatronsCube {...props} boost={true} />;
      default:
        return <TorusField {...props} />;
    }
  };
  
  // Get description text based on the active pattern
  const getPatternDescription = () => {
    const patternInfo = FIELD_TYPES.find(type => type.value === activePattern);
    if (!patternInfo) return "";
    
    switch(activePattern) {
      case "flower_of_life":
        return "The Flower of Life pattern blesses intentions with universal harmony and wholeness. It connects your intention to the cosmic blueprint of creation.";
      case "sri_yantra":
        return "The Sri Yantra elevates consciousness and connects to higher dimensions. It aligns your intention with cosmic intelligence.";
      case "merkaba":
        return "The Merkaba creates a light vehicle that protects and propels your intention. It generates counter-rotating energy fields for spiritual ascension.";
      case "metatron":
        return "Metatron's Cube contains all platonic solids and sacred shapes. It transforms intention through divine geometric principles.";
      case "torus":
        return "The Torus Field is the fundamental pattern of creation and manifestation. It embeds your intention in the continuous flow of universal energy.";
      case "platonic_solid":
        return "Platonic Solids represent the building blocks of reality. They align your intention with elemental forces and cosmic structure.";
      default:
        return patternInfo.description;
    }
  };
  
  // Get recommended frequency based on the active pattern
  const getRecommendedFrequency = () => {
    switch(activePattern) {
      case "flower_of_life":
        return SOLFEGGIO.MI; // 528 Hz - Transformation and miracles
      case "sri_yantra":
        return SOLFEGGIO.SOL; // 741 Hz - Awakening intuition
      case "merkaba":
        return SOLFEGGIO.FA; // 639 Hz - Connecting/relationships
      case "metatron":
        return SOLFEGGIO.LA; // 852 Hz - Returning to spiritual order
      case "torus":
        return SCHUMANN_RESONANCE; // 7.83 Hz - Earth's resonance
      case "platonic_solid":
        return SOLFEGGIO.RE; // 417 Hz - Undoing situations and facilitating change
      default:
        return SCHUMANN_RESONANCE;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-300 mb-4">
          Sacred Geometry Intentions
        </h1>
        <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-12">
          Interact with sacred geometric patterns to manifest your intentions through quantum resonance
        </p>
        
        {/* Connection status indicator */}
        <div className="flex justify-center mb-8">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Pattern Selection */}
          <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-0 shadow-lg">
            <CardHeader className="bg-gray-800/80 text-white border-b border-gray-700">
              <CardTitle>Sacred Pattern Selection</CardTitle>
              <CardDescription className="text-white/80">
                Choose the sacred geometry pattern for your intention
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Select Pattern</label>
                <Select value={activePattern} onValueChange={value => {
                  setActivePattern(value);
                  setFrequency(getRecommendedFrequency());
                  setResponse(null);
                }}>
                  <SelectTrigger className="w-full bg-gray-800/50 border-gray-700">
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {FIELD_TYPES.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 rounded-md bg-gray-800/50">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  {FIELD_TYPES.find(f => f.value === activePattern)?.label || "Pattern"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {getPatternDescription()}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium flex justify-between">
                    <span>Frequency (Hz)</span>
                    <span className="text-gray-400">{frequency.toFixed(2)} Hz</span>
                  </label>
                  <Slider
                    className="py-4"
                    value={[frequency]}
                    min={1}
                    max={1000}
                    step={0.01}
                    onValueChange={value => setFrequency(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Earth (7.83)</span>
                    <span>Solfeggio (396-963)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium flex justify-between">
                    <span>Intensity Multiplier</span>
                    <span className="text-gray-400">x{intensity.toFixed(2)}</span>
                  </label>
                  <Slider
                    className="py-4"
                    value={[intensity]}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onValueChange={value => setIntensity(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtle</span>
                    <span>Phi ({PHI.toFixed(2)})</span>
                    <span>Powerful</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Intention Context</label>
                  <Select value={context} onValueChange={setContext}>
                    <SelectTrigger className="w-full bg-gray-800/50 border-gray-700">
                      <SelectValue placeholder="Select context" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="general">General Intention</SelectItem>
                      <SelectItem value="manifestation">Manifestation</SelectItem>
                      <SelectItem value="healing">Healing</SelectItem>
                      <SelectItem value="spiritual">Spiritual Growth</SelectItem>
                      <SelectItem value="protection">Protection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="boost-input"
                    className="w-4 h-4 rounded-md border-gray-700 bg-gray-800"
                    checked={boost}
                    onChange={e => setBoost(e.target.checked)}
                  />
                  <label htmlFor="boost-input" className="ml-2 text-gray-300 text-sm font-medium">
                    Apply Divine Amplification
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Center column - Visualization */}
          <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-0 shadow-lg">
            <CardHeader className="bg-gray-800/80 text-white border-b border-gray-700">
              <CardTitle>Sacred Visualization</CardTitle>
              <CardDescription className="text-white/80">
                Energetic pattern for intention transmission
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className={`transition-all duration-1000 transform ${animation ? 'scale-110' : 'scale-100'}`}>
                {renderSacredPattern()}
              </div>
              
              {isProcessing && (
                <div className="mt-6 flex items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mr-2"></div>
                  <span className="text-gray-300">Processing intention...</span>
                </div>
              )}
              
              {response && (
                <div className="mt-6 w-full">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Sacred Field Response</h3>
                  <div className="p-4 rounded-md bg-black/30 text-sm font-mono text-gray-300 max-h-[180px] overflow-auto">
                    {Object.entries(response).map(([key, value]) => (
                      <div key={key} className="flex mb-1">
                        <span className="text-indigo-400 mr-2">{key}:</span>
                        <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Right column - Intention Input */}
          <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-0 shadow-lg">
            <CardHeader className="bg-gray-800/80 text-white border-b border-gray-700">
              <CardTitle>Your Intention</CardTitle>
              <CardDescription className="text-white/80">
                Enter your intention to be embedded in the sacred pattern
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Enter Your Intention</label>
                <textarea
                  className="w-full h-32 px-3 py-2 rounded-md bg-gray-800/50 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder:text-gray-500"
                  placeholder="Enter your intention here..."
                  value={intention}
                  onChange={e => setIntention(e.target.value)}
                />
                
                <p className="text-xs text-gray-400 mt-2">
                  For optimal results, state your intention in present tense as if it has already manifested.
                </p>
              </div>
              
              <div className="p-4 rounded-md bg-indigo-950/50 border border-indigo-900/50">
                <h3 className="text-md font-semibold text-indigo-300 mb-2">Guidelines for Powerful Intentions</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    <span>Use present tense ("I am..." rather than "I will...")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    <span>Be specific and clear about what you desire</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    <span>Infuse your intention with positive emotion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    <span>Focus on what you want, not what you don't want</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                size="lg"
                onClick={processIntention}
                disabled={isProcessing || !intention.trim() || connectionStatus !== "connected"}
              >
                {isProcessing ? 'Processing...' : 'Broadcast Intention'}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                Your intention will be embedded in the selected sacred geometry pattern
                and broadcast through the quantum field.
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Energetic Console */}
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
        </Card>
      </div>
    </div>
  );
}