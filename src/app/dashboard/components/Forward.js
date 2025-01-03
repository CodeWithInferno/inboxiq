import React, { useState, useEffect, useRef } from 'react';

const Forward = ({ isOpen, onClose, selectedMessage }) => {
  const [recipient, setRecipient] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && selectedMessage) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(selectedMessage.body || '<p>No email body content found</p>');
      iframeDoc.close();
    }
  }, [selectedMessage]);

  if (!isOpen) return null;

  const handleSend = () => {
    // Logic to forward the email goes here
    console.log('Forwarding email to:', recipient);
    console.log('Email content:', selectedMessage);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-[600px] h-{600px] flex flex-col">
        <h2 className="text-lg font-semibold mb-4 text-center">Forward Email</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Recipients</label>
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient email"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
          />
        </div>

        <div className="mb-4 border-t pt-4 overflow-y-auto flex-grow">
          <p className="text-sm text-gray-600">---------- Forwarded message ---------</p>
          <p className="text-sm text-gray-600">From: {selectedMessage.from}</p>
          <p className="text-sm text-gray-600">
            Date: {new Date(parseInt(selectedMessage.timestamp)).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Subject: {selectedMessage.subject}</p>
          <p className="text-sm text-gray-600">To: {selectedMessage.to || 'N/A'}</p>
          <iframe
            ref={iframeRef}
            title="Forwarded Email Content"
            className="w-full h-[250px] border mt-2"
          ></iframe>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forward;




















