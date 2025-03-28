import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface SocketContextType {
  socket: WebSocket | null;
  connected: boolean;
  lastMessage: string | null;
  sendMessage: (message: any) => boolean;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  lastMessage: null,
  sendMessage: () => false,
  connect: () => {},
  disconnect: () => {}
});

export function useWebSocket() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const { toast } = useToast();
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      // Get WebSocket URL
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setSocket(ws);
        setConnected(true);
        setReconnectAttempt(0);
        
        toast({
          title: "Connected to Subtle Energy Network",
          description: "Your device is now connected to the Sacred Computing Platform",
        });
      };
      
      ws.onmessage = (event) => {
        setLastMessage(event.data);
      };
      
      ws.onclose = () => {
        setSocket(null);
        setConnected(false);
        
        // Only show toast if previously connected
        if (connected) {
          toast({
            title: "Connection Lost",
            description: "Your connection to the subtle energy network has ended",
            variant: "destructive"
          });
        }
        
        // Try to reconnect with exponential backoff
        if (reconnectAttempt < 5) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
          setTimeout(() => {
            setReconnectAttempt(prev => prev + 1);
            connect();
          }, timeout);
        }
      };
      
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };
      
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the subtle energy network",
        variant: "destructive"
      });
    }
  }, [toast, connected, reconnectAttempt]);
  
  // Send a message through WebSocket
  const sendMessage = useCallback((message: any) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast({
        title: "Connection Error",
        description: "Cannot send message. Not connected to the subtle energy network.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Convert to string if it's an object
      const messageStr = typeof message === 'object' ? JSON.stringify(message) : message;
      socket.send(messageStr);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Transmission Error",
        description: "Failed to send message through the subtle energy network",
        variant: "destructive"
      });
      return false;
    }
  }, [socket, toast]);
  
  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setConnected(false);
    }
  }, [socket]);
  
  // Connect when component mounts
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);
  
  const value = {
    socket,
    connected,
    lastMessage,
    sendMessage,
    connect,
    disconnect
  };
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}