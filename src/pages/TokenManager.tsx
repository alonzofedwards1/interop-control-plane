import React from 'react';

import Card from '../components/Card';

const TokenManager: React.FC = () => {
  return (
    <Card title="Token Manager">
      Generate, revoke, and inspect access tokens for downstream services.
    </Card>
  );
};

export default TokenManager;
