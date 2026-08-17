import { useEffect, useRef, useState } from 'react';

const WS_URL = 'ws://localhost:8000/live';

interface RiskUpdateEvent {
  event: 'risk_update';
  junction_id: string;
  score: number;
  nl_explanation: string;
  timestamp: string;
}

export const useLiveSocket = (onRiskUpdate: (update: RiskUpdateEvent) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'risk_update') {
            onRiskUpdate(data as RiskUpdateEvent);
          }
        } catch (err) {
          console.error("Failed to parse websocket message", err);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected, reconnecting in 3s...');
        setTimeout(connect, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [onRiskUpdate]);

  return { isConnected };
};
