import { apiRequest } from './client';

export interface TokenResponse {
  token: string;
  expiresAt: string;
}

export const issueToken = () => apiRequest<TokenResponse>('/tokens/issue', { method: 'POST' });
export const revokeToken = (token: string) =>
  apiRequest<void>('/tokens/revoke', { method: 'POST', body: JSON.stringify({ token }) });
