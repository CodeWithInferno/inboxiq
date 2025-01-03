// 'use client';

// import React, { useState } from 'react';

// const MailList = ({ emails, onProcess }) => {
//   const [selectedEmails, setSelectedEmails] = useState([]);

//   const handleSelectEmail = (messageId) => {
//     setSelectedEmails((prevSelected) =>
//       prevSelected.includes(messageId)
//         ? prevSelected.filter((id) => id !== messageId) // Deselect email
//         : [...prevSelected, messageId] // Select email
//     );
//   };

//   const isSelected = (messageId) => selectedEmails.includes(messageId);

//   const handleProcessEmails = () => {
//     if (selectedEmails.length === 0) {
//       alert('Please select emails to process.');
//       return;
//     }
//     onProcess(selectedEmails); // Call the function passed from RulesPage
//   };

//   return (
//     <div className="mt-6 bg-gray-100 p-6 w-full rounded-lg shadow-md">
//       <h3 className="font-semibold mb-4 text-lg">Blocked Emails</h3>
//       {emails.length === 0 ? (
//         <p className="text-gray-600">No blocked emails found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full table-auto border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="p-3 text-left">
//                   <input
//                     type="checkbox"
//                     onChange={(e) =>
//                       setSelectedEmails(
//                         e.target.checked ? emails.map((email) => email.messageId) : []
//                       )
//                     }
//                     checked={selectedEmails.length === emails.length && emails.length > 0}
//                   />
//                 </th>
//                 <th className="p-3 text-left">Subject</th>
//                 <th className="p-3 text-left">Preview</th>
//                 <th className="p-3 text-left">Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {emails.map((email) => (
//                 <tr
//                   key={email.messageId}
//                   className={`border-b border-gray-300 ${isSelected(email.messageId) ? 'bg-gray-100' : ''
//                     } hover:bg-gray-50`}
//                 >
//                   <td className="p-3 text-center">
//                     <input
//                       type="checkbox"
//                       checked={isSelected(email.messageId)}
//                       onChange={() => handleSelectEmail(email.messageId)}
//                     />
//                   </td>
//                   <td className="p-3 truncate max-w-[200px]">{email.subject || '(No Subject)'}</td>
//                   <td className="p-3 truncate max-w-[300px]">{email.snippet || 'No preview available'}</td>
//                   <td className="p-3 truncate max-w-[150px]">
//                     {new Date(email.createdAt).toLocaleString() || 'Unknown Time'}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {selectedEmails.length > 0 && (
//         <div className="mt-4">
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
//             onClick={handleProcessEmails}
//           >
//             Process Selected Emails ({selectedEmails.length})
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MailList;








'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, Mail, Clock } from 'lucide-react';

const MailList = ({ emails, onProcess }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleSelectEmail = (messageId) => {
    setSelectedEmails((prevSelected) =>
      prevSelected.includes(messageId)
        ? prevSelected.filter((id) => id !== messageId)
        : [...prevSelected, messageId]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedEmails(checked ? emails.map((email) => email.messageId) : []);
  };

  const isSelected = (messageId) => selectedEmails.includes(messageId);

  const handleProcessEmails = () => {
    if (selectedEmails.length === 0) {
      alert('Please select emails to process.');
      return;
    }
    onProcess(selectedEmails);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Blocked Emails</h3>
          </div>
          {selectedEmails.length > 0 && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              onClick={handleProcessEmails}
            >
              <span>Process Selected ({selectedEmails.length})</span>
            </button>
          )}
        </div>

        {emails.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No blocked emails found</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleSelectAll(selectedEmails.length !== emails.length)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {selectedEmails.length === emails.length ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emails.map((email) => (
                  <tr
                    key={email.messageId}
                    className={`${
                      isSelected(email.messageId) ? 'bg-blue-50' : 'hover:bg-gray-50'
                    } transition-colors cursor-pointer`}
                    onClick={() => handleSelectEmail(email.messageId)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {isSelected(email.messageId) ? (
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {email.subject || '(No Subject)'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-[300px]">
                        {email.snippet || 'No preview available'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(email.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailList;