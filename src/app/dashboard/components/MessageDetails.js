// src/app/dashboard/components/MessageDetails.js
const MessageDetails = ({ selectedMessage, handleCloseMessage, deleteMessage }) => {
  if (!selectedMessage) {
    return (
      <div className="flex-grow bg-gray-100 p-4 text-black h-full">
        No message selected
      </div>
    );
  }

  return (
    <div className="flex-grow bg-gray-100 p-4 text-black overflow-y-auto max-h-full">
      <button className="text-red-500 mb-4" onClick={handleCloseMessage}>
        Close
      </button>
      <h2 className="text-xl text-black font-bold">{selectedMessage.subject}</h2>
      <p className="text-sm text-gray-600">From: {selectedMessage.from}</p>
      <p className="mt-2 text-black whitespace-pre-wrap">
        {selectedMessage.body}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Sent on: {new Date(selectedMessage.timestamp).toLocaleString()}
      </p>
      <div className="mt-4 space-x-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Reply</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Forward</button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => deleteMessage(selectedMessage._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MessageDetails;
