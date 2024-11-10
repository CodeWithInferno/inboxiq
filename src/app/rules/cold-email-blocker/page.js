import React from 'react';
import Sidebar from '../components/sidebar';

const RulesPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Rules & Features</h1>
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default RulesPage;
