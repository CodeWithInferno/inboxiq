import { useEffect, useRef } from 'react';

const MessageDetails = ({ selectedMessage, handleCloseMessage, deleteMessage }) => {
  const messageBodyRef = useRef(null);

  useEffect(() => {
    if (selectedMessage && messageBodyRef.current) {
      messageBodyRef.current.innerHTML = selectedMessage.body;
    }
  }, [selectedMessage]);

  if (!selectedMessage) {
    return (
      <div className="flex-grow bg-gray-100 p-4 text-black min-h-screen">
        No message selected
      </div>
    );
  }

  return (
    <div className=" bg-gray-100 p-6 text-black overflow-y-auto w-[99%] max-h-full">
      <button className="text-red-500 mb-4 font-bold" onClick={handleCloseMessage}>
        &larr; Go Back to Inbox
      </button>
      <div className="max-w-[%] mx-auto bg-white p-4 border rounded shadow-md"> {/* Limit width of content */}
        <h2 className="text-2xl text-black font-bold">{selectedMessage.subject}</h2>
        <p className="text-md text-gray-600 mb-2">From: {selectedMessage.from}</p>
        <p className="text-xs text-gray-500 mb-4">
          Sent on: {new Date(selectedMessage.timestamp).toLocaleString()}
        </p>

        <div
          ref={messageBodyRef}
          className="p-4 bg-white border rounded shadow-md max-w-full"
          style={{ overflowWrap: 'break-word', backgroundColor: '#fafafa' }}
        ></div>

        <div className="mt-6 space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
            Reply
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
            Forward
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
            onClick={() => deleteMessage(selectedMessage._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetails;
