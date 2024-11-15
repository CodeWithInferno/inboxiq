'use client';

import React, { useState } from 'react';

const MailList = ({ emails, onProcess }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);

  const handleSelectEmail = (messageId) => {
    setSelectedEmails((prevSelected) =>
      prevSelected.includes(messageId)
        ? prevSelected.filter((id) => id !== messageId) // Deselect email
        : [...prevSelected, messageId] // Select email
    );
  };

  const isSelected = (messageId) => selectedEmails.includes(messageId);

  const handleProcessEmails = () => {
    if (selectedEmails.length === 0) {
      alert('Please select emails to process.');
      return;
    }
    onProcess(selectedEmails); // Call the function passed from RulesPage
  };

  return (
    <div className="mt-6 bg-gray-100 p-6 w-full rounded-lg shadow-md">
      <h3 className="font-semibold mb-4 text-lg">Blocked Emails</h3>
      {emails.length === 0 ? (
        <p className="text-gray-600">No blocked emails found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedEmails(
                        e.target.checked ? emails.map((email) => email.messageId) : []
                      )
                    }
                    checked={selectedEmails.length === emails.length && emails.length > 0}
                  />
                </th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Preview</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr
                  key={email.messageId}
                  className={`border-b border-gray-300 ${
                    isSelected(email.messageId) ? 'bg-gray-100' : ''
                  } hover:bg-gray-50`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected(email.messageId)}
                      onChange={() => handleSelectEmail(email.messageId)}
                    />
                  </td>
                  <td className="p-3 truncate max-w-[200px]">{email.subject || '(No Subject)'}</td>
                  <td className="p-3 truncate max-w-[300px]">{email.snippet || 'No preview available'}</td>
                  <td className="p-3 truncate max-w-[150px]">
                    {new Date(email.createdAt).toLocaleString() || 'Unknown Time'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedEmails.length > 0 && (
        <div className="mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={handleProcessEmails}
          >
            Process Selected Emails ({selectedEmails.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default MailList;
