import React, { PropsWithChildren } from 'react';

const Card: React.FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  return (
    <section className="card">
      <header>
        <h2>{title}</h2>
      </header>
      <div className="card-body">{children}</div>
    </section>
  );
};

export default Card;
