// Mock Pusher implementation for testing real-time functionality

interface PusherEvent {
  channel: string;
  event: string;
  data: any;
  timestamp: number;
}

interface ChannelSubscription {
  channel: string;
  callbacks: Map<string, Function[]>;
}

class MockPusherChannel {
  private name: string;
  private callbacks: Map<string, Function[]> = new Map();
  private pusher: MockPusher;

  constructor(name: string, pusher: MockPusher) {
    this.name = name;
    this.pusher = pusher;
  }

  bind(event: string, callback: Function): this {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
    return this;
  }

  unbind(event?: string, callback?: Function): this {
    if (!event) {
      this.callbacks.clear();
      return this;
    }

    if (!callback) {
      this.callbacks.delete(event);
      return this;
    }

    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }

    return this;
  }

  trigger(event: string, data: any): boolean {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in Pusher callback:', error);
        }
      });
      return true;
    }
    return false;
  }

  // Test utilities
  getCallbackCount(event?: string): number {
    if (event) {
      return this.callbacks.get(event)?.length || 0;
    }
    return Array.from(this.callbacks.values()).reduce((sum, callbacks) => sum + callbacks.length, 0);
  }

  hasEvent(event: string): boolean {
    return this.callbacks.has(event);
  }
}

class MockPusher {
  private channels: Map<string, MockPusherChannel> = new Map();
  private connectionState: 'connecting' | 'connected' | 'disconnected' | 'failed' = 'disconnected';
  private eventLog: PusherEvent[] = [];
  private connectionCallbacks: Map<string, Function[]> = new Map();
  private config: any;

  constructor(appKey: string, config?: any) {
    this.config = { appKey, ...config };
    
    // Simulate connection after a short delay
    setTimeout(() => {
      this.connectionState = 'connected';
      this.triggerConnectionEvent('connected');
    }, 10);
  }

  subscribe(channelName: string): MockPusherChannel {
    if (!this.channels.has(channelName)) {
      this.channels.set(channelName, new MockPusherChannel(channelName, this));
    }
    return this.channels.get(channelName)!;
  }

  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.unbind(); // Clear all callbacks
      this.channels.delete(channelName);
    }
  }

  disconnect(): void {
    this.connectionState = 'disconnected';
    this.channels.clear();
    this.triggerConnectionEvent('disconnected');
  }

  connect(): void {
    if (this.connectionState === 'disconnected') {
      this.connectionState = 'connecting';
      this.triggerConnectionEvent('connecting');
      
      setTimeout(() => {
        this.connectionState = 'connected';
        this.triggerConnectionEvent('connected');
      }, 50);
    }
  }

  // Connection event handling
  get connection() {
    return {
      bind: (event: string, callback: Function) => {
        if (!this.connectionCallbacks.has(event)) {
          this.connectionCallbacks.set(event, []);
        }
        this.connectionCallbacks.get(event)!.push(callback);
      },
      unbind: (event?: string, callback?: Function) => {
        if (!event) {
          this.connectionCallbacks.clear();
          return;
        }
        if (!callback) {
          this.connectionCallbacks.delete(event);
          return;
        }
        const callbacks = this.connectionCallbacks.get(event);
        if (callbacks) {
          const index = callbacks.indexOf(callback);
          if (index !== -1) {
            callbacks.splice(index, 1);
          }
        }
      },
      state: this.connectionState,
    };
  }

  private triggerConnectionEvent(event: string): void {
    const callbacks = this.connectionCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in connection callback:', error);
        }
      });
    }
  }

  // Test utilities
  simulateMessage(channelName: string, event: string, data: any, delay: number = 0): void {
    const logEntry: PusherEvent = {
      channel: channelName,
      event,
      data,
      timestamp: Date.now(),
    };
    this.eventLog.push(logEntry);

    const triggerEvent = () => {
      const channel = this.channels.get(channelName);
      if (channel) {
        channel.trigger(event, data);
      }
    };

    if (delay > 0) {
      setTimeout(triggerEvent, delay);
    } else {
      triggerEvent();
    }
  }

  simulateConnectionFailure(): void {
    this.connectionState = 'failed';
    this.triggerConnectionEvent('failed');
  }

  simulateReconnection(): void {
    this.connectionState = 'connecting';
    this.triggerConnectionEvent('connecting');
    
    setTimeout(() => {
      this.connectionState = 'connected';
      this.triggerConnectionEvent('connected');
    }, 100);
  }

  simulateNetworkLatency(latency: number): void {
    // Override the simulateMessage method to add latency
    const originalSimulateMessage = this.simulateMessage.bind(this);
    this.simulateMessage = (channelName: string, event: string, data: any, delay: number = 0) => {
      originalSimulateMessage(channelName, event, data, delay + latency);
    };
  }

  // Test inspection methods
  getChannelCount(): number {
    return this.channels.size;
  }

  getChannelNames(): string[] {
    return Array.from(this.channels.keys());
  }

  getEventLog(): PusherEvent[] {
    return [...this.eventLog];
  }

  getEventsForChannel(channelName: string): PusherEvent[] {
    return this.eventLog.filter(event => event.channel === channelName);
  }

  clearEventLog(): void {
    this.eventLog = [];
  }

  getConnectionState(): string {
    return this.connectionState;
  }

  isChannelSubscribed(channelName: string): boolean {
    return this.channels.has(channelName);
  }

  getChannelCallbackCount(channelName: string, event?: string): number {
    const channel = this.channels.get(channelName);
    return channel ? channel.getCallbackCount(event) : 0;
  }

  // Performance testing utilities
  measureEventDeliveryTime(channelName: string, event: string, data: any): Promise<number> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const channel = this.subscribe(channelName);
      
      channel.bind(event, () => {
        const endTime = performance.now();
        resolve(endTime - startTime);
      });
      
      this.simulateMessage(channelName, event, data);
    });
  }

  // Batch event simulation for load testing
  simulateBatchMessages(
    channelName: string,
    event: string,
    messageCount: number,
    interval: number = 10
  ): Promise<void> {
    return new Promise((resolve) => {
      let sentCount = 0;
      
      const sendNext = () => {
        if (sentCount >= messageCount) {
          resolve();
          return;
        }
        
        this.simulateMessage(channelName, event, {
          id: sentCount + 1,
          message: `Batch message ${sentCount + 1}`,
          timestamp: Date.now(),
        });
        
        sentCount++;
        setTimeout(sendNext, interval);
      };
      
      sendNext();
    });
  }

  // Reset for testing
  reset(): void {
    this.channels.clear();
    this.eventLog = [];
    this.connectionCallbacks.clear();
    this.connectionState = 'disconnected';
  }
}

