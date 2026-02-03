import { http, HttpResponse } from 'msw';
import { testData } from '../data/testData';

const API_BASE_URL = 'http://localhost:3001/api';

export const chatHandlers = [
  // Get chat contacts
  http.get(`${API_BASE_URL}/new-chat-contacts`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(testData.contacts);
  }),

  // Get messages for a conversation
  http.get(`${API_BASE_URL}/new-messages/:contactId`, ({ params, request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contactId } = params;
    const url = new URL(request.url);
    const senderId = url.searchParams.get('sender_id');
    
    // Filter messages based on contactId and senderId
    const messages = testData.messages.filter(msg => {
      if (senderId) {
        return (msg.receiver_id.toString() === contactId && msg.sender_id.toString() === senderId) ||
               (msg.sender_id.toString() === contactId && msg.receiver_id.toString() === senderId);
      }
      return msg.receiver_id.toString() === contactId || msg.sender_id.toString() === contactId;
    });

    return HttpResponse.json(messages);
  }),

  // Send a new message
  http.post(`${API_BASE_URL}/new-messages`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as any;
    
    // Validate required fields
    if (!body.sender_id || !body.receiver_id || !body.message) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Simulate rate limiting
    if (body.message.length > 1000) {
      return HttpResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    // Create new message
    const newMessage = {
      id: Date.now(),
      sender_id: body.sender_id,
      receiver_id: body.receiver_id,
      message: body.message,
      image: body.image,
      video_url: body.video_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_read: false,
      is_read_admin: false,
      image_url: body.image ? `http://example.com/images/${Date.now()}.jpg` : null,
      video_url_path: body.video_url,
    };

    return HttpResponse.json({ message: newMessage });
  }),

  // Mark message as read
  http.post(`${API_BASE_URL}/new-chat/mark-as-read`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as any;
    
    if (!body.message_id) {
      return HttpResponse.json({ error: 'Message ID required' }, { status: 400 });
    }

    return HttpResponse.json({ success: true });
  }),

  // Update online status
  http.post(`${API_BASE_URL}/new-online`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_BASE_URL}/new-offline`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({ success: true });
  }),

  // Admin endpoints
  http.get(`${API_BASE_URL}/admin/conversations`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({ data: testData.adminConversations });
  }),

  http.post(`${API_BASE_URL}/admin/messages/send`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as any;
    
    if (!body.sender_id || !body.receiver_id || !body.message) {
      return HttpResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage = {
      id: Date.now(),
      sender_id: body.sender_id,
      receiver_id: body.receiver_id,
      message: body.message,
      image: body.image,
      video_url: body.video_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_read: false,
      is_read_admin: true,
      is_admin_message: true,
      image_url: body.image ? `http://example.com/images/${Date.now()}.jpg` : null,
      video_url_path: body.video_url,
    };

    return HttpResponse.json({ message: newMessage });
  }),

  // Center parents endpoint
  http.get(`${API_BASE_URL}/center/parents`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(testData.centerParents);
  }),

  // Get centers for parent
  http.get(`${API_BASE_URL}/get-centers-parent`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(testData.centersForParent);
  }),
];