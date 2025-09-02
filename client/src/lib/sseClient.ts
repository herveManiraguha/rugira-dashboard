// SSE Client for real-time streaming updates
export class SSEClient {
  private eventSource: EventSource | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  private environment: 'Demo' | 'Paper' | 'Live' = 'Demo';
  private handlers: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    // Initialize handlers map
    this.handlers = new Map();
  }

  setEnvironment(env: 'Demo' | 'Paper' | 'Live') {
    this.environment = env;
    // Always disconnect when changing environment
    if (this.eventSource) {
      this.disconnect();
    }
    // Only reconnect if not Demo mode
    if (env !== 'Demo') {
      this.connect();
    }
  }

  connect() {
    if (this.environment === 'Demo') {
      // No SSE in demo mode, disconnect any existing connection
      this.disconnect();
      return;
    }

    // Don't create multiple connections
    if (this.eventSource && this.eventSource.readyState === EventSource.OPEN) {
      return;
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    const streamUrl = `${apiBaseUrl}/stream`;

    try {
      this.eventSource = new EventSource(streamUrl, {
        withCredentials: true // Send cookies for authentication
      });

      this.eventSource.onopen = () => {
        console.log('SSE connection established');
        this.reconnectDelay = 1000; // Reset delay on successful connection
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        // Only attempt reconnect if not in Demo mode
        if (this.environment !== 'Demo') {
          this.handleReconnect();
        }
      };

      // Handle specific event types
      this.eventSource.addEventListener('botStatus', (event) => {
        this.handleEvent('botStatus', JSON.parse(event.data));
      });

      this.eventSource.addEventListener('metricsTick', (event) => {
        this.handleEvent('metricsTick', JSON.parse(event.data));
      });

      this.eventSource.addEventListener('complianceAlert', (event) => {
        this.handleEvent('complianceAlert', JSON.parse(event.data));
      });

      this.eventSource.addEventListener('backtestProgress', (event) => {
        this.handleEvent('backtestProgress', JSON.parse(event.data));
      });

      this.eventSource.addEventListener('orderUpdate', (event) => {
        this.handleEvent('orderUpdate', JSON.parse(event.data));
      });

      this.eventSource.addEventListener('positionUpdate', (event) => {
        this.handleEvent('positionUpdate', JSON.parse(event.data));
      });

      this.eventSource.addEventListener('marketUpdate', (event) => {
        this.handleEvent('marketUpdate', JSON.parse(event.data));
      });

      // Handle generic message event
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleEvent('message', data);
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      this.handleReconnect();
    }
  }

  private handleEvent(eventType: string, data: any) {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${eventType} handler:`, error);
        }
      });
    }
  }

  private handleReconnect() {
    // Don't reconnect in Demo mode
    if (this.environment === 'Demo') {
      return;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    // Clear any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    // Exponential backoff for reconnection
    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect SSE (delay: ${this.reconnectDelay}ms)`);
      this.connect();
      
      // Increase delay for next attempt (exponential backoff)
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
    }, this.reconnectDelay);
  }

  on(eventType: string, handler: (data: any) => void) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  off(eventType: string, handler: (data: any) => void) {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.reconnectDelay = 1000; // Reset delay
  }
}

// Export singleton instance
export const sseClient = new SSEClient();

export default sseClient;