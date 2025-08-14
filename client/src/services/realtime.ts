import { useActivityStore } from '../stores';

let eventSource: EventSource | null = null;

export const startRealTimeConnection = () => {
  if (eventSource) {
    eventSource.close();
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const url = `${API_BASE_URL}/api/events`;

  eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log('Real-time connection established');
  };

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handleRealtimeUpdate(data);
    } catch (error) {
      console.error('Error parsing real-time data:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('Real-time connection error:', error);
    
    // Attempt to reconnect after 5 seconds
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      startRealTimeConnection();
    }, 5000);
  };
};

const handleRealtimeUpdate = (data: any) => {
  const { addActivity } = useActivityStore.getState();

  switch (data.type) {
    case 'bot_activity':
      addActivity({
        id: data.id,
        type: data.status,
        message: data.message,
        details: data.details,
        pnl: data.pnl || 0,
        timestamp: new Date(data.timestamp)
      });
      break;
    
    case 'trade_executed':
      addActivity({
        id: data.id,
        type: 'online',
        message: `Trade executed: ${data.pair}`,
        details: `${data.side} ${data.amount} at ${data.price}`,
        pnl: data.pnl || 0,
        timestamp: new Date(data.timestamp)
      });
      break;

    default:
      console.log('Unknown real-time event type:', data.type);
  }
};

export const stopRealTimeConnection = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
};