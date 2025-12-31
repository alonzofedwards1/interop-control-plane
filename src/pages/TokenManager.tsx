import React, { useState } from 'react';

import Card from '../components/Card';
import { apiConfigurationErrorMessage, isApiConfigured } from '../api/client';
import { fetchToken, requestToken, TokenResponse } from '../api/endpoints';
import { formatJson, parseJsonObject } from '../utils/json';

interface TokenManagerProps {
  onTokenChange: (token: string) => void;
  currentToken: string | null;
}

const TokenManager: React.FC<TokenManagerProps> = ({ onTokenChange, currentToken }) => {
  const [requestBody, setRequestBody] = useState<string>(JSON.stringify({}, null, 2));
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleRequestToken = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isApiConfigured || loading) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = parseJsonObject(requestBody);
      const result = await requestToken(payload);
      setTokenResponse(result);
      onTokenChange(result.token);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to request token');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchToken = async () => {
    if (!isApiConfigured || fetching) {
      return;
    }
    setFetching(true);
    setError(null);
    try {
      const result = await fetchToken();
      setTokenResponse(result);
      onTokenChange(result.token);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to fetch token');
    } finally {
      setFetching(false);
    }
  };

  return (
    <Card title="Token Manager">
      <p>Issue or retrieve the control-plane token before calling patient endpoints.</p>
      <form onSubmit={handleRequestToken} className="stacked-form">
        <label htmlFor="token-request">Manual Token Request (JSON)</label>
        <textarea
          id="token-request"
          value={requestBody}
          onChange={(event) => setRequestBody(event.target.value)}
          rows={6}
          spellCheck={false}
          disabled={!isApiConfigured}
        />
        <div className="actions">
          <button type="submit" disabled={!isApiConfigured || loading}>
            {loading ? 'Requesting…' : 'POST /api/auth/token'}
          </button>
          <button type="button" onClick={handleFetchToken} disabled={!isApiConfigured || fetching}>
            {fetching ? 'Fetching…' : 'GET /api/auth/token'}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      {!isApiConfigured && <p className="warning">{apiConfigurationErrorMessage}</p>}

      <div className="token-state">
        <p>
          <strong>Active token:</strong> {currentToken ?? 'None issued yet'}
        </p>
        {tokenResponse && (
          <pre className="code-block">{formatJson(tokenResponse)}</pre>
        )}
      </div>
    </Card>
  );
};

export default TokenManager;
