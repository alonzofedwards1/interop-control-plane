import { apiRequest } from './client';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
}

export const fetchHealth = () => apiRequest<HealthStatus>('/health');
