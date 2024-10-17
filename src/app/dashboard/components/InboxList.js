// src/app/dashboard/components/InboxList.js
const InboxList = ({
  inbox,
  toggleReadStatus,
  deleteMessage,
  handleOpenMessage,
  handleCompose,
}) => {
  return (
    <div className="w-full sm:w-2/5 lg:w-1/3 bg-white p-4 border-r overflow-y-auto">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
        onClick={handleCompose}
      >
        Compose
      </button>
      <div className="space-y-4">
        {inbox.length > 0 ? (
          inbox.map((message) => (
            <div
              key={message._id}
              className="p-4 border-b cursor-pointer hover:bg-gray-200"
              onClick={() => handleOpenMessage(message)}
            >
              <h3 className={`font-bold ${message.isRead ? 'text-gray-500' : 'text-black'}`}>
                {message.subject}
              </h3>
              <p className="text-sm text-gray-600 truncate">From: {message.from}</p>
              <p className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </p>
              <div className="mt-2 space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReadStatus(message._id, message.isRead);
                  }}
                >
                  Mark as {message.isRead ? 'Unread' : 'Read'}
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMessage(message._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No messages in your inbox.</p>
        )}
      </div>
    </div>
  );
};

export default InboxList;
