// 'use client';

// import React, { useEffect, useState } from 'react';
// import Sidebar from '../components/sidebar';

// const RulesPage = () => {
//   const [newsletters, setNewsletters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [scanning, setScanning] = useState(false);

//   const fetchNewsletters = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/ai/email/getUnsubscribe', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setNewsletters(
//           data.newsletters.map((item) => ({
//             senderName: item.senderName || 'Unknown Sender',
//             senderEmail: item.senderEmail || 'Unknown Email',
//             count: item.count || 0,
//           }))
//         );
//       } else {
//         console.error('Failed to fetch newsletters');
//       }
//     } catch (error) {
//       console.error('Error fetching newsletters:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scanNewsletters = async () => {
//     setScanning(true);
//     try {
//       const response = await fetch('/api/ai/email/unsubscribeScan', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Scanning completed:', data);
//         fetchNewsletters();
//       } else {
//         console.error('Failed to scan newsletters');
//       }
//     } catch (error) {
//       console.error('Error scanning newsletters:', error);
//     } finally {
//       setScanning(false);
//     }
//   };

//   useEffect(() => {
//     fetchNewsletters();
//   }, []);

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col h-screen overflow-hidden">
//         {/* Header Section */}
//         <div className="p-4 bg-white shadow-md border-b">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800">Your Newsletters</h2>
//               <p className="text-sm text-gray-600">
//                 Manage your email subscriptions. Unsubscribe or view emails in more detail.
//               </p>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded hover:bg-gray-600 transition"
//                 onClick={scanNewsletters}
//                 disabled={scanning}
//               >
//                 {scanning ? 'Scanning...' : 'Get Newsletters'}
//               </button>
//               <button
//                 className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition"
//                 onClick={fetchNewsletters}
//                 disabled={loading}
//               >
//                 {loading ? 'Loading...' : 'Refresh Newsletters'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="flex-1 overflow-y-auto p-4">
//           <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//             <table className="min-w-full text-sm text-left text-gray-500">
//               <thead className="bg-gray-100 text-gray-700 text-xs uppercase font-medium">
//                 <tr>
//                   <th className="px-6 py-3">Newsletter</th>
//                   <th className="px-6 py-3">Emails</th>
//                   <th className="px-6 py-3">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {newsletters.length > 0 ? (
//                   newsletters.map((item, index) => (
//                     <tr
//                       key={index}
//                       className="border-b hover:bg-gray-50 transition duration-200"
//                     >
//                       <td className="px-6 py-4">
//                         <div>
//                           <p className="font-medium text-gray-800">{item.senderName}</p>
//                           <p className="text-xs text-gray-500">{item.senderEmail}</p>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">{item.count}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex space-x-2">
//                           <button className="px-3 py-1 text-white bg-gray-700 rounded hover:bg-gray-600 transition">
//                             Unsubscribe
//                           </button>
//                           <button className="px-3 py-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition">
//                             View Details
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="3"
//                       className="px-6 py-4 text-center text-gray-500"
//                     >
//                       No newsletters to display. Click "Get Newsletters" to scan emails or "Refresh
//                       Newsletters" to reload saved data.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RulesPage;












// 'use client';

// import React, { useEffect, useState } from 'react';
// import Sidebar from '../components/sidebar';

// const RulesPage = () => {
//   const [newsletters, setNewsletters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [scanning, setScanning] = useState(false);
//   const [unsubscribing, setUnsubscribing] = useState({});
//   const [popupData, setPopupData] = useState(null); // Data for the popup
//   const [action, setAction] = useState('markAsRead'); // Default action

//   const fetchNewsletters = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/ai/email/getUnsubscribe', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setNewsletters(
//           data.newsletters.map((item) => ({
//             senderName: item.senderName || 'Unknown Sender',
//             senderEmail: item.senderEmail || 'Unknown Email',
//             emailIds: item.emailIds || [],
//             count: item.count || 0,
//           }))
//         );
//       } else {
//         console.error('Failed to fetch newsletters');
//       }
//     } catch (error) {
//       console.error('Error fetching newsletters:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scanNewsletters = async () => {
//     setScanning(true);
//     try {
//       const response = await fetch('/api/ai/email/unsubscribeScan', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Scanning completed:', data);
//         fetchNewsletters();
//       } else {
//         console.error('Failed to scan newsletters');
//       }
//     } catch (error) {
//       console.error('Error scanning newsletters:', error);
//     } finally {
//       setScanning(false);
//     }
//   };

//   const handleUnsubscribe = async (emailId) => {
//     setUnsubscribing((prev) => ({ ...prev, [emailId]: true })); // Mark as unsubscribing
//     try {
//       const response = await fetch('/api/ai/email/UnsubscribeMail', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ emailId, action }), // Include selected action
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Unsubscribe response:', data);

//         // Update the newsletters list
//         setNewsletters(data.updatedNewsletters);
//       } else {
//         console.error('Failed to unsubscribe');
//       }
//     } catch (error) {
//       console.error('Error during unsubscribe:', error);
//     } finally {
//       setUnsubscribing((prev) => ({ ...prev, [emailId]: false })); // Mark as unsubscribed
//       setPopupData(null); // Close the popup
//     }
//   };

//   const openPopup = (newsletter) => {
//     setPopupData(newsletter);
//   };

//   const closePopup = () => {
//     setPopupData(null);
//   };

