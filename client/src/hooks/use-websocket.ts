import { useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useWebSocket = (path: string) => {
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [lastMessage, setLastMessage] = useState<MessageEvent<any> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Create WebSocket connection
  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}${path}`;
    
    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setReadyState(WebSocket.OPEN);
        toast({
          title: "Connected",
          description: "Sacred energy connection established.",
        });
      };

      ws.onmessage = (event) => {
        setLastMessage(event);
      };

      ws.onclose = () => {
        setReadyState(WebSocket.CLOSED);
        wsRef.current = null;
        
        // Try to reconnect after a delay
        if (reconnectTimeoutRef.current === null) {
          toast({
            title: "Connection Lost",
            description: "Sacred energy connection temporarily disrupted. Reconnecting...",
            variant: "destructive",
          });
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Error in sacred energy connection. Attempting to reestablish.",
          variant: "destructive",
        });
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setReadyState(WebSocket.CLOSED);
    }
  }, [path, toast]);

  // Connect on component mount
  useEffect(() => {
    connect();

    return () => {
      // Clean up on unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Function to send a message
  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
      return true;
    }
    
    toast({
      title: "Connection Issue",
      description: "Cannot send message. Connection not established.",
      variant: "destructive",
    });
    
    return false;
  }, [toast]);

  return { sendMessage, lastMessage, readyState };
};
