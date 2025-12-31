import React, { useEffect, useState } from 'react';

import Card from '../components/Card';
import { apiConfigurationErrorMessage, isApiConfigured } from '../api/client';
import { fetchHealth, fetchTokenHealth, HealthStatus, TokenHealth } from '../api/endpoints';

const Dashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<HealthStatus | null>(null);
  const [tokenHealth, setTokenHealth] = useState<TokenHealth | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [tokenHealthError, setTokenHealthError] = useState<string | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingTokenHealth, setLoadingTokenHealth] = useState(false);

  const loadSystemHealth = async () => {
    setLoadingHealth(true);
    setHealthError(null);
    try {
      const result = await fetchHealth();
      setSystemHealth(result);
    } catch (error) {
      setHealthError(error instanceof Error ? error.message : 'Unable to load system health');
      setSystemHealth(null);
    } finally {
      setLoadingHealth(false);
    }
  };

  const loadTokenHealth = async () => {
    setLoadingTokenHealth(true);
    setTokenHealthError(null);
    try {
      const result = await fetchTokenHealth();
      setTokenHealth(result);
    } catch (error) {
      setTokenHealthError(error instanceof Error ? error.message : 'Unable to load token health');
      setTokenHealth(null);
    } finally {
      setLoadingTokenHealth(false);
    }
  };

  useEffect(() => {
    if (!isApiConfigured) {
      setHealthError(apiConfigurationErrorMessage);
      setTokenHealthError(apiConfigurationErrorMessage);
      return;
    }

    void loadSystemHealth();
    void loadTokenHealth();
  }, []);

  return (
    <div className="grid">
      <Card title="System Health">
        <p>Call-safe endpoint to verify control plane readiness.</p>
        <button type="button" onClick={loadSystemHealth} disabled={!isApiConfigured || loadingHealth}>
          {loadingHealth ? 'Checking…' : 'Refresh Health'}
        </button>
        {systemHealth && (
          <ul className="status-list">
            <li>
              <strong>Status:</strong> {systemHealth.status}
            </li>
            {systemHealth.details && (
              <li>
                <strong>Details:</strong> {systemHealth.details}
              </li>
            )}
            {systemHealth.timestamp && (
              <li>
                <strong>Timestamp:</strong> {systemHealth.timestamp}
              </li>
            )}
          </ul>
        )}
        {healthError && <p className="error">{healthError}</p>}
        {!isApiConfigured && <p className="warning">Configure REACT_APP_API_BASE_URL to enable health checks.</p>}
      </Card>

      <Card title="Token Health">
        <p>Verify token service availability before issuing credentials.</p>
        <button type="button" onClick={loadTokenHealth} disabled={!isApiConfigured || loadingTokenHealth}>
          {loadingTokenHealth ? 'Checking…' : 'Refresh Token Health'}
        </button>
        {tokenHealth && (
          <ul className="status-list">
            <li>
              <strong>Status:</strong> {tokenHealth.status}
            </li>
            {tokenHealth.detail && (
              <li>
                <strong>Detail:</strong> {tokenHealth.detail}
              </li>
            )}
            {tokenHealth.checked_at && (
              <li>
                <strong>Checked:</strong> {tokenHealth.checked_at}
              </li>
            )}
          </ul>
        )}
        {tokenHealthError && <p className="error">{tokenHealthError}</p>}
        {!isApiConfigured && <p className="warning">Configure REACT_APP_API_BASE_URL to check token service readiness.</p>}
      </Card>

      <Card title="Operational Guidance">
        <ul className="status-list">
          <li>Use Token Manager to obtain a token before patient search.</li>
          <li>Health checks never require authentication.</li>
          <li>All patient operations only return orchestration identifiers.</li>
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;
