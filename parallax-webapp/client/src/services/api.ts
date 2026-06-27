import type {
  AccessRequestResponse,
  LivePointsResponse,
  HealthResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/** Generic fetch wrapper with JSON parsing and error handling */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${endpoint} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** Submit an access request — calls POST /api/access/request */
export function requestAccess(email: string): Promise<AccessRequestResponse> {
  return fetchAPI<AccessRequestResponse>('/access/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/** Get current live point count — calls GET /api/points/live */
export function getLivePoints(): Promise<LivePointsResponse> {
  return fetchAPI<LivePointsResponse>('/points/live');
}

/** Health check — calls GET /api/health */
export function healthCheck(): Promise<HealthResponse> {
  return fetchAPI<HealthResponse>('/health');
}
