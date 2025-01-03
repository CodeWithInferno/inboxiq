// 'use client';
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../components/sidebar';
// import { Switch } from '@headlessui/react';

// const RulesPage = () => {
//   const [promptText, setPromptText] = useState('');
//   const [action, setAction] = useState('archive'); // New state for action
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

//   useEffect(() => {
//     // Fetch initial prompt, feature state, and action
//     const fetchPromptData = async () => {
//       try {
//         const response = await fetch('/api/Rules/ColdEmail/GetPrompt');
//         const data = await response.json();
//         setPromptText(data.prompt || '');
//         setIsFeatureEnabled(data.isEnabled || false);
//         setAction(data.action || 'archive'); // Set initial action from database
//       } catch (error) {
//         console.error('Error fetching initial data:', error);
//       }
//     };
//     fetchPromptData();
//   }, []);

//   const handleToggle = async () => {
//     const newFeatureState = !isFeatureEnabled;
//     setIsFeatureEnabled(newFeatureState);

//     try {
//       const response = await fetch('/api/Rules/ColdEmail/ToggleEnabled', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ isEnabled: newFeatureState }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setMessage(`Failed to update feature state: ${errorData.message}`);
//         setIsFeatureEnabled(!newFeatureState); // Revert on error
//       }
//     } catch (error) {
//       console.error('Error updating feature state:', error);
//       setMessage('An error occurred while updating the feature state.');
//       setIsFeatureEnabled(!newFeatureState); // Revert on error
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       const response = await fetch('/api/Rules/ColdEmail/AddPrompt', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ promptText, isEnabled: isFeatureEnabled, action }), // Include action in API request
//       });

//       if (response.ok) {
//         setMessage('Prompt saved successfully!');
//       } else {
//         const errorData = await response.json();
//         setMessage(`Failed to save prompt: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error saving prompt:', error);
//       setMessage('An error occurred while saving the prompt.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <div className="ml-64 flex-1 p-6">
//         <h1 className="text-2xl font-semibold mb-6">Cold Email Blocker</h1>

//         {/* Feature Toggle */}
//         <div className="flex items-center mb-6">
//           <span className="text-lg font-semibold mr-4">Enable Cold Email Blocker</span>
//           <Switch
//             checked={isFeatureEnabled}
//             onChange={handleToggle} // Trigger the API call on toggle
//             className={`${isFeatureEnabled ? 'bg-green-500' : 'bg-gray-300'}
//               relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//           >
//             <span
//               className={`${
//                 isFeatureEnabled ? 'translate-x-6' : 'translate-x-1'
//               } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
//             />
//           </Switch>
//         </div>

//         {/* Prompt Section */}
//         <div className={`bg-white p-6 rounded-lg shadow-md space-y-4 ${!isFeatureEnabled ? 'opacity-50' : ''}`}>
//           <h2 className="text-xl font-semibold">Enter Your Preferences</h2>
//           <p className="text-gray-600">
//             Write a prompt for your AI Cold Email Blocker to follow. This will help personalize email blocking based on your preferences.
//           </p>

//           {/* Action Dropdown */}
//           <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2">Action</label>
//             <select
//               className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
//               value={action}
//               onChange={(e) => setAction(e.target.value)}
//               disabled={!isFeatureEnabled} // Disable when feature is off
//             >
//               <option value="archive">Archive</option>
//               <option value="delete">Delete</option>
//             </select>
//           </div>

//           {/* Text Area for Prompt */}
//           <textarea
//             className="w-full h-96 p-4 border bg-white border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//             placeholder="Enter your cold email detection criteria here..."
//             value={promptText}
//             onChange={(e) => setPromptText(e.target.value)}
//             disabled={!isFeatureEnabled} // Disable input when feature is off
//           />

//           {/* Buttons */}
//           <div className="flex space-x-4">
//             <button 
//               className="bg-black text-white px-4 py-2 rounded-lg border transition"
//               onClick={handleSave}
//               disabled={loading || !isFeatureEnabled} // Disable when feature is off
//             >
//               {loading ? 'Saving...' : 'Save'}
//             </button>
//             <button 
//               className="bg-white text-black px-4 py-2 rounded-lg border transition"
//               disabled={!isFeatureEnabled} // Disable when feature is off
//             >
//               AI Generate Prompt
//             </button>
//           </div>

//           {/* Message Display */}
//           {message && (
//             <p className="mt-4 text-sm text-gray-600">{message}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RulesPage;




















// 'use client';

// import React, { useState, useEffect } from 'react';
// import Sidebar from '../components/sidebar';
// import { Switch } from '@headlessui/react';
// import MailList from './components/MailList';

// const RulesPage = () => {
//   const [promptText, setPromptText] = useState('');
//   const [action, setAction] = useState('archive'); // Default action is 'archive'
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
//   const [blockedEmails, setBlockedEmails] = useState([]);

