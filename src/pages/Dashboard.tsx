import React from 'react';

import Card from '../components/Card';

const Dashboard: React.FC = () => {
  return (
    <div className="grid">
      <Card title="System Health">Track API and service availability.</Card>
      <Card title="Tokens">Monitor issued tokens and expirations.</Card>
      <Card title="FHIR">Keep tabs on patient discovery requests.</Card>
    </div>
  );
};

export default Dashboard;
