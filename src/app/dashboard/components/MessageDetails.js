// import React, { useEffect, useRef, useState } from 'react';
// import Reply from './Reply';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import { FaArrowLeft, FaReply, FaMagic, FaTrash, FaLightbulb } from 'react-icons/fa'; // Importing icons

// const MessageDetails = ({ selectedMessage, handleCloseMessage, onDeleteMessage }) => {
//   const iframeRef = useRef(null);
//   const [isReplyOpen, setIsReplyOpen] = useState(false);
//   const [summary, setSummary] = useState('');
//   const [isLoadingSummary, setIsLoadingSummary] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [sentiment, setSentiment] = useState('');
//   const [isLoadingSentiment, setIsLoadingSentiment] = useState(false);
//   const [generatedReply, setGeneratedReply] = useState(''); // Store AI-generated reply
//   const [isGeneratingReply, setIsGeneratingReply] = useState(false); // Loading state for smart reply generation

//   const { user } = useUser();

//   useEffect(() => {
//     if (iframeRef.current && selectedMessage) {
//       const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
//       iframeDoc.open();
//       iframeDoc.write(selectedMessage.body || "<p>No email body content found</p>");
//       iframeDoc.close();
//     }

//     // Fetch sentiment analysis when a new message is selected
//     handleSentimentAnalysis();
//   }, [selectedMessage]);

//   if (!selectedMessage) return null;

//   // Function to extract sender's name from the "from" field
//   const extractSenderName = (fromField) => {
//     const nameMatch = fromField.match(/(.*?)</);
//     return nameMatch ? nameMatch[1].trim() : fromField.split('@')[0];
//   };

//   // Truncate email if it's too long
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
//       const response = await fetch('/api/ai/email/summarizeEmail', {
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

//   const handleDeleteEmail = async () => {
//     if (window.confirm('Are you sure you want to delete this email?')) {
//       setIsDeleting(true);
//       try {
//         const response = await fetch(`/api/messages/deleteEmail?email=${user.email}&id=${selectedMessage.id}`, {
//           method: 'DELETE',
//         });

//         if (response.ok) {
//           alert('Email deleted successfully.');
//           setIsDeleting(false);
//           onDeleteMessage(); // Handle the removal of the message in the UI
//         } else {
//           const result = await response.json();
//           alert(`Failed to delete email: ${result.message}`);
//         }
//       } catch (error) {
//         console.error('Error deleting email:', error);
//         alert('Error deleting email.');
//       }
//       setIsDeleting(false);
//     }
//   };

//   const handleSentimentAnalysis = async () => {
//     setIsLoadingSentiment(true);
//     try {
//       const response = await fetch('/api/ai/email/sentimentAnalysis', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           emailBody: selectedMessage.body,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setSentiment(data.sentiment);
//       } else {
//         alert(`Failed to analyze sentiment: ${data.message}`);
//       }
//     } catch (error) {
//       console.error('Error analyzing sentiment:', error);
//       alert('Error analyzing sentiment.');
//     }
//     setIsLoadingSentiment(false);
//   };

//   const handleGenerateSmartReply = async () => {
//     setIsGeneratingReply(true);
//     try {
//       const response = await fetch('/api/ai/compose/smartReply', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           emailContent: selectedMessage.body,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setGeneratedReply(data.reply);
//         setIsReplyOpen(true); // Open the reply form with generated content
//       } else {
//         alert(`Failed to generate reply: ${data.message}`);
//       }
//     } catch (error) {
//       console.error('Error generating smart reply:', error);
//       alert('Error generating smart reply.');
//     }
//     setIsGeneratingReply(false);
//   };

//   return (
//     <div className="flex flex-col h-full overflow-y-auto">
//       <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0 z-10 p-4">
//         <div className="flex items-center space-x-4">
//           <FaArrowLeft
//             className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer"
//             onClick={handleCloseMessage}
//           />
//           <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
//         </div>
//         <div className="flex items-center space-x-4">
//           <FaReply
//             className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer"
//             onClick={handleReply}
//           />
//           <FaMagic
//             className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer"
//             onClick={handleSummarizeEmail}
//           />
//           <FaLightbulb
//             className={`w-6 h-6 text-yellow-500 hover:text-yellow-600 cursor-pointer ${isGeneratingReply ? 'animate-spin' : ''}`}
//             onClick={handleGenerateSmartReply}
//           />
//           <FaTrash
//             className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer"
//             onClick={handleDeleteEmail}
//             disabled={isDeleting} // Disable the button while deleting
//           />
//         </div>
//       </div>

//       {/* Sender's details */}
//       <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
//         <div>
//           <p className="font-semibold text-gray-900">From: {senderName}</p>

//           <p className="text-gray-600 text-sm">{truncateEmail(email)}</p>
//         </div>
//         <div>
//         <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>

//         </div>
//         <p className="text-gray-600 text-sm">
//   {selectedMessage.timestamp ? new Date(parseInt(selectedMessage.timestamp)).toLocaleString() : 'Date not available'}
// </p>

//       </div>

//       {/* Summary section */}
//       {summary && (
//         <div className="mt-4 p-4 bg-blue-50 rounded">
//           <h3 className="font-semibold mb-2">Email Summary:</h3>
//           <p>{summary}</p>
//         </div>
//       )}

//       {/* Sentiment section */}
//       {sentiment && (
//         <div className="mt-4 p-2 bg-teal-500 flex items-center">
//           <h3 className="font-semibold">Sentiment:</h3>
//           <span className="ml-2 text-sm">{sentiment}</span>
//         </div>
//       )}

