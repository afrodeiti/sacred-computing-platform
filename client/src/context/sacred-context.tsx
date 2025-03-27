import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { useToast } from "@/hooks/use-toast";

// Types for the sacred geometry data
export interface TorusField {
  intention: string;
  torus_frequency: number;
  schumann_ratio: string;
  inner_flow: string;
  outer_flow: string;
  phase_angle: number;
  coherence: string;
  tesla_node: number;
  activation_sequence: string;
}

export interface MerkabaField {
  intention: string;
  tetra_up: string;
  tetra_down: string;
  merkaba_frequency: number;
  solfeggio_alignment: number;
  field_intensity: number;
  activation_code: string;
}

export interface MetatronCube {
  intention: string;
  metatron_code: string;
  harmonic: number;
  platonic_solids: {
    tetrahedron: string;
    hexahedron: string;
    octahedron: string;
    dodecahedron: string;
    icosahedron: string;
  };
  activation_key: string;
}

export interface SriYantra {
  intention: string;
  triangles: string[];
  bindu: string;
  circuits: string[];
  inner_triangle: string;
  outer_triangle: string;
  yantra_code: string;
}

export interface FlowerOfLife {
  intention: string;
  flower_pattern: string;
  planetary_alignment: string;
  cosmic_degree: number;
  optimal_duration: number;
  vesica_pisces_code: string;
}

export interface ConsoleMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface SacredContextType {
  // General state
  intention: string;
  frequency: number;
  boost: boolean;
  multiplier: number;
  isConnected: boolean;
  
  // Sacred geometry data
  torusField: TorusField | null;
  merkabaField: MerkabaField | null;
  metatronCube: MetatronCube | null;
  sriYantra: SriYantra | null;
  flowerOfLife: FlowerOfLife | null;
  
  // Console messages
  consoleMessages: ConsoleMessage[];
  
  // Functions
  setIntention: (intention: string) => void;
  setFrequency: (frequency: number) => void;
  setBoost: (boost: boolean) => void;
  setMultiplier: (multiplier: number) => void;
  sendIntention: (customIntention?: string, customFrequency?: number, customFieldType?: string) => void;
  activateMerkaba: () => void;
  toggleMetatronBoost: () => void;
  encodeWithSriYantra: () => void;
  blessWithFlowerOfLife: () => void;
  clearConsole: () => void;
  
  // Animation controls
  isTorusRotating: boolean;
  isTorusPulsing: boolean;
  toggleTorusRotation: () => void;
  toggleTorusPulse: () => void;
  resetTorus: () => void;
  
  // Metatron controls
  isMetatronBoostActive: boolean;
  resetMetatron: () => void;
}

const SacredContext = createContext<SacredContextType | undefined>(undefined);

