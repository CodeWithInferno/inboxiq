import React from 'react';

const TopNavigationTabs = ({ selectedTab, setSelectedTab }) => {
  const tabs = ['Prompt', 'Rules', 'Pending', 'History', 'Test', 'Labels'];

  return (
    <div className="flex space-x-4 border-b border-gray-200 p-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`text-sm font-semibold ${
            selectedTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TopNavigationTabs;
