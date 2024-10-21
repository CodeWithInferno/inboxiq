// import React, { useEffect, useRef } from 'react';

// const MessageDetails = ({ selectedMessage, handleCloseMessage }) => {
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     if (iframeRef.current && selectedMessage) {
//       const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
//       iframeDoc.open();
//       iframeDoc.write(selectedMessage.body);  // Write the HTML email content inside the iframe
//       iframeDoc.close();
//     }
//   }, [selectedMessage]);

//   if (!selectedMessage) return null;

//   // Helper function to format the email sending date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Top Bar with Back Button and Email Info */}
//       <div className="flex items-center justify-between border-b-2 pb-4 mb-4">
//         <div className="flex items-center space-x-4">
//           <button className="text-blue-500 hover:text-blue-700" onClick={handleCloseMessage}>
//             &larr; Back
//           </button>
//           <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
//         </div>
//       </div>

//       {/* Email Header with Sender's Info */}
//       <div className="flex items-center justify-between mb-4 p-4">
//         {/* Sender's Avatar and Info */}
//         <div className="flex items-center space-x-4">
//           <img
//             src="https://www.gravatar.com/avatar/placeholder.png?d=mp&f=y"  // Placeholder avatar
//             alt="Sender Avatar"
//             className="w-10 h-10 rounded-full"
//           />
//           <div>
//             <p className="font-semibold text-gray-900">{selectedMessage.fromName || 'Unknown Sender'}</p>
//             <p className="text-gray-600 text-sm">{selectedMessage.from}</p>
//           </div>
//         </div>

//         {/* Sent Date and Time */}
//         <div className="text-right">
//           <p className="text-gray-600 text-sm">{formatDate(selectedMessage.date)}</p>
//         </div>
//       </div>
//         <iframe
//           ref={iframeRef}
//           title="Email Content"
//           className="w-full h-full "
//         />


//       {/* Footer with Last updated and Close button */}
//       <div className="mt-4 flex justify-between items-center text-gray-600">
//         <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
//         <button className="text-red-500 hover:text-red-700" onClick={handleCloseMessage}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageDetails;





// import React, { useEffect, useRef } from 'react';

// const MessageDetails = ({ selectedMessage, handleCloseMessage }) => {
//     const iframeRef = useRef(null);

//     useEffect(() => {
//         console.log(selectedMessage); // Log the selectedMessage to inspect its structure
//         if (iframeRef.current && selectedMessage) {
//             const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
//             iframeDoc.open();
//             iframeDoc.write(selectedMessage.body);  // Write the HTML email content inside the iframe
//             iframeDoc.close();
//         }
//     }, [selectedMessage]);

//     if (!selectedMessage) return null;

//     // Helper function to format the email sending date
//     const formatDate = (dateString) => {
//         if (!dateString) return 'Unknown Date';
//         const date = new Date(parseInt(dateString)); // Parse date in case it's a timestamp
//         return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
//     };

//     // Extract the sender's name and email properly from the message headers
//     const senderName = selectedMessage?.from?.split('<')[0].trim() || 'Unknown Sender';  // Extract name part before email
//     const senderEmail = selectedMessage?.from?.match(/<(.+)>/)?.[1] || selectedMessage?.from || 'Unknown Email';  // Extract email part

//     // Handle the correct field for the date
//     const emailDate = selectedMessage.date || selectedMessage.internalDate || selectedMessage.receivedDate || null;

//     return (
//         <div className="flex flex-col h-full overflow-y-auto">
//             {/* Top Bar with Back Button and Email Info */}
//             <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0 z-10 p-4">
//                 <div className="flex items-center space-x-4">
//                     <button className="text-blue-500 hover:text-blue-700" onClick={handleCloseMessage}>
//                         &larr; Back
//                     </button>
//                     <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
//                 </div>
//             </div>

//             {/* Email Header with Sender's Info */}
//             <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
//                 {/* Sender's Info */}
//                 <div className="flex items-center space-x-4">
//                     <div>
//                         <p className="font-semibold text-gray-900">{senderName}</p>
//                         <p className="text-gray-600 text-sm">{senderEmail}</p>
//                     </div>
//                 </div>

//                 {/* Sent Date and Time */}
//                 <div className="text-right">
//                     <p className="text-gray-600 text-sm">
//                         {emailDate ? formatDate(emailDate) : 'Date not available'}
//                     </p>
//                 </div>
//             </div>

//             {/* Email Content Section */}
//             <div className="flex-grow">
//                 <iframe
//                     ref={iframeRef}
//                     title="Email Content"
//                     className="w-full h-[80vh] border-none"
//                 />
//             </div>

//             {/* Footer with Last updated and Close button */}
//             <div className="mt-4 flex justify-between items-center text-gray-600 p-4">
//                 <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
//                 <button className="text-red-500 hover:text-red-700" onClick={handleCloseMessage}>
//                     Close
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MessageDetails;









import React, { useEffect, useRef } from 'react';

const MessageDetails = ({ selectedMessage, handleCloseMessage }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (iframeRef.current && selectedMessage) {
            const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(selectedMessage.body || "<p>No email body content found</p>");
            iframeDoc.close();
        }
    }, [selectedMessage]);

    if (!selectedMessage) return null;

    // Ensure selectedMessage contains the right email
    const email = selectedMessage.from.match(/<(.+)>/)?.[1] || selectedMessage.from || '';

    const handleMarkAsRead = async () => {
        try {
            const email = selectedMessage.from.match(/<(.+)>/)?.[1] || selectedMessage.from || '';
            const response = await fetch(`/api/messages/markAsRead?id=${selectedMessage.id}&email=${encodeURIComponent(email)}&read=true`, {
                method: 'POST',
            });
            if (response.ok) {
                alert('Email marked as read');
            } else {
                alert('Failed to mark email as read');
            }
        } catch (error) {
            console.error('Error marking email as read:', error);
        }
    };
    

    const handleMarkAsUnread = async () => {
        try {
            const response = await fetch(`/api/messages/markAsRead?id=${selectedMessage.id}&email=${encodeURIComponent(email)}&read=false`, {
                method: 'POST',
            });
            if (response.ok) {
                alert('Email marked as unread');
            } else {
                alert('Failed to mark email as unread');
            }
        } catch (error) {
            console.error('Error marking email as unread:', error);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Top Bar with Back Button and Email Info */}
            <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0 z-10 p-4">
                <div className="flex items-center space-x-4">
                    <button className="text-blue-500 hover:text-blue-700" onClick={handleCloseMessage}>
                        &larr; Back
                    </button>
                    <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                    <button className="text-green-500 hover:text-green-700" onClick={handleMarkAsRead}>
                        Mark as Read
                    </button>
                    <button className="text-yellow-500 hover:text-yellow-700" onClick={handleMarkAsUnread}>
                        Mark as Unread
                    </button>
                    <button className="text-red-500 hover:text-red-700" onClick={handleCloseMessage}>
                        Delete
                    </button>
                </div>
            </div>

            {/* Email Header */}
            <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
                <div>
                    <p className="font-semibold text-gray-900">{selectedMessage.from}</p>
                    <p className="text-gray-600 text-sm">{email}</p> {/* Render email */}
                </div>
                <p className="text-gray-600 text-sm">
                    {new Date(parseInt(selectedMessage.timestamp)).toLocaleString()}
                </p>
            </div>

            {/* Email Content Section */}
            <div className="flex-grow">
                <iframe ref={iframeRef} title="Email Content" className="w-full h-[80vh] border-none" />
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center text-gray-600 p-4">
                <p className="text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                <button className="text-red-500 hover:text-red-700" onClick={handleCloseMessage}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default MessageDetails;




