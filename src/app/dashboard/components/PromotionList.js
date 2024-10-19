const PromotionList = ({
    promotions,
    toggleReadStatus,
    deleteMessage,
    handleOpenMessage,
  }) => {
    // Helper function to extract the sender's name
    const getSenderName = (fromField) => {
      const match = fromField.match(/(.*?)(?=\s<)/); // Regex to capture text before "<"
      return match ? match[0] : fromField; // Return the captured group, or the whole field if no match
    };
  
    return (
      <div className="w-full bg-white p-4 border-r overflow-y-auto h-screen max-h-screen">
        <div className="space-y-4">
          {promotions.length > 0 ? (
            promotions.map((message) => (
              <div
                key={message._id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-200 ${
                  message.isRead ? 'bg-gray-100' : 'bg-white'
                }`}
                onClick={() => handleOpenMessage(message)}
              >
                <h3 className={`font-bold ${message.isRead ? 'text-gray-500' : 'text-black'}`}>
                  {getSenderName(message.from)} {/* Extract sender name */}
                </h3>
                <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                <p className="mt-1 text-sm text-gray-700 truncate">
                  {message.snippet} {/* Showing the snippet for better preview */}
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReadStatus(message._id, message.isRead, message.gmailMessageId); // Include Gmail message ID
                    }}
                  >
                    Mark as {message.isRead ? 'Unread' : 'Read'}
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message._id, message.gmailMessageId); // Include Gmail message ID
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No messages in your promotions.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default PromotionList;
  