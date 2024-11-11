// 'use client';
// import React, { useState } from 'react';
// import Sidebar from './components/sidebar';
// import TopNavigationTabs from './components/TopNavigationTabs';
// import PromptSection from './components/PromptSection';
// import ExamplesPanel from './components/ExamplesPanel';
// import UserProfileSection from './components/UserProfileSection';

// const MainPage = () => {
//   const [selectedTab, setSelectedTab] = useState('Prompt');
//   const [promptText, setPromptText] = useState('');

//   const handleExampleClick = (exampleText) => {
//     setPromptText((prevText) => `${prevText}\n${exampleText}`);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white overflow-y-auto">
//         <Sidebar />
//       </div>
      
//       {/* Main Content */}
//       <div className="ml-64 flex-1 flex flex-col h-full">
//         {/* Top Section */}
//         <div className="p-6 border-b border-gray-200 bg-white">
//           {/* Navigation Tabs */}
//           <TopNavigationTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />


//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           <div className="flex space-x-4">
//             <PromptSection promptText={promptText} setPromptText={setPromptText} />
//             <ExamplesPanel onExampleClick={handleExampleClick} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainPage;













'use client';
import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import TopNavigationTabs from './components/TopNavigationTabs';
import PromptSection from './components/PromptSection';
import ExamplesPanel from './components/ExamplesPanel';
import UserProfileSection from './components/UserProfileSection';
import RulesTable from './components/RulesTable';
import Labeling from './components/Labeling'; // Import the Labeling component

const MainPage = () => {
  const [selectedTab, setSelectedTab] = useState('Prompt');
  const [promptText, setPromptText] = useState('');

  const handleExampleClick = (exampleText) => {
    setPromptText((prevText) => `${prevText}\n${exampleText}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col h-full">
        {/* Top Section */}
        <div className="p-6 flex justify-between items-center border-b border-gray-200 bg-white">
          <TopNavigationTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex space-x-4">
            {selectedTab === 'Prompt' && (
              <>
                <PromptSection promptText={promptText} setPromptText={setPromptText} />
                <ExamplesPanel onExampleClick={handleExampleClick} />
              </>
            )}
            {selectedTab === 'Rules' && (
              <div className="w-full">
                <RulesTable />
              </div>
            )}
            {selectedTab === 'Labels' && (
              <div className="w-full">
                <Labeling />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
