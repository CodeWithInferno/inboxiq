const InboxList = ({
  inbox,
  toggleReadStatus,
  deleteMessage,
  handleOpenMessage,
  handleCompose,
}) => {
  const getSenderName = (fromField) => {
    const match = fromField.match(/(.*?)(?=\s<)/);
    return match ? match[0] : fromField;
  };

  return (
    <div className="w-full bg-white p-6 border-r overflow-y-auto h-screen max-h-screen">
      <button
        className="bg-blue-600 text-white px-4 py-3 rounded mb-6 w-full hover:bg-blue-500 transition-all"
        onClick={handleCompose}
      >
        Compose
      </button>
      <div className="space-y-6">
        {inbox.length > 0 ? (
          inbox.map((message) => (
            <div
              key={message._id}
              className="p-4 border-b cursor-pointer hover:bg-gray-100 transition-all"
              onClick={() => handleOpenMessage(message)}
            >
              <h3 className={`font-bold ${message.isRead ? 'text-gray-500' : 'text-black'}`}>
                {getSenderName(message.from)}
              </h3>
              <p className="text-sm text-gray-600 truncate">{message.subject}</p>
              <p className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-gray-700 truncate">{message.snippet}</p>
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
