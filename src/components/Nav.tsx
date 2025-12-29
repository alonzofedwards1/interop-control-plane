import React from 'react';

const Nav: React.FC = () => {
  return (
    <header className="nav">
      <h1>Interop Control Plane</h1>
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Token Manager</li>
          <li>JWT Decoder</li>
          <li>Patient Discovery</li>
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
