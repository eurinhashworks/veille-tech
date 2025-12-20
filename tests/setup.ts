// Setup environment variables for tests
process.env.API_KEY = 'test-api-key';

import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';

// Setup Mock Service Worker for API mocking if needed
// export const server = setupServer();

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());