//   useEffect(() => {
//     const fetchPromptData = async () => {
//       try {
//         const response = await fetch('/api/Rules/ColdEmail/GetPrompt');
//         const data = await response.json();

//         // Set the state with data fetched from the API
//         setPromptText(data.prompt || '');
//         setIsFeatureEnabled(data.isEnabled || false);
//         setAction(data.action || 'archive'); // Use action from database or fallback to 'archive'
//       } catch (error) {
//         console.error('Error fetching initial data:', error);
//       }
//     };

//     const fetchBlockedEmails = async () => {
//       try {
//         const response = await fetch('/api/Rules/ColdEmail/GetBlockedEmails');
//         const emails = await response.json();
//         setBlockedEmails(emails);
//       } catch (error) {
//         console.error('Error fetching blocked emails:', error);
//       }
//     };

//     // Fetch data on initial render
//     fetchPromptData();
//     fetchBlockedEmails();
//   }, []);

//   const handleToggle = async () => {
//     const newFeatureState = !isFeatureEnabled;
//     setIsFeatureEnabled(newFeatureState);

//     try {
//       const response = await fetch('/api/Rules/ColdEmail/ToggleEnabled', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ isEnabled: newFeatureState }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setMessage(`Failed to update feature state: ${errorData.message}`);
//         setIsFeatureEnabled(!newFeatureState); // Revert on error
//       }
//     } catch (error) {
//       console.error('Error updating feature state:', error);
//       setMessage('An error occurred while updating the feature state.');
//       setIsFeatureEnabled(!newFeatureState); // Revert on error
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       const response = await fetch('/api/Rules/ColdEmail/AddPrompt', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ promptText, isEnabled: isFeatureEnabled, action }), // Include action in API request
//       });

//       if (response.ok) {
//         setMessage('Prompt saved successfully!');
//       } else {
//         const errorData = await response.json();
//         setMessage(`Failed to save prompt: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error saving prompt:', error);
//       setMessage('An error occurred while saving the prompt.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProcessEmails = async (selectedEmails) => {
//     if (selectedEmails.length === 0) {
//       alert('Please select emails to process.');
//       return;
//     }

