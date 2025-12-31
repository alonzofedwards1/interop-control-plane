const rawApiBase = process.env.REACT_APP_API_BASE_URL?.trim() ?? '';
const API_BASE_URL = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase;

export const apiBaseUrl = API_BASE_URL;

export const isApiConfigured = API_BASE_URL.length > 0;

export const apiConfigurationErrorMessage =
  'API base URL is not configured. Set REACT_APP_API_BASE_URL to your FastAPI host (e.g., http://localhost:8000).';

const defaultHeaders: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const readResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json() as Promise<unknown>;
  }

  const text = await response.text();
  return text ? text : undefined;
};

export const apiRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!isApiConfigured) {
    throw new Error(apiConfigurationErrorMessage);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { ...defaultHeaders, ...init?.headers },
  });

  const data = await readResponseBody(response);

  if (!response.ok) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    throw new Error(message || `Request to ${path} failed with status ${response.status}`);
  }

  return data as T;
};
