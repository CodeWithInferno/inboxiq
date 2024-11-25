import React from 'react';
import Sidebar from '../components/sidebar';

const RulesPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
      <h1 className='text-left text-black font-bold text-3xl'>Analytics</h1>
      </div>
    </div>
  );
};

export default RulesPage;
