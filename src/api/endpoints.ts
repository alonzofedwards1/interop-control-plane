import { apiRequest } from './client';

export interface ManualTokenRequest {
  [key: string]: unknown;
}

export interface TokenResponse {
  token: string;
  expires_at?: string;
  issued_at?: string;
}

export interface TokenHealth {
  status: string;
  detail?: string;
  checked_at?: string;
}

export interface TokenDecodeRequest {
  token: string;
}

export interface TokenDecodeResult {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  active?: boolean;
}

export interface HealthStatus {
  status: string;
  details?: string;
  timestamp?: string;
}

export interface PatientSearchRequest {
  criteria: Record<string, unknown>;
}

export interface PatientSearchResponse {
  status: string;
  execution_id: string;
  criteria: Record<string, unknown>;
}

export interface PatientDiscoveryTriggerRequest {
  [key: string]: unknown;
}

export interface PatientDiscoveryTriggerResponse {
  correlation_id: string;
  forwarded: boolean;
  downstream_status?: string;
  message?: string;
}

export const requestToken = (payload: ManualTokenRequest) =>
  apiRequest<TokenResponse>('/api/auth/token', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchToken = () => apiRequest<TokenResponse>('/api/auth/token');

export const fetchTokenHealth = () => apiRequest<TokenHealth>('/api/auth/token/health');

export const decodeToken = (payload: TokenDecodeRequest) =>
  apiRequest<TokenDecodeResult>('/api/auth/token/decode', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchHealth = () => apiRequest<HealthStatus>('/api/health');

export const submitPatientSearch = (payload: PatientSearchRequest) =>
  apiRequest<PatientSearchResponse>('/api/patient/search', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const triggerPatientDiscovery = (payload: PatientDiscoveryTriggerRequest) =>
  apiRequest<PatientDiscoveryTriggerResponse>('/api/pd/trigger', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
