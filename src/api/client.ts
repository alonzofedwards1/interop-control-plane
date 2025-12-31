const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? '';

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
