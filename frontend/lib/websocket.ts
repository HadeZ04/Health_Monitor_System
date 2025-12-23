import { useEffect, useRef, useState } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";

export interface SignalData {
  type: "ecg" | "spo2" | "hr" | "ppg" | "pcg" | "gps";
  value: any;
  timestamp: number;
  deviceId?: string;
}

export function useWebSocket(onMessage?: (data: SignalData) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<SignalData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function connect() {
      try {
        const ws = new WebSocket(WS_URL);
        
        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data: SignalData = JSON.parse(event.data);
            setLastMessage(data);
            onMessage?.(data);
          } catch (error) {
            console.error("Failed to parse message:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
          // Attempt to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connect();
          }, 5000);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error("Failed to create WebSocket:", error);
      }
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [onMessage]);

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  return { isConnected, lastMessage, sendMessage };
}

export function useMqttStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [uptime, setUptime] = useState("0h 0m");
  const [throughput, setThroughput] = useState("0 kbps");

  // Simulate MQTT connection status
  useEffect(() => {
    setIsConnected(true);
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      setUptime(`${hours}h ${minutes}m`);
      setThroughput(`${(Math.random() * 2).toFixed(1)} kbps`);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected, uptime, throughput };
}