// Global mock instance
let mockPusherInstance: MockPusher | null = null;

// Factory function for creating mock Pusher instances
export const createMockPusher = (appKey: string, config?: any): MockPusher => {
  mockPusherInstance = new MockPusher(appKey, config);
  return mockPusherInstance;
};

// Get the current mock instance (for testing)
export const getMockPusherInstance = (): MockPusher | null => {
  return mockPusherInstance;
};

// Reset the mock instance
export const resetMockPusher = (): void => {
  if (mockPusherInstance) {
    mockPusherInstance.reset();
  }
  mockPusherInstance = null;
};

// Test utilities for Pusher testing
export const pusherTestUtils = {
  // Create a mock Pusher instance for testing
  createMockInstance: createMockPusher,
  
  // Get the current mock instance
  getInstance: getMockPusherInstance,
  
  // Reset the mock
  reset: resetMockPusher,
  
  // Simulate real-time scenarios
  simulateRealTimeScenario: async (scenario: {
    channels: string[];
    events: Array<{ channel: string; event: string; data: any; delay?: number }>;
    networkLatency?: number;
  }): Promise<PusherEvent[]> => {
    const pusher = getMockPusherInstance();
    if (!pusher) {
      throw new Error('No mock Pusher instance available');
    }
    
    if (scenario.networkLatency) {
      pusher.simulateNetworkLatency(scenario.networkLatency);
    }
    
    // Subscribe to all channels
    scenario.channels.forEach(channel => pusher.subscribe(channel));
    
    // Send all events
    for (const eventData of scenario.events) {
      pusher.simulateMessage(
        eventData.channel,
        eventData.event,
        eventData.data,
        eventData.delay || 0
      );
    }
    
    // Wait for all events to be processed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return pusher.getEventLog();
  },
  
  // Test message delivery consistency
  testMessageDeliveryConsistency: async (
    channelName: string,
    messageCount: number,
    interval: number = 10
  ): Promise<{ delivered: number; totalTime: number; averageLatency: number }> => {
    const pusher = getMockPusherInstance();
    if (!pusher) {
      throw new Error('No mock Pusher instance available');
    }
    
    const channel = pusher.subscribe(channelName);
    const deliveredMessages: number[] = [];
    const startTime = performance.now();
    
    channel.bind('test-message', (data: any) => {
      deliveredMessages.push(data.id);
    });
    
    await pusher.simulateBatchMessages(channelName, 'test-message', messageCount, interval);
    
    // Wait for all messages to be processed
    await new Promise(resolve => setTimeout(resolve, messageCount * interval + 100));
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageLatency = totalTime / messageCount;
    
    return {
      delivered: deliveredMessages.length,
      totalTime,
      averageLatency,
    };
  },
  
  // Test connection reliability
  testConnectionReliability: async (
    failureCount: number,
    recoveryTime: number = 100
  ): Promise<{ failures: number; recoveries: number; totalTime: number }> => {
    const pusher = getMockPusherInstance();
    if (!pusher) {
      throw new Error('No mock Pusher instance available');
    }
    
    let failures = 0;
    let recoveries = 0;
    const startTime = performance.now();
    
    pusher.connection.bind('failed', () => failures++);
    pusher.connection.bind('connected', () => recoveries++);
    
    // Simulate multiple connection failures and recoveries
    for (let i = 0; i < failureCount; i++) {
      pusher.simulateConnectionFailure();
      await new Promise(resolve => setTimeout(resolve, recoveryTime));
      pusher.simulateReconnection();
      await new Promise(resolve => setTimeout(resolve, recoveryTime));
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    return { failures, recoveries, totalTime };
  },
};