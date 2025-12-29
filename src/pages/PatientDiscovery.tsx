import React from 'react';

import Card from '../components/Card';

const PatientDiscovery: React.FC = () => {
  return (
    <Card title="Patient Discovery">
      Search for patients across connected FHIR endpoints.
    </Card>
  );
};

export default PatientDiscovery;
