import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SCHUMANN_RESONANCE } from '@/lib/constants';
import { extractIntention, base64ToPacket, validatePacket } from '@/lib/network-packet';
import { Loader2, WifiIcon, ZapIcon, Send, Radio, Workflow } from 'lucide-react';
// Import sacred geometry components
// Note: These components need to be created if they don't exist yet
import CropCircle from '@/components/sacred-geometry/CropCircle';
import TorusField from '@/components/sacred-geometry/TorusField';
import FlowerOfLife from '@/components/sacred-geometry/FlowerOfLife';
import SriYantra from '@/components/sacred-geometry/SriYantra';
import Merkaba from '@/components/sacred-geometry/Merkaba';
import MetatronsCube from '@/components/sacred-geometry/MetatronsCube';
import IntentionForm from '@/components/sacred-geometry/IntentionForm';
import { useWebSocket } from '@/context/socket-context';

type GeometryType = 'torus' | 'merkaba' | 'metatron' | 'sri_yantra' | 'flower_of_life' | 'intention_form' | 'crop_circle';

export default function IntentionBroadcast() {
  const { toast } = useToast();
  const { socket, lastMessage, connected } = useWebSocket();
  
  const [intention, setIntention] = useState('');
  const [frequency, setFrequency] = useState(SCHUMANN_RESONANCE);
  const [amplify, setAmplify] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [geometryType, setGeometryType] = useState<GeometryType>('torus');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<any>(null);
  const [packetData, setPacketData] = useState<string | null>(null);
  const [activeBroadcasts, setActiveBroadcasts] = useState<any[]>([]);
  
  // Handle WebSocket message reception
  useEffect(() => {
    if (!lastMessage) return;
    
    try {
      const parsed = JSON.parse(lastMessage);
      
      if (parsed.type === 'NETWORK_PACKET') {
        const newBroadcast = {
          id: Date.now(),
          timestamp: parsed.timestamp,
          intention: parsed.data.intention,
          frequency: parsed.data.frequency,
          fieldType: parsed.data.fieldType,
          packetData: parsed.packetData
        };
        
        setActiveBroadcasts(prev => [newBroadcast, ...prev].slice(0, 10));
        
        if (parsed.packetData) {
          setPacketData(parsed.packetData);
        }
        
        // Toast notification
        toast({
          title: "New Intention Broadcast",
          description: `Intention: "${parsed.data.intention}" broadcasted via network packet`,
        });
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  }, [lastMessage, toast]);
  
  // Handle broadcast submission
  const handleBroadcast = async () => {
    if (!intention.trim()) {
      toast({
        title: "Error",
        description: "Please enter an intention to broadcast",
        variant: "destructive"
      });
      return;
    }
    
    setIsBroadcasting(true);
    
    try {
      const response = await apiRequest("POST", "/api/broadcast-intention", {
        intention,
        frequency,
        fieldType: geometryType,
        amplify,
        multiplier: amplify ? multiplier : 1.0
      });
      
      const data = await response.json();
      setBroadcastResult(data);
      
      if (data.packet?.base64) {
        setPacketData(data.packet.base64);
      }
      
      toast({
        title: "Broadcast Complete",
        description: `Your intention "${intention}" has been broadcast through the subtle energy field.`,
      });
      
      // Add to active broadcasts
      const newBroadcast = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        intention,
        frequency,
        fieldType: geometryType,
        packetData: data.packet?.base64
      };
      
      setActiveBroadcasts(prev => [newBroadcast, ...prev].slice(0, 10));
      
    } catch (error) {
      console.error("Error broadcasting intention:", error);
      toast({
        title: "Broadcast Failed",
        description: "There was an error broadcasting your intention. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsBroadcasting(false);
  };
  
  // Render the appropriate sacred geometry visualization
  const renderGeometryVisualization = () => {
    if (!intention) return null;
    
    switch (geometryType) {
      case 'torus':
        return <TorusField intention={intention} frequency={frequency} />;
      case 'merkaba':
        return <Merkaba intention={intention} frequency={frequency} />;
      case 'metatron':
        return <MetatronsCube intention={intention} boost={amplify} />;
      case 'sri_yantra':
        return <SriYantra intention={intention} />;
      case 'flower_of_life':
        return <FlowerOfLife intention={intention} duration={60} />;
      case 'intention_form':
        return <IntentionForm intention={intention} frequency={frequency} />;
      case 'crop_circle':
        return <CropCircle intention={intention} complexity={Math.floor(intention.length / 10) + 3} rotation={0} />;
      default:
        return null;
    }
  };
  
  // Render packet data visualization
  const renderPacketVisualization = () => {
    if (!packetData) return null;
    
    try {
      const packet = base64ToPacket(packetData);
      if (!packet) return null;
      
      return (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <WifiIcon className="mr-2 h-5 w-5" />
              Network Packet
            </CardTitle>
            <CardDescription>
              This network packet carries your intention through the subtle energy field
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between">
                <span className="text-sm">Intention:</span>
                <span className="text-sm font-medium">{packet.payload.intention}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Frequency:</span>
                <span className="text-sm font-medium">{packet.payload.frequency} Hz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Field Type:</span>
                <span className="text-sm font-medium">{packet.payload.fieldType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Quantum Signature:</span>
                <span className="text-sm font-mono tracking-tighter">{packet.payload.signature.substring(0, 16)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Timestamp:</span>
                <span className="text-sm font-medium">{new Date(packet.header.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    } catch (error) {
      console.error("Error rendering packet:", error);
      return null;
    }
  };
  
  return (
    <div className="container max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
        Intention Broadcast System
      </h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
        Embed your intentions into the fabric of reality through quantum-encoded network packets and sacred geometry fields.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Intention</CardTitle>
              <CardDescription>
                Broadcast your intention through the subtle energy field using sacred geometry and network packets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="intention">Your Intention</Label>
                  <Input
                    id="intention"
                    placeholder="Enter your intention to broadcast..."
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency (Hz)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="frequency"
                      min={1}
                      max={20}
                      step={0.01}
                      value={[frequency]}
                      onValueChange={(values) => setFrequency(values[0])}
                      className="flex-1"
                    />
                    <span className="w-16 text-center font-mono">{frequency.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {frequency === 7.83 && "Earth's Schumann Resonance (7.83 Hz)"}
                    {frequency === 8.0 && "OM Frequency (8.0 Hz)"}
                    {frequency === 9.0 && "Alpha Brain Wave State (9.0 Hz)"}
                    {frequency === 12.0 && "Harmony Field (12.0 Hz)"}
                    {frequency === 5.0 && "Theta Healing State (5.0 Hz)"}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fieldType">Sacred Geometry Field</Label>
                  <Select
                    value={geometryType}
                    onValueChange={(value) => setGeometryType(value as GeometryType)}
                  >
                    <SelectTrigger id="fieldType">
                      <SelectValue placeholder="Select a field type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="torus">Torus Field</SelectItem>
                      <SelectItem value="merkaba">Merkaba Field</SelectItem>
                      <SelectItem value="metatron">Metatron's Cube</SelectItem>
                      <SelectItem value="sri_yantra">Sri Yantra</SelectItem>
                      <SelectItem value="flower_of_life">Flower of Life</SelectItem>
                      <SelectItem value="intention_form">Intention Waveform</SelectItem>
                      <SelectItem value="crop_circle">Crop Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="amplify"
                    checked={amplify}
                    onCheckedChange={setAmplify}
                  />
                  <Label htmlFor="amplify" className="cursor-pointer">
                    Divine Proportion Amplification
                  </Label>
                </div>
                
                {amplify && (
                  <div className="space-y-2 pl-8">
                    <Label htmlFor="multiplier">Fibonacci Multiplier</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="multiplier"
                        min={1}
                        max={5}
                        step={0.1}
                        value={[multiplier]}
                        onValueChange={(values) => setMultiplier(values[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center font-mono">{multiplier.toFixed(1)}x</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Using the divine proportion (φ = 1.618...) to amplify the energetic potential
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleBroadcast} 
                disabled={isBroadcasting || !intention.trim() || !connected}
                className="w-full"
              >
                {isBroadcasting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Radio className="mr-2 h-4 w-4" />
                    Broadcast Intention
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Visualization of the sacred geometry pattern */}
          <div className="mt-6 h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
            {renderGeometryVisualization()}
          </div>
          
          {/* Packet Data Visualization */}
          {renderPacketVisualization()}
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Radio className="mr-2 h-5 w-5" />
                Active Broadcasts
              </CardTitle>
              <CardDescription>
                Real-time broadcasts detected in the subtle energy field
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeBroadcasts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <WifiIcon className="mx-auto h-10 w-10 mb-2 opacity-20" />
                    <p>No active broadcasts detected</p>
                    <p className="text-xs mt-2">
                      Create a broadcast to see it appear here
                    </p>
                  </div>
                ) : (
                  activeBroadcasts.map(broadcast => (
                    <div key={broadcast.id} className="border rounded-md p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="font-medium break-words max-w-[80%]">{broadcast.intention}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(broadcast.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground space-x-2">
                        <div className="flex items-center">
                          <ZapIcon className="mr-1 h-3 w-3" />
                          {broadcast.frequency.toFixed(2)} Hz
                        </div>
                        <div>|</div>
                        <div>{broadcast.fieldType.replace('_', ' ')}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}