//   useEffect(() => {
//     fetchNewsletters();
//   }, []);

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col h-screen overflow-hidden">
//         <div className="p-4 bg-white shadow-md border-b">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-gray-800">Your Newsletters</h2>
//             <div className="flex space-x-2">
//               <button
//                 className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
//                 onClick={scanNewsletters}
//                 disabled={scanning}
//               >
//                 {scanning ? 'Scanning...' : 'Get Newsletters'}
//               </button>
//               <button
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
//                 onClick={fetchNewsletters}
//                 disabled={loading}
//               >
//                 {loading ? 'Loading...' : 'Refresh'}
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto p-4">
//           <table className="min-w-full bg-white shadow-md rounded-lg text-sm">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="px-6 py-3">Newsletter</th>
//                 <th className="px-6 py-3">Emails</th>
//                 <th className="px-6 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Array.isArray(newsletters) && newsletters.length > 0 ? (
//                 newsletters.map((item, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="font-medium">{item.senderName}</p>
//                         <p className="text-xs text-gray-500">{item.senderEmail}</p>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">{item.count}</td>
//                     <td className="px-6 py-4">
//                       <button
//                         className="px-3 py-1 text-white bg-gray-700 rounded hover:bg-gray-600"
//                         onClick={() => openPopup(item)}
//                         disabled={unsubscribing[item.emailIds[0]]}
//                       >
//                         {unsubscribing[item.emailIds[0]] ? 'Processing...' : 'Unsubscribe'}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
//                     No newsletters found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>

//           </table>
//         </div>
//       </div>

//       {popupData && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white w-96 rounded-lg p-6 shadow-lg relative">
//             {/* Close Button */}
//             <button
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//               onClick={closePopup}
//             >
//               ✕
//             </button>

//             {/* Popup Header */}
//             <h3 className="text-lg font-extrabold text-gray-800 mb-4">
//               Unsubscribe Confirmation
//             </h3>

//             {/* Popup Body */}
//             <p className="text-sm text-gray-600 mb-4">
//               Are you sure you want to unsubscribe from{' '}
//               <span className="font-semibold text-gray-900">{popupData.senderName}</span>?
//             </p>

//             {/* Dropdown for Email Action */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Choose an action for existing emails:
//               </label>
//               <select
//                 className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
//                 value={action}
//                 onChange={(e) => setAction(e.target.value)}
//               >
//                 <option value="markAsRead">Mark as Read</option>
//                 <option value="delete">Delete</option>
//                 <option value="archive">Archive</option>
//               </select>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-6 flex justify-end space-x-3">

//               <button
//                 className="px-4 py-2 text-sm font-medium text-black border bg-white rounded-md "
//                 onClick={() => handleUnsubscribe(popupData.emailIds[0])}
//               >
//                 Unsubscribe
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default RulesPage;








'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { Mail, RefreshCw, Search, X, Loader2, AlertCircle } from 'lucide-react';

const RulesPage = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState({});
  const [popupData, setPopupData] = useState(null);
  const [action, setAction] = useState('markAsRead');

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/email/getUnsubscribe');
      if (response.ok) {
        const data = await response.json();
        setNewsletters(
          data.newsletters.map((item) => ({
            senderName: item.senderName || 'Unknown Sender',
            senderEmail: item.senderEmail || 'Unknown Email',
            emailIds: item.emailIds || [],
            count: item.count || 0,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const scanNewsletters = async () => {
    setScanning(true);
    try {
      const response = await fetch('/api/ai/email/unsubscribeScan', {
        method: 'POST',
      });
      if (response.ok) {
        await fetchNewsletters();
      }
    } catch (error) {
      console.error('Error scanning newsletters:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleUnsubscribe = async (emailId) => {
    setUnsubscribing((prev) => ({ ...prev, [emailId]: true }));
    try {
      const response = await fetch('/api/ai/email/UnsubscribeMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId, action }),
      });
      if (response.ok) {
        const data = await response.json();
        setNewsletters(data.updatedNewsletters);
      }
    } catch (error) {
      console.error('Error during unsubscribe:', error);
    } finally {
      setUnsubscribing((prev) => ({ ...prev, [emailId]: false }));
      setPopupData(null);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white">
        <Sidebar />
      </div>

      <div className="ml-64 flex-1 flex flex-col">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-gray-700" />
                <h1 className="text-3xl font-bold text-gray-900">Newsletter Manager</h1>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                    scanning
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                  }`}
                  onClick={scanNewsletters}
                  disabled={scanning}
                >
                  {scanning ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  <span>{scanning ? 'Scanning...' : 'Scan Newsletters'}</span>
                </button>

                <button
                  className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                    loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                  onClick={fetchNewsletters}
                  disabled={loading}
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Newsletter
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Received Emails
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {newsletters.length > 0 ? (
                      newsletters.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {item.senderName}
                              </span>
                              <span className="text-sm text-gray-500">{item.senderEmail}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.count} emails
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                unsubscribing[item.emailIds[0]]
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                              onClick={() => setPopupData(item)}
                              disabled={unsubscribing[item.emailIds[0]]}
                            >
                              {unsubscribing[item.emailIds[0]] ? (
                                <span className="flex items-center space-x-1">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Processing...</span>
                                </span>
                              ) : (
                                'Unsubscribe'
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center">
                          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 text-sm">No newsletters found</p>
                          <p className="text-gray-400 text-xs mt-1">
                            Click "Scan Newsletters" to find your subscriptions
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {popupData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white w-[448px] rounded-xl shadow-lg p-6 relative">
            <button
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setPopupData(null)}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Unsubscribe
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                You're about to unsubscribe from <span className="font-medium text-gray-900">{popupData.senderName}</span>. This will prevent future emails from this sender.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to do with existing emails?
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                >
                  <option value="markAsRead">Mark as Read</option>
                  <option value="delete">Delete All</option>
                  <option value="archive">Archive All</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
                  onClick={() => setPopupData(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  onClick={() => handleUnsubscribe(popupData.emailIds[0])}
                >
                  Unsubscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesPage;