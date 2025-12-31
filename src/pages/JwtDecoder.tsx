import React, { useEffect, useState } from 'react';

import Card from '../components/Card';
import { decodeToken, TokenDecodeResult } from '../api/endpoints';
import { formatJson } from '../utils/json';

interface JwtDecoderProps {
  currentToken: string | null;
}

const JwtDecoder: React.FC<JwtDecoderProps> = ({ currentToken }) => {
  const [tokenInput, setTokenInput] = useState<string>(currentToken ?? '');
  const [decodeResult, setDecodeResult] = useState<TokenDecodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenInput && currentToken) {
      setTokenInput(currentToken);
    }
  }, [currentToken, tokenInput]);

  const handleDecode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || tokenInput.trim() === '') {
      return;
    }
    setLoading(true);
    setError(null);
    setDecodeResult(null);
    try {
      const result = await decodeToken({ token: tokenInput.trim() });
      setDecodeResult(result);
    } catch (decodeError) {
      setError(decodeError instanceof Error ? decodeError.message : 'Unable to decode token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="JWT Decoder">
      <p>Send tokens to the backend decoder; no data is persisted.</p>
      <form onSubmit={handleDecode} className="stacked-form">
        <label htmlFor="jwt">Token</label>
        <textarea
          id="jwt"
          value={tokenInput}
          onChange={(event) => setTokenInput(event.target.value)}
          rows={4}
          spellCheck={false}
          placeholder="Paste a JWT here"
        />
        <button type="submit" disabled={loading || tokenInput.trim() === ''}>
          {loading ? 'Decoding…' : 'POST /api/auth/token/decode'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {decodeResult && (
        <div className="decode-result">
          <h3>Decoded</h3>
          <pre className="code-block">{formatJson(decodeResult)}</pre>
        </div>
      )}
    </Card>
  );
};

export default JwtDecoder;