export const SacredProvider = ({ children }: { children: ReactNode }) => {
  // General state
  const [intention, setIntention] = useState<string>('');
  const [frequency, setFrequency] = useState<number>(7.83);
  const [boost, setBoost] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(1);
  
  // Sacred geometry data
  const [torusField, setTorusField] = useState<TorusField | null>(null);
  const [merkabaField, setMerkabaField] = useState<MerkabaField | null>(null);
  const [metatronCube, setMetatronCube] = useState<MetatronCube | null>(null);
  const [sriYantra, setSriYantra] = useState<SriYantra | null>(null);
  const [flowerOfLife, setFlowerOfLife] = useState<FlowerOfLife | null>(null);
  
  // Animation controls
  const [isTorusRotating, setIsTorusRotating] = useState<boolean>(true);
  const [isTorusPulsing, setIsTorusPulsing] = useState<boolean>(true);
  const [isMetatronBoostActive, setIsMetatronBoostActive] = useState<boolean>(false);
  
  // Console messages
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  
  const { toast } = useToast();
  
  // WebSocket connection
  const { sendMessage, lastMessage, readyState } = useWebSocket('/ws');
  const isConnected = readyState === WebSocket.OPEN;
  
  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const message = JSON.parse(lastMessage.data);
        
        // Add message to console
        setConsoleMessages(prev => [...prev, message]);
        
        // Handle different message types
        switch (message.type) {
          case 'TORUS_FIELD':
            setTorusField(message.data);
            break;
          case 'MERKABA':
            setMerkabaField(message.data);
            break;
          case 'METATRON':
            setMetatronCube(message.data);
            break;
          case 'SRI_YANTRA':
            setSriYantra(message.data);
            break;
          case 'FLOWER_OF_LIFE':
            setFlowerOfLife(message.data);
            break;
          case 'SYSTEM':
            // System messages may contain connection info or errors
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);
  
  // Send intention through WebSocket
  const sendIntention = (customIntention?: string, customFrequency?: number, customFieldType?: string) => {
    const intentionToSend = customIntention || intention;
    const frequencyToSend = customFrequency || frequency;
    
    if (!intentionToSend) {
      toast({
        title: "Intention Required",
        description: "Please enter an intention before sending.",
        variant: "destructive"
      });
      return;
    }
    
    // Update state if custom values are provided
    if (customIntention && customIntention !== intention) {
      setIntention(customIntention);
    }
    
    if (customFrequency && customFrequency !== frequency) {
      setFrequency(customFrequency);
    }
    
    // Determine message type based on field type
    const messageType = customFieldType ? 
      customFieldType.toUpperCase().replace(/[^A-Z_]/g, '_') : 
      'INTENTION';
    
    sendMessage(JSON.stringify({
      type: messageType,
      data: {
        intention: intentionToSend,
        frequency: frequencyToSend,
        boost,
        multiplier
      }
    }));
  };
  
  // Activate Merkaba field
  const activateMerkaba = () => {
    if (!intention) {
      toast({
        title: "Intention Required",
        description: "Please enter an intention before activating the Merkaba field.",
        variant: "destructive"
      });
      return;
    }
    
    sendMessage(JSON.stringify({
      type: 'MERKABA',
      data: {
        intention,
        frequency
      }
    }));
  };
  
  // Toggle Metatron's Cube boost
  const toggleMetatronBoost = () => {
    if (!intention) {
      toast({
        title: "Intention Required",
        description: "Please enter an intention before activating Metatron's Cube.",
        variant: "destructive"
      });
      return;
    }
    
    const newBoostState = !isMetatronBoostActive;
    setIsMetatronBoostActive(newBoostState);
    
    sendMessage(JSON.stringify({
      type: 'METATRON',
      data: {
        intention,
        boost: newBoostState
      }
    }));
  };
  
  // Encode intention with Sri Yantra
  const encodeWithSriYantra = () => {
    if (!intention) {
      toast({
        title: "Intention Required",
        description: "Please enter an intention before encoding with Sri Yantra.",
        variant: "destructive"
      });
      return;
    }
    
    sendMessage(JSON.stringify({
      type: 'SRI_YANTRA',
      data: {
        intention
      }
    }));
  };
  
  // Create a blessing with Flower of Life
  const blessWithFlowerOfLife = () => {
    if (!intention) {
      toast({
        title: "Intention Required",
        description: "Please enter an intention before creating a blessing.",
        variant: "destructive"
      });
      return;
    }
    
    sendMessage(JSON.stringify({
      type: 'FLOWER_OF_LIFE',
      data: {
        intention,
        duration: 60 // Default duration in seconds
      }
    }));
  };
  
  // Clear console messages
  const clearConsole = () => {
    setConsoleMessages([]);
  };
  
  // Toggle torus field rotation
  const toggleTorusRotation = () => {
    setIsTorusRotating(prev => !prev);
  };
  
  // Toggle torus field pulse
  const toggleTorusPulse = () => {
    setIsTorusPulsing(prev => !prev);
  };
  
  // Reset torus field
  const resetTorus = () => {
    setTorusField(null);
    setFrequency(7.83);
    setIsTorusRotating(true);
    setIsTorusPulsing(true);
    
    // If there's an intention, send a new torus field request
    if (intention) {
      sendMessage(JSON.stringify({
        type: 'INTENTION',
        data: {
          intention,
          frequency: 7.83,
          boost: false,
          multiplier: 1
        }
      }));
    }
  };
  
  // Reset Metatron's Cube
  const resetMetatron = () => {
    setMetatronCube(null);
    setIsMetatronBoostActive(false);
    
    // If there's an intention, send a new Metatron request
    if (intention) {
      sendMessage(JSON.stringify({
        type: 'METATRON',
        data: {
          intention,
          boost: false
        }
      }));
    }
  };
  
  // Create an initial system message for the console
  useEffect(() => {
    if (isConnected) {
      setConsoleMessages([{
        type: 'SYSTEM',
        data: { message: 'Sacred geometry system initialized. Ready for intentions.' },
        timestamp: new Date().toISOString()
      }]);
    }
  }, [isConnected]);
  
  return (
    <SacredContext.Provider value={{
      intention,
      frequency,
      boost,
      multiplier,
      isConnected,
      
      torusField,
      merkabaField,
      metatronCube,
      sriYantra,
      flowerOfLife,
      
      consoleMessages,
      
      setIntention,
      setFrequency,
      setBoost,
      setMultiplier,
      sendIntention,
      activateMerkaba,
      toggleMetatronBoost,
      encodeWithSriYantra,
      blessWithFlowerOfLife,
      clearConsole,
      
      isTorusRotating,
      isTorusPulsing,
      toggleTorusRotation,
      toggleTorusPulse,
      resetTorus,
      
      isMetatronBoostActive,
      resetMetatron
    }}>
      {children}
    </SacredContext.Provider>
  );
};

export const useSacred = () => {
  const context = useContext(SacredContext);
  if (context === undefined) {
    throw new Error('useSacred must be used within a SacredProvider');
  }
  return context;
};
