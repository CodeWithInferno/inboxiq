// const InboxList = ({
//     inbox,
//     toggleReadStatus,
//     deleteMessage,
//     handleOpenMessage,
//     handleCompose,
//   }) => {
//     // Helper function to extract the sender's name and remove "<>" symbols
//     const getSenderName = (fromField) => {
//       const emailRegex = /<(.*?)>/;
//       const match = fromField.match(emailRegex);
//       return match ? fromField.replace(emailRegex, '').trim() : fromField;
//     };
  
//     return (
//       <div className="w-full bg-white p-4 border-r overflow-y-auto h-screen max-h-screen"> {/* Full width for the Inbox */}
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
//           onClick={handleCompose}
//         >
//           Compose
//         </button>
//         <div className="space-y-4">
//           {inbox.length > 0 ? (
//             inbox.map((message) => (
//               <div
//                 key={message.id}
//                 className={`p-4 border-b cursor-pointer hover:bg-gray-200 ${message.isRead ? 'bg-gray-100' : 'bg-white'}`}
//                 onClick={() => handleOpenMessage(message)}
//               >
//                 <h3 className={`font-bold text-black`}>
//                   {getSenderName(message.from)} {/* Cleaned sender name */}
//                 </h3>
//                 <p className="text-sm text-gray-600 truncate">{message.subject}</p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(message.timestamp).toLocaleString()}
//                 </p>
//                 <p className="mt-1 text-sm text-gray-700 truncate">
//                   {message.body ? message.body.slice(0, 100) : '...'} {/* Truncated snippet */}
//                 </p>
//                 <div className="mt-2 space-x-2">
//                   <button
//                     className="text-blue-500 hover:text-blue-700"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleReadStatus(message.id, message.isRead, message.gmailMessageId); // Include Gmail message ID
//                     }}
//                   >
//                     Mark as {message.isRead ? 'Unread' : 'Read'}
//                   </button>
//                   <button
//                     className="text-red-500 hover:text-red-700"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteMessage(message.id, message.gmailMessageId); // Include Gmail message ID
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No messages in your inbox.</p>
//           )}
//         </div>
//       </div>
//     );
//   };
  
//   export default InboxList;
  



const SocialList = ({
    inbox,
    toggleReadStatus,
    deleteMessage,
    handleOpenMessage,
    handleCompose,
  }) => {
  
    const getSenderName = (fromField) => {
        // Match the part before <email@example.com>
        const match = fromField.match(/(.*?)(?=\s<)/); 
        return match ? match[0].trim() : fromField.replace(/<.*?>/g, '').trim(); // Clean email part if needed
      };
      
  
    return (
      <div className="w-full bg-white p-4 border-r overflow-y-auto h-screen max-h-screen"> {/* Full width for the Inbox */}
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
                className={`p-4 border-b cursor-pointer hover:bg-gray-200 ${message.isRead ? 'bg-gray-100' : 'bg-white'}`}
                onClick={() => handleOpenMessage(message)}
              >
                <h3 className={`font-bold ${message.isRead ? 'text-gray-500' : 'text-black'}`}>
                  {getSenderName(message.from)} {/* Extract sender name */}
                </h3>
                <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                <p className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
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
            <p>No messages in your inbox.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default SocialList;
  