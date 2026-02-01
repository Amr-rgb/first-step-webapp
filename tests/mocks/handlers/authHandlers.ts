import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:3001/api';

export const authHandlers = [
  // Mock authentication endpoint
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as any;
    
    if (!body.email || !body.password) {
      return HttpResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Mock successful login
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: '1',
        name: 'Test User',
        email: body.email,
        role: 'parent',
      },
    });
  }),

  // Mock token validation
  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'parent',
    });
  }),

  // Mock token refresh
  http.post(`${API_BASE_URL}/auth/refresh`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      token: 'new-mock-jwt-token',
    });
  }),
];