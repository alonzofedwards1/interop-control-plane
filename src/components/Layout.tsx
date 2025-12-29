import React, { PropsWithChildren } from 'react';

import Nav from './Nav';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="app-layout">
      <Nav />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
