import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SacredContextType {
  isConnected: boolean;
  socket: WebSocket | null;
  connect: (socket: WebSocket) => void;
  disconnect: () => void;
  sendIntention: (intention: string, frequency?: number, context?: string) => void;
}

const SacredContext = createContext<SacredContextType>({
  isConnected: false,
  socket: null,
  connect: () => {},
  disconnect: () => {},
  sendIntention: () => {},
});

export function useSacred() {
  return useContext(SacredContext);
}

interface SacredProviderProps {
  children: ReactNode;
}

export function SacredProvider({ children }: SacredProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Function to connect to WebSocket
  const connect = (socket: WebSocket) => {
    setSocket(socket);
    setIsConnected(socket.readyState === WebSocket.OPEN);
  };

  // Function to disconnect WebSocket
  const disconnect = () => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
  };

  // Function to send intention via WebSocket
  const sendIntention = (intention: string, frequency: number = 7.83, context: string = 'general') => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Create message data
      const message = {
        type: 'INTENTION',
        data: {
          intention,
          frequency,
          boost: context === 'manifestation' || context === 'healing',
          multiplier: context === 'healing' ? 2.0 : 1.0,
          context
        },
        timestamp: new Date().toISOString()
      };
      
      // Send as JSON string
      socket.send(JSON.stringify(message));
    }
  };

  const value = {
    isConnected,
    socket,
    connect,
    disconnect,
    sendIntention
  };

  return (
    <SacredContext.Provider value={value}>
      {children}
    </SacredContext.Provider>
  );
}