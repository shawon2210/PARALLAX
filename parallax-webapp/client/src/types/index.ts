/** Response from the access request API */
export interface AccessRequestResponse {
  success: boolean;
  message: string;
  queuePosition?: number;
  requestId?: string;
}

/** Response from the live points API */
export interface LivePointsResponse {
  total: number;
  delta: number;
}

/** Health check response */
export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

/** Depth layer card data */
export interface DepthLayer {
  zone: string;
  distance: string;
  label: string;
  description: string;
  depth: number;
  icon: 'focus' | 'agents' | 'presence' | 'memory';
}
