import React from 'react';

const ThreadDetails = ({ selectedThread, handleCloseThread }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Top Bar with Back Button and Thread Info */}
      <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0 z-10 p-4">
        <div className="flex items-center space-x-4">
          <button className="text-blue-500 hover:text-blue-700" onClick={handleCloseThread}>
            &larr; Back
          </button>
          <h2 className="font-semibold text-lg">{selectedThread.messages[0].subject || '(No Subject)'}</h2>
        </div>
      </div>

      {/* Thread Messages */}
      <div className="flex-grow">
        {selectedThread.messages.map((message, index) => (
          <div key={message.id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">From: {message.from}</p>
            <p className="text-sm text-gray-500">Date: {new Date(message.timestamp).toLocaleString()}</p>
            <div className="mt-2">
              <p className="font-semibold">{message.subject}</p>
              <div dangerouslySetInnerHTML={{ __html: message.body }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreadDetails;
