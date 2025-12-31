export const parseJsonObject = (value: string): Record<string, unknown> => {
  const parsed = JSON.parse(value) as unknown;

  if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error('Request payload must be a JSON object.');
  }

  return parsed as Record<string, unknown>;
};

export const formatJson = (value: unknown): string => JSON.stringify(value, null, 2);
