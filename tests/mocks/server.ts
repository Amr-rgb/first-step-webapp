import { setupServer } from 'msw/node';
import { chatHandlers } from './handlers/chatHandlers';
import { authHandlers } from './handlers/authHandlers';

// This configures a request mocking server with the given request handlers
export const server = setupServer(
  ...chatHandlers,
  ...authHandlers
);