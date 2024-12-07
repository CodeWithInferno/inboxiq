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












'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';

const RulesPage = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState({});
  const [popupData, setPopupData] = useState(null); // Data for the popup
  const [action, setAction] = useState('markAsRead'); // Default action

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/email/getUnsubscribe', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
      } else {
        console.error('Failed to fetch newsletters');
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
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Scanning completed:', data);
        fetchNewsletters();
      } else {
        console.error('Failed to scan newsletters');
      }
    } catch (error) {
      console.error('Error scanning newsletters:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleUnsubscribe = async (emailId) => {
    setUnsubscribing((prev) => ({ ...prev, [emailId]: true })); // Mark as unsubscribing
    try {
      const response = await fetch('/api/ai/email/UnsubscribeMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId, action }), // Include selected action
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Unsubscribe response:', data);

        // Update the newsletters list
        setNewsletters(data.updatedNewsletters);
      } else {
        console.error('Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Error during unsubscribe:', error);
    } finally {
      setUnsubscribing((prev) => ({ ...prev, [emailId]: false })); // Mark as unsubscribed
      setPopupData(null); // Close the popup
    }
  };

  const openPopup = (newsletter) => {
    setPopupData(newsletter);
  };

  const closePopup = () => {
    setPopupData(null);
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-4 bg-white shadow-md border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Your Newsletters</h2>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                onClick={scanNewsletters}
                disabled={scanning}
              >
                {scanning ? 'Scanning...' : 'Get Newsletters'}
              </button>
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                onClick={fetchNewsletters}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <table className="min-w-full bg-white shadow-md rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3">Newsletter</th>
                <th className="px-6 py-3">Emails</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(newsletters) && newsletters.length > 0 ? (
                newsletters.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{item.senderName}</p>
                        <p className="text-xs text-gray-500">{item.senderEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.count}</td>
                    <td className="px-6 py-4">
                      <button
                        className="px-3 py-1 text-white bg-gray-700 rounded hover:bg-gray-600"
                        onClick={() => openPopup(item)}
                        disabled={unsubscribing[item.emailIds[0]]}
                      >
                        {unsubscribing[item.emailIds[0]] ? 'Processing...' : 'Unsubscribe'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No newsletters found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {popupData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 rounded-lg p-6 shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closePopup}
            >
              ✕
            </button>

            {/* Popup Header */}
            <h3 className="text-lg font-extrabold text-gray-800 mb-4">
              Unsubscribe Confirmation
            </h3>

            {/* Popup Body */}
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to unsubscribe from{' '}
              <span className="font-semibold text-gray-900">{popupData.senderName}</span>?
            </p>

            {/* Dropdown for Email Action */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose an action for existing emails:
              </label>
              <select
                className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="markAsRead">Mark as Read</option>
                <option value="delete">Delete</option>
                <option value="archive">Archive</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">

              <button
                className="px-4 py-2 text-sm font-medium text-black border bg-white rounded-md "
                onClick={() => handleUnsubscribe(popupData.emailIds[0])}
              >
                Unsubscribe
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RulesPage;
