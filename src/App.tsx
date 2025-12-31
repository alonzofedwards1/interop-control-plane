import React, { useState } from 'react';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import JwtDecoder from './pages/JwtDecoder';
import PatientDiscovery from './pages/PatientDiscovery';
import TokenManager from './pages/TokenManager';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <Layout>
      <Dashboard />
      <TokenManager onTokenChange={setToken} currentToken={token} />
      <JwtDecoder currentToken={token} />
      <PatientDiscovery activeToken={token} />
    </Layout>
  );
};

export default App;
