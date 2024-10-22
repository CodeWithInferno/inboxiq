// import React, { useEffect, useRef, useState } from 'react';
// import Reply from './Reply';
// import { useUser } from '@auth0/nextjs-auth0/client';

// const MessageDetails = ({ selectedMessage, handleCloseMessage }) => {
//   const iframeRef = useRef(null);
//   const [isReplyOpen, setIsReplyOpen] = useState(false);

//   const { user } = useUser(); 

//   useEffect(() => {
//     if (iframeRef.current && selectedMessage) {
//       const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
//       iframeDoc.open();
//       iframeDoc.write(selectedMessage.body || "<p>No email body content found</p>");
//       iframeDoc.close();
//     }
//   }, [selectedMessage]);

//   if (!selectedMessage) return null;

//   const email = selectedMessage.from.match(/<(.+)>/)?.[1] || selectedMessage.from || '';

//   const prefillBody = `
//     \n\nOn ${new Date(selectedMessage.timestamp).toLocaleString()}, ${selectedMessage.from} wrote:\n${selectedMessage.body}`;

//   const handleReply = () => {
//     if (user && user.email) {
//       setIsReplyOpen(true);
//     } else {
//       console.error('No user email found.');
//     }
//   };

//   const handleCloseReply = () => {
//     setIsReplyOpen(false);
//   };

//   return (
//     <div className="flex flex-col h-full overflow-y-auto">
//       <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0 z-10 p-4">
//         <div className="flex items-center space-x-4">
//           <button className="text-blue-500 hover:text-blue-700" onClick={handleCloseMessage}>
//             &larr; Back
//           </button>
//           <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
//         </div>
//         <div className="flex items-center space-x-4">
//           <button className="text-blue-500 hover:text-blue-700" onClick={handleReply}>
//             Reply
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
//         <div>
//           <p className="font-semibold text-gray-900">{selectedMessage.from}</p>
//           <p className="text-gray-600 text-sm">{email}</p>
//         </div>
//         <p className="text-gray-600 text-sm">
//           {new Date(parseInt(selectedMessage.timestamp)).toLocaleString()}
//         </p>
//       </div>

//       <div className="flex-grow">
//         <iframe ref={iframeRef} title="Email Content" className="w-full h-[80vh] border-none" />
//       </div>

//       {isReplyOpen && (
//         <Reply
//           isOpen={isReplyOpen}
//           onClose={handleCloseReply}
//           userEmail={user?.email} 
//           to={email}
//           initialSubject={`Re: ${selectedMessage.subject}`}
//           initialBody={prefillBody}
//           selectedMessage={selectedMessage} 
//         />
//       )}
//     </div>
//   );
// };

// export default MessageDetails;




// import React, { useEffect, useRef, useState } from 'react';
// import Reply from './Reply';
// import { useUser } from '@auth0/nextjs-auth0/client';

// const MessageDetails = ({ selectedMessage, handleCloseMessage }) => {
//   const iframeRef = useRef(null);
//   const [isReplyOpen, setIsReplyOpen] = useState(false);
//   const [summary, setSummary] = useState('');
//   const [isLoadingSummary, setIsLoadingSummary] = useState(false);

//   const { user } = useUser();

//   useEffect(() => {
//     if (iframeRef.current && selectedMessage) {
//       const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
//       iframeDoc.open();
//       iframeDoc.write(selectedMessage.body || "<p>No email body content found</p>");
//       iframeDoc.close();
//     }
//   }, [selectedMessage]);

//   if (!selectedMessage) return null;

//   const extractSenderName = (fromField) => {
//     const nameMatch = fromField.match(/(.*?)</);
//     return nameMatch ? nameMatch[1].trim() : fromField.split('@')[0];
//   };

//   const truncateEmail = (email) => {
//     if (email.length > 30) {
//       return `${email.slice(0, 15)}...@${email.split('@')[1]}`;
//     }
//     return email;
//   };

//   const email = selectedMessage.from.match(/<(.+)>/)?.[1] || selectedMessage.from || '';
//   const senderName = extractSenderName(selectedMessage.from);

//   const prefillBody = `
//     \n\nOn ${new Date(selectedMessage.timestamp).toLocaleString()}, ${selectedMessage.from} wrote:\n${selectedMessage.body}`;

//   const handleReply = () => {
//     if (user && user.email) {
//       setIsReplyOpen(true);
//     } else {
//       console.error('No user email found.');
//     }
//   };

//   const handleCloseReply = () => {
//     setIsReplyOpen(false);
//   };

//   const handleSummarizeEmail = async () => {
//     setIsLoadingSummary(true);
//     try {
//       const response = await fetch('/api/messages/summarize', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           emailBody: selectedMessage.body,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setSummary(data.summary);
//       } else {
//         alert(`Failed to summarize email: ${data.message}`);
//       }
//     } catch (error) {
//       console.error('Error summarizing email:', error);
//       alert('Error summarizing email.');
//     }
//     setIsLoadingSummary(false);
//   };

