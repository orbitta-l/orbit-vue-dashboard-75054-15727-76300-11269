// src/components/LeftPanel/index.tsx

import React from 'react';

interface LeftPanelProps {
  title: React.ReactNode;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ title }) => {
  return (
    <section className="left-panel">
      <div className="content">
        <h1>{title}</h1>
      </div>
    </section>
  );
};

export default LeftPanel;