//       {/* Email body iframe */}
//       <div className="flex-grow">
//         <iframe ref={iframeRef} title="Email Content" className="w-full h-[80vh] border-none" />
//       </div>

//       {/* Reply form with AI-generated reply if available */}
//       {isReplyOpen && (
//         <Reply
//           isOpen={isReplyOpen}
//           onClose={handleCloseReply}
//           userEmail={user?.email}
//           to={email}
//           initialSubject={`Re: ${selectedMessage.subject}`}
//           initialBody={generatedReply || prefillBody}  // Use AI-generated reply if available
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
import { FaArrowLeft, FaReply, FaMagic, FaTrash, FaLightbulb } from 'react-icons/fa';

const MessageDetails = ({ selectedMessage, handleCloseMessage, onDeleteMessage }) => {
  const iframeRef = useRef(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sentiment, setSentiment] = useState('');
  const [isLoadingSentiment, setIsLoadingSentiment] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [eventPrompt, setEventPrompt] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    if (iframeRef.current && selectedMessage) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(selectedMessage.body || "<p>No email body content found</p>");
      iframeDoc.close();
    }

    handleSentimentAnalysis();
    detectEventInEmail();
  }, [selectedMessage]);

  if (!selectedMessage) return null;

  const detectEventInEmail = async () => {
    try {
      const response = await fetch('/api/ai/email/detect-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailContent: selectedMessage.body,
        }),
      });

      const data = await response.json();
      console.log('Raw event detection response:', data); // Debug log
      if (data.eventDetected && Array.isArray(data.events)) {
        setEventPrompt(data.events);
        console.log('Event(s) detected:', data.events); // Debug log
      } else {
        setEventPrompt([]);
      }
    } catch (error) {
      console.error('Error detecting event:', error);
    }
  };

  const handleAddEventToCalendar = async (event) => {
    try {
      const response = await fetch('/api/user/calendar/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: event.title,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
        }),
      });
  
      if (response.ok) {
        alert('Event added to calendar successfully.');
      } else {
        const result = await response.json();
        alert(`Failed to add event to calendar: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding event to calendar:', error);
    }
  };
  

  const handleSummarizeEmail = async () => {
    setIsLoadingSummary(true);
    try {
      const response = await fetch('/api/ai/email/summarizeEmail', {
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
          onDeleteMessage();
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

  const handleSentimentAnalysis = async () => {
    setIsLoadingSentiment(true);
    try {
      const response = await fetch('/api/ai/email/sentimentAnalysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailBody: selectedMessage.body,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSentiment(data.sentiment);
      } else {
        alert(`Failed to analyze sentiment: ${data.message}`);
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      alert('Error analyzing sentiment.');
    }
    setIsLoadingSentiment(false);
  };

  const handleGenerateSmartReply = async () => {
    setIsGeneratingReply(true);
    try {
      const response = await fetch('/api/ai/compose/smartReply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailContent: selectedMessage.body,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedReply(data.reply);
        setIsReplyOpen(true);
      } else {
        alert(`Failed to generate reply: ${data.message}`);
      }
    } catch (error) {
      console.error('Error generating smart reply:', error);
      alert('Error generating smart reply.');
    }
    setIsGeneratingReply(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0 z-10 p-4">
        <div className="flex items-center space-x-4">
          <FaArrowLeft className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={handleCloseMessage} />
          <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <FaReply className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={() => setIsReplyOpen(true)} />
          <FaMagic className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={handleSummarizeEmail} />
          <FaLightbulb className={`w-6 h-6 text-yellow-500 hover:text-yellow-600 cursor-pointer ${isGeneratingReply ? 'animate-spin' : ''}`} onClick={handleGenerateSmartReply} />
          <FaTrash className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={handleDeleteEmail} disabled={isDeleting} />
        </div>
      </div>

      {/* Event Prompt */}
      {eventPrompt.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-4">
          <h4 className="font-semibold text-blue-800">Detected Events:</h4>
          <ul>
            {eventPrompt.map((event, index) => (
              <li key={index} className="my-2">
                <p className="text-blue-800">
                  <strong>{event.title}</strong> on {event.date} from {event.startTime} to {event.endTime}
                </p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                  onClick={() => handleAddEventToCalendar(event)}
                >
                  Add to Calendar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sender's details */}
      <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
        <div>
          <p className="font-semibold text-gray-900">From: {selectedMessage.from}</p>
          <p className="text-gray-600 text-sm">{selectedMessage.from}</p>
        </div>
        <p className="text-gray-600 text-sm">
          {selectedMessage.timestamp ? new Date(parseInt(selectedMessage.timestamp)).toLocaleString() : 'Date not available'}
        </p>
      </div>

      {/* Summary section */}
      {summary && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Email Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      {/* Sentiment section */}
      {sentiment && (
        <div className="mt-4 p-2 bg-teal-500 flex items-center">
          <h3 className="font-semibold">Sentiment:</h3>
          <span className="ml-2 text-sm">{sentiment}</span>
        </div>
      )}

      {/* Email body iframe */}
      <div className="flex-grow">
        <iframe ref={iframeRef} title="Email Content" className="w-full h-[80vh] border-none" />
      </div>

      {/* Reply form with AI-generated reply if available */}
      {isReplyOpen && (
        <Reply
          isOpen={isReplyOpen}
          onClose={() => setIsReplyOpen(false)}
          userEmail={user?.email}
          to={selectedMessage.from}
          initialSubject={`Re: ${selectedMessage.subject}`}
          initialBody={generatedReply || ''}
          selectedMessage={selectedMessage}
        />
      )}
    </div>
  );
};

export default MessageDetails;
