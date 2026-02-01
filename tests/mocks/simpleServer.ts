// Simplified mock server for testing without MSW dependencies
// This provides the same interface as MSW but with simpler implementation

interface MockRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
}

interface MockResponse {
  status: number;
  data: any;
  headers?: Record<string, string>;
}

type RequestHandler = (request: MockRequest) => MockResponse | Promise<MockResponse>;

class SimpleMockServer {
  private handlers: Map<string, RequestHandler> = new Map();
  private isListening = false;

  // Add a request handler
  use(pattern: string, method: string, handler: RequestHandler) {
    const key = `${method.toUpperCase()}:${pattern}`;
    this.handlers.set(key, handler);
  }

  // Start listening (mock implementation)
  listen() {
    this.isListening = true;
  }

  // Reset handlers
  resetHandlers() {
    // Keep the handlers but reset any state if needed
  }

  // Close the server
  close() {
    this.isListening = false;
  }

  // Mock a request (for testing)
  async mockRequest(method: string, url: string, options: {
    headers?: Record<string, string>;
    body?: any;
  } = {}): Promise<MockResponse> {
    const request: MockRequest = {
      method: method.toUpperCase(),
      url,
      headers: options.headers || {},
      body: options.body,
    };

    // Find matching handler
    for (const [pattern, handler] of this.handlers.entries()) {
      const [handlerMethod, handlerPattern] = pattern.split(':');
      
      if (handlerMethod === request.method && this.matchesPattern(url, handlerPattern)) {
        return await handler(request);
      }
    }

    // Default 404 response
    return {
      status: 404,
      data: { error: 'Not found' },
    };
  }

  private matchesPattern(url: string, pattern: string): boolean {
    // Simple pattern matching - replace :param with regex
    const regexPattern = pattern.replace(/:([^/]+)/g, '([^/]+)');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(url);
  }

  // Extract parameters from URL
  extractParams(url: string, pattern: string): Record<string, string> {
    const params: Record<string, string> = {};
    const patternParts = pattern.split('/');
    const urlParts = url.split('/');

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      if (patternPart.startsWith(':')) {
        const paramName = patternPart.slice(1);
        params[paramName] = urlParts[i];
      }
    }

    return params;
  }
}

// Create a global instance
export const simpleMockServer = new SimpleMockServer();

// Helper functions to mimic MSW API
export const http = {
  get: (pattern: string, handler: RequestHandler) => {
    simpleMockServer.use(pattern, 'GET', handler);
  },
  post: (pattern: string, handler: RequestHandler) => {
    simpleMockServer.use(pattern, 'POST', handler);
  },
  put: (pattern: string, handler: RequestHandler) => {
    simpleMockServer.use(pattern, 'PUT', handler);
  },
  delete: (pattern: string, handler: RequestHandler) => {
    simpleMockServer.use(pattern, 'DELETE', handler);
  },
};

export const HttpResponse = {
  json: (data: any, options: { status?: number } = {}) => ({
    status: options.status || 200,
    data,
  }),
};