//   return (
//     <div className="flex flex-col h-full overflow-y-auto">
//       <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0 z-10 p-4">
//         <div className="flex items-center space-x-4">
//           <button className="text-blue-500 hover:text-blue-700" onClick={handleCloseMessage}>
//             &larr; Back
//           </button>
//           <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
//         </div>
//         <div className="flex items-center space-x-4">
//           <button className="text-blue-500 hover:text-blue-700" onClick={handleReply}>
//             Reply
//           </button>
//           <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSummarizeEmail}>
//             {isLoadingSummary ? 'Summarizing...' : 'Summarize Email'}
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
//         <div>
//           <p className="font-semibold text-gray-900">{senderName}</p>
//           <p className="text-gray-600 text-sm">{truncateEmail(email)}</p>
//         </div>
//         <p className="text-gray-600 text-sm">
//           {new Date(parseInt(selectedMessage.timestamp)).toLocaleString()}
//         </p>
//       </div>

//       <div className="flex-grow">
//         <iframe ref={iframeRef} title="Email Content" className="w-full h-[80vh] border-none" />
//       </div>

//       {summary && (
//         <div className="mt-4 p-4 bg-blue-50 rounded">
//           <h3 className="font-semibold mb-2">Email Summary:</h3>
//           <p>{summary}</p>
//         </div>
//       )}

//       {isReplyOpen && (
//         <Reply
//           isOpen={isReplyOpen}
//           onClose={handleCloseReply}
//           userEmail={user?.email}
//           to={email}
//           initialSubject={`Re: ${selectedMessage.subject}`}
//           initialBody={prefillBody}
//           selectedMessage={selectedMessage}
//         />
//       )}
//     </div>
//   );
// };

// export default MessageDetails;






import React, { useEffect, useRef, useState } from 'react';
import Reply from './Reply';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaArrowLeft, FaReply, FaMagic, FaTrash } from 'react-icons/fa'; // Importing icons from react-icons

const MessageDetails = ({ selectedMessage, handleCloseMessage, onDeleteMessage }) => {
  const iframeRef = useRef(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    if (iframeRef.current && selectedMessage) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(selectedMessage.body || "<p>No email body content found</p>");
      iframeDoc.close();
    }
  }, [selectedMessage]);

  if (!selectedMessage) return null;

  const extractSenderName = (fromField) => {
    const nameMatch = fromField.match(/(.*?)</);
    return nameMatch ? nameMatch[1].trim() : fromField.split('@')[0];
  };

  const truncateEmail = (email) => {
    if (email.length > 30) {
      return `${email.slice(0, 15)}...@${email.split('@')[1]}`;
    }
    return email;
  };

  const email = selectedMessage.from.match(/<(.+)>/)?.[1] || selectedMessage.from || '';
  const senderName = extractSenderName(selectedMessage.from);

  const prefillBody = `
    \n\nOn ${new Date(selectedMessage.timestamp).toLocaleString()}, ${selectedMessage.from} wrote:\n${selectedMessage.body}`;

  const handleReply = () => {
    if (user && user.email) {
      setIsReplyOpen(true);
    } else {
      console.error('No user email found.');
    }
  };

  const handleCloseReply = () => {
    setIsReplyOpen(false);
  };

  const handleSummarizeEmail = async () => {
    setIsLoadingSummary(true);
    try {
      const response = await fetch('/api/messages/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailBody: selectedMessage.body,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        alert(`Failed to summarize email: ${data.message}`);
      }
    } catch (error) {
      console.error('Error summarizing email:', error);
      alert('Error summarizing email.');
    }
    setIsLoadingSummary(false);
  };

  const handleDeleteEmail = async () => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/messages/deleteEmail?email=${user.email}&id=${selectedMessage.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Email deleted successfully.');
          setIsDeleting(false);
          onDeleteMessage(); // This will handle the removal of the message in the UI
        } else {
          const result = await response.json();
          alert(`Failed to delete email: ${result.message}`);
        }
      } catch (error) {
        console.error('Error deleting email:', error);
        alert('Error deleting email.');
      }
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0 z-10 p-4">
        <div className="flex items-center space-x-4">
          <FaArrowLeft
            className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer"
            onClick={handleCloseMessage}
          />
          <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <FaReply
            className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer"
            onClick={handleReply}
          />
          <FaMagic
            className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer"
            onClick={handleSummarizeEmail}
          />
          <FaTrash
            className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer"
            onClick={handleDeleteEmail}
            disabled={isDeleting} // Disable the button while deleting
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
        <div>
          <p className="font-semibold text-gray-900">{senderName}</p>
          <p className="text-gray-600 text-sm">{truncateEmail(email)}</p>
        </div>
        <p className="text-gray-600 text-sm">
          {new Date(parseInt(selectedMessage.timestamp)).toLocaleString()}
        </p>
      </div>

      <div className="flex-grow">
        <iframe ref={iframeRef} title="Email Content" className="w-full h-[80vh] border-none" />
      </div>

      {summary && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Email Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {isReplyOpen && (
        <Reply
          isOpen={isReplyOpen}
          onClose={handleCloseReply}
          userEmail={user?.email}
          to={email}
          initialSubject={`Re: ${selectedMessage.subject}`}
          initialBody={prefillBody}
          selectedMessage={selectedMessage}
        />
      )}
    </div>
  );
};

export default MessageDetails;