//     try {
//       const response = await fetch('/api/Rules/ColdEmail/ProcessEmails', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ emails: selectedEmails, action }), // Use the current action from state
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setBlockedEmails((prev) =>
//           prev.filter((email) => !selectedEmails.includes(email.messageId))
//         );
//         setMessage(data.message || 'Emails processed successfully!');
//       } else {
//         const errorData = await response.json();
//         setMessage(`Failed to process emails: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error processing emails:', error);
//       setMessage('An error occurred while processing emails.');
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <div className="ml-64 overflow-auto flex-1 p-6">
//         <h1 className="text-2xl font-semibold mb-6">Cold Email Blocker</h1>

//         {/* Feature Toggle */}
//         <div className="flex items-center mb-6">
//           <span className="text-lg font-semibold mr-4">Enable Cold Email Blocker</span>
//           <Switch
//             checked={isFeatureEnabled}
//             onChange={handleToggle}
//             className={`${isFeatureEnabled ? 'bg-green-500' : 'bg-gray-300'
//               } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//           >
//             <span
//               className={`${isFeatureEnabled ? 'translate-x-6' : 'translate-x-1'
//                 } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
//             />
//           </Switch>
//         </div>

//         {/* Prompt Section */}
//         <div className={`bg-white p-6 w-[95%] rounded-lg shadow-md space-y-4 ${!isFeatureEnabled ? 'opacity-50' : ''}`}>
//           <h2 className="text-xl font-semibold">Enter Your Preferences</h2>
//           <p className="text-gray-600">
//             Write a prompt for your AI Cold Email Blocker to follow. This will help personalize email blocking based on your preferences.
//           </p>

//           {/* Action Dropdown */}
//           <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2">Action</label>
//             <select
//               className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
//               value={action} // Ensure the value is tied to the state
//               onChange={(e) => setAction(e.target.value)}
//               disabled={!isFeatureEnabled}
//             >
//               <option value="archive">Archive</option>
//               <option value="delete">Delete</option>
//             </select>
//           </div>

//           {/* Text Area for Prompt */}
//           <textarea
//             className="w-full h-96 p-4 border bg-white border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//             placeholder="Enter your cold email detection criteria here..."
//             value={promptText}
//             onChange={(e) => setPromptText(e.target.value)}
//             disabled={!isFeatureEnabled}
//           />

//           {/* Buttons */}
//           <div className="flex space-x-4">
//             <button
//               className="bg-black text-white px-4 py-2 rounded-lg border transition"
//               onClick={handleSave}
//               disabled={loading || !isFeatureEnabled}
//             >
//               {loading ? 'Saving...' : 'Save'}
//             </button>
//             <button className="bg-white text-black px-4 py-2 rounded-lg border transition" disabled={!isFeatureEnabled}>
//               AI Generate Prompt
//             </button>
//           </div>

//           {/* Message Display */}
//           {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
//         </div>

//         {/* Mail List */}
//         <MailList emails={blockedEmails} onProcess={handleProcessEmails} />
//       </div>
//     </div>
//   );
// };

// export default RulesPage;




















'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import { Switch } from '@headlessui/react';
import MailList from './components/MailList';
import { AlertTriangle } from 'lucide-react';

const RulesPage = () => {
  const [promptText, setPromptText] = useState('');
  const [action, setAction] = useState('archive');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
  const [blockedEmails, setBlockedEmails] = useState([]);

  useEffect(() => {
    const fetchPromptData = async () => {
      try {
        const response = await fetch('/api/Rules/ColdEmail/GetPrompt');
        const data = await response.json();
        setPromptText(data.prompt || '');
        setIsFeatureEnabled(data.isEnabled || false);
        setAction(data.action || 'archive');
      } catch (error) {
        console.error('Error fetching initial data:', error);
        showMessage('Error fetching data', 'error');
      }
    };

    const fetchBlockedEmails = async () => {
      try {
        const response = await fetch('/api/Rules/ColdEmail/GetBlockedEmails');
        const emails = await response.json();
        setBlockedEmails(emails);
      } catch (error) {
        console.error('Error fetching blocked emails:', error);
        showMessage('Error fetching blocked emails', 'error');
      }
    };

    fetchPromptData();
    fetchBlockedEmails();
  }, []);

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleToggle = async () => {
    const newFeatureState = !isFeatureEnabled;
    setIsFeatureEnabled(newFeatureState);

    try {
      const response = await fetch('/api/Rules/ColdEmail/ToggleEnabled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: newFeatureState }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showMessage(`Failed to update feature state: ${errorData.message}`, 'error');
        setIsFeatureEnabled(!newFeatureState);
      }
    } catch (error) {
      console.error('Error updating feature state:', error);
      showMessage('An error occurred while updating the feature state.', 'error');
      setIsFeatureEnabled(!newFeatureState);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/Rules/ColdEmail/AddPrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, isEnabled: isFeatureEnabled, action }),
      });

      if (response.ok) {
        showMessage('Prompt saved successfully!', 'success');
      } else {
        const errorData = await response.json();
        showMessage(`Failed to save prompt: ${errorData.message}`, 'error');
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      showMessage('An error occurred while saving the prompt.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEmails = async (selectedEmails) => {
    if (selectedEmails.length === 0) {
      showMessage('Please select emails to process.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/Rules/ColdEmail/ProcessEmails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: selectedEmails, action }),
      });

      if (response.ok) {
        const data = await response.json();
        setBlockedEmails((prev) =>
          prev.filter((email) => !selectedEmails.includes(email.messageId))
        );
        showMessage(data.message || 'Emails processed successfully!', 'success');
      } else {
        const errorData = await response.json();
        showMessage(`Failed to process emails: ${errorData.message}`, 'error');
      }
    } catch (error) {
      console.error('Error processing emails:', error);
      showMessage('An error occurred while processing emails.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Cold Email Blocker</h1>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                {isFeatureEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch
                checked={isFeatureEnabled}
                onChange={handleToggle}
                className={`${
                  isFeatureEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Enable Cold Email Blocker</span>
                <span
                  className={`${
                    isFeatureEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-opacity duration-200 ${
            !isFeatureEnabled ? 'opacity-50' : ''
          }`}>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Configure Preferences</h2>
              <p className="text-gray-600 mb-6">
                Customize how the AI handles cold emails by setting your preferences below.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action on Detection
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    disabled={!isFeatureEnabled}
                  >
                    <option value="archive">Archive Email</option>
                    <option value="delete">Delete Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detection Criteria
                  </label>
                  <textarea
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
                    placeholder="Enter your criteria for detecting cold emails..."
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    disabled={!isFeatureEnabled}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      loading || !isFeatureEnabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    }`}
                    onClick={handleSave}
                    disabled={loading || !isFeatureEnabled}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    className={`px-6 py-2 rounded-lg font-medium border transition-all ${
                      !isFeatureEnabled
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                    disabled={!isFeatureEnabled}
                  >
                    Generate with AI
                  </button>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg flex items-center space-x-2 ${
                    messageType === 'error' 
                      ? 'bg-red-50 text-red-700' 
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {messageType === 'error' && <AlertTriangle className="h-5 w-5" />}
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <MailList emails={blockedEmails} onProcess={handleProcessEmails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;