import React from 'react';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import JwtDecoder from './pages/JwtDecoder';
import PatientDiscovery from './pages/PatientDiscovery';
import TokenManager from './pages/TokenManager';

const App: React.FC = () => {
  return (
    <Layout>
      <Dashboard />
      <TokenManager />
      <JwtDecoder />
      <PatientDiscovery />
    </Layout>
  );
};

export default App;
