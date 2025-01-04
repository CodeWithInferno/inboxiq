// import React, { useEffect, useRef, useState } from 'react';
// import Reply from './Reply';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import { FaArrowLeft, FaReply, FaMagic, FaTrash, FaLightbulb } from 'react-icons/fa';
// import FilePreviewMessage from './FilePreviewMessage';

// const MessageDetails = ({ selectedMessage, handleCloseMessage, onDeleteMessage }) => {
//   const iframeRef = useRef(null);
//   const [isReplyOpen, setIsReplyOpen] = useState(false);
//   const [summary, setSummary] = useState('');
//   const [isLoadingSummary, setIsLoadingSummary] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [sentiment, setSentiment] = useState('');
//   const [isLoadingSentiment, setIsLoadingSentiment] = useState(false);
//   const [generatedReply, setGeneratedReply] = useState('');
//   const [isGeneratingReply, setIsGeneratingReply] = useState(false);
//   const [eventPrompt, setEventPrompt] = useState([]);

//   const { user } = useUser();

//   useEffect(() => {
//     if (iframeRef.current && selectedMessage) {
//       const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
//       iframeDoc.open();
//       iframeDoc.write(selectedMessage.body || "<p>No email body content found</p>");
//       iframeDoc.close();
//     }

//     handleSentimentAnalysis();
//     detectEventInEmail();
//   }, [selectedMessage]);

//   if (!selectedMessage) return null;

//   const detectEventInEmail = async () => {
//     try {
//       const response = await fetch('/api/ai/email/detect-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           emailContent: selectedMessage.body,
//         }),
//       });

//       const data = await response.json();
//       console.log('Raw event detection response:', data);
//       if (data.eventDetected && Array.isArray(data.events)) {
//         setEventPrompt(data.events);
//         console.log('Event(s) detected:', data.events);
//       } else {
//         setEventPrompt([]);
//       }
//     } catch (error) {
//       console.error('Error detecting event:', error);
//     }
//   };

//   const handleAddEventToCalendar = async (event) => {
//     try {
//       const response = await fetch('/api/user/calendar/add-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           title: event.title,
//           date: event.date,
//           startTime: event.startTime,
//           endTime: event.endTime,
//         }),
//       });

//       if (response.ok) {
//         alert('Event added to calendar successfully.');
//       } else {
//         const result = await response.json();
//         alert(`Failed to add event to calendar: ${result.message}`);
//       }
//     } catch (error) {
//       console.error('Error adding event to calendar:', error);
//     }
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

//       if (response.status === 403) {
//         console.warn('Summarize email feature is disabled for this user.');
//         setSummary('Feature not enabled. Please enable the summarization feature to use it.');
//         return;
//       }

//       if (!response.ok) {
//         const data = await response.json();
//         console.error(`Failed to summarize email: ${data.message}`);
//         setSummary('Error summarizing email.');
//         return;
//       }

//       const data = await response.json();
//       setSummary(data.summary);
//     } catch (error) {
//       console.error('Error summarizing email:', error);
//       setSummary('Error summarizing email.');
//     } finally {
//       setIsLoadingSummary(false);
//     }
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
//           onDeleteMessage();
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

//       if (response.status === 403) {
//         console.warn('Sentiment analysis feature is disabled for this user.');
//         setSentiment('Feature not enabled');
//         return;
//       }

//       if (!response.ok) {
//         const data = await response.json();
//         console.error(`Failed to analyze sentiment: ${data.message}`);
//         setSentiment('Error analyzing sentiment');
//         return;
//       }

//       const data = await response.json();
//       setSentiment(data.sentiment);
//     } catch (error) {
//       console.error('Error analyzing sentiment:', error);
//       setSentiment('Error analyzing sentiment');
//     } finally {
//       setIsLoadingSentiment(false);
//     }
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

//       if (response.status === 403) {
//         console.warn('Smart reply feature is disabled for this user.');
//         setGeneratedReply('Feature not enabled. Please enable the smart reply feature to use it.');
//         return;
//       }

//       if (!response.ok) {
//         const data = await response.json();
//         console.error(`Failed to generate reply: ${data.message}`);
//         setGeneratedReply('Error generating reply.');
//         return;
//       }

//       const data = await response.json();
//       setGeneratedReply(data.reply);
//       setIsReplyOpen(true);
//     } catch (error) {
//       console.error('Error generating smart reply:', error);
//       setGeneratedReply('Error generating reply.');
//     } finally {
//       setIsGeneratingReply(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full overflow-y-auto">
//       <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0 z-10 p-4">
//         <div className="flex items-center space-x-4">
//           <FaArrowLeft className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={handleCloseMessage} />
//           <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
//         </div>
//         <div className="flex items-center space-x-4">
//           <FaReply className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={() => setIsReplyOpen(true)} />
//           <FaMagic className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={handleSummarizeEmail} />
//           <FaLightbulb className={`w-6 h-6 text-yellow-500 hover:text-yellow-600 cursor-pointer ${isGeneratingReply ? 'animate-spin' : ''}`} onClick={handleGenerateSmartReply} />
//           <FaTrash className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={handleDeleteEmail} disabled={isDeleting} />
//         </div>
//       </div>

//       {/* Event Prompt */}
//       {eventPrompt.length > 0 && (
//         <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-4">
//           <h4 className="font-semibold text-blue-800">Detected Events:</h4>
//           <ul>
//             {eventPrompt.map((event, index) => (
//               <li key={index} className="my-2">
//                 <p className="text-blue-800">
//                   <strong>{event.title}</strong> on {event.date} from {event.startTime} to {event.endTime}
//                 </p>
//                 <button
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
//                   onClick={() => handleAddEventToCalendar(event)}
//                 >
//                   Add to Calendar
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Sender's details */}
//       <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
//         <div>
//           <p className="font-semibold text-gray-900">From: {selectedMessage.from}</p>
//           <p className="text-gray-600 text-sm">{selectedMessage.from}</p>
//         </div>
//         <p className="text-gray-600 text-sm">
//           {selectedMessage.timestamp ? new Date(parseInt(selectedMessage.timestamp)).toLocaleString() : 'Date not available'}
//         </p>
//       </div>

//       {/* Summary section */}
//       {(isLoadingSummary || summary) && (
//         <div className="mt-4 p-4 bg-blue-50 rounded">
//           <h3 className="font-semibold mb-2">Email Summary:</h3>
//           {isLoadingSummary ? (
//             <div className="shadow rounded-md p-4 w-full mx-auto">
//               <div className="animate-pulse space-y-3">
//                 <div className="h-2 bg-slate-700 rounded"></div>
//                 <div className="h-2 bg-slate-700 rounded"></div>
//                 <div className="h-2 bg-slate-700 rounded"></div>
//               </div>
//             </div>
//           ) : (
//             <p>{summary}</p>
//           )}
//         </div>
//       )}

//       {/* Sentiment section */}
//       {sentiment && (
//         <div className="mt-4 p-2 bg-white border-b mb-3 flex items-center">
//           <h3 className="font-semibold">Sentiment:</h3>
//           <span className="ml-2 text-sm">{sentiment}</span>
//         </div>
//       )}

//       {/* Attachments section */}
//       {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
//         <div className="mt-4">
//           <h3 className="font-semibold mb-2">Attachments:</h3>
//           <FilePreviewMessage files={selectedMessage.attachments} />
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
//           onClose={() => setIsReplyOpen(false)}
//           userEmail={user?.email}
//           to={selectedMessage.from}
//           initialSubject={`Re: ${selectedMessage.subject}`}
//           initialBody={generatedReply || ''}
//           selectedMessage={selectedMessage}
//         />
//       )}
//     </div>
//   );
// };

// export default MessageDetails;
























import React, { useEffect, useRef, useState } from 'react';
import Reply from './Reply';
import Forward from './Forward';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaArrowLeft, FaReply, FaMagic, FaTrash, FaLightbulb, FaShare } from 'react-icons/fa';
import FilePreviewMessage from './FilePreviewMessage';

const MessageDetails = ({ selectedMessage, handleCloseMessage, onDeleteMessage }) => {
  const iframeRef = useRef(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isForwardOpen, setIsForwardOpen] = useState(false);
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
    detectEventInEmail(); // Invoke the event detection function
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
      if (data.eventDetected && data.event) {
        setEventPrompt([data.event]); // Wrap the single event object in an array
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

      if (response.status === 403) {
        setSummary('Feature not enabled. Please enable the summarization feature to use it.');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setSummary('Error summarizing email.');
        return;
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error summarizing email:', error);
      setSummary('Error summarizing email.');
    } finally {
      setIsLoadingSummary(false);
    }
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

      if (response.status === 403) {
        setSentiment('Feature not enabled');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setSentiment('Error analyzing sentiment');
        return;
      }

      const data = await response.json();
      setSentiment(data.sentiment);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setSentiment('Error analyzing sentiment');
    } finally {
      setIsLoadingSentiment(false);
    }
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

      if (response.status === 403) {
        setGeneratedReply('Feature not enabled. Please enable the smart reply feature to use it.');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setGeneratedReply('Error generating reply.');
        return;
      }

      const data = await response.json();
      setGeneratedReply(data.reply);
      setIsReplyOpen(true);
    } catch (error) {
      console.error('Error generating smart reply:', error);
      setGeneratedReply('Error generating reply.');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Date not available';
    const date = new Date(parseInt(timestamp));
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between border-b-2 pb-4 mb-4 bg-white sticky top-0  p-4">
        <div className="flex items-center space-x-4">
          <FaArrowLeft className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={handleCloseMessage} />
          <h2 className="font-semibold text-lg">{selectedMessage.subject || '(No Subject)'}</h2>
        </div>
        {!isForwardOpen && (
          <div className="flex items-center space-x-4">
            <FaReply className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={() => setIsReplyOpen(true)} />
            <FaShare className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={() => setIsForwardOpen(true)} />
            <FaMagic className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={handleSummarizeEmail} />
            <FaLightbulb className={`w-6 h-6 text-yellow-500 hover:text-yellow-600 cursor-pointer ${isGeneratingReply ? 'animate-spin' : ''}`} onClick={handleGenerateSmartReply} />
            <FaTrash className="w-6 h-6 text-black hover:text-gray-700 cursor-pointer" onClick={handleDeleteEmail} disabled={isDeleting} />
          </div>
        )}
      </div>

      {eventPrompt.length > 0 && (
  <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
    <h4 className="text-xl font-bold text-blue-800 mb-4">📅 Event Details Detected</h4>
    <div className="space-y-4">
      {eventPrompt.map((event, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 border rounded-lg hover:bg-blue-50 transition-all"
        >
          <div>
            <h5 className="text-lg font-semibold text-blue-600">{event.title}</h5>
            <p className="text-gray-600">
              📅 <span className="font-medium">{event.date}</span> at{" "}
              <span className="font-medium">{event.time}</span>
            </p>
          </div>
          <button
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-all"
            onClick={() => handleAddEventToCalendar(event)}
          >
            Add to Calendar
          </button>
        </div>
      ))}
    </div>
  </div>
)}




      <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
        <div>
          <p className="font-semibold text-gray-900">From: {selectedMessage.from}</p>
          <p className="text-gray-600 text-sm">{selectedMessage.from}</p>
        </div>
        <p className="text-gray-600 text-sm">{formatTimestamp(selectedMessage.timestamp)}</p>
      </div>

      {(isLoadingSummary || summary) && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Email Summary:</h3>
          {isLoadingSummary ? (
            <div className="shadow rounded-md p-4 w-full mx-auto">
              <div className="animate-pulse space-y-3">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          ) : (
            <p>{summary}</p>
          )}
        </div>
      )}

      {sentiment && (
        <div className="mt-4 p-2 bg-white border-b mb-3 flex items-center">
          <h3 className="font-semibold">Sentiment:</h3>
          <span className="ml-2 text-sm">{sentiment}</span>
        </div>
      )}

      {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Attachments:</h3>
          <FilePreviewMessage files={selectedMessage.attachments} />
        </div>
      )}

      <div className="flex-grow">
        <iframe ref={iframeRef} title="Email Content" className="w-full h-[80vh] border-none" />
      </div>

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

      {isForwardOpen && (
        <Forward
          isOpen={isForwardOpen}
          onClose={() => setIsForwardOpen(false)}
          selectedMessage={selectedMessage}
          useRichHtml
        />
      )}
    </div>
  );
};

export default MessageDetails;








// // Import necessary dependencies
// import React, { useEffect, useRef, useState } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import Reply from './Reply';
// import Forward from './Forward';
// import FilePreviewMessage from './FilePreviewMessage';
// import { ArrowLeft, Reply as ReplyIcon, Share, Wand, Trash2, Calendar, Lightbulb } from 'lucide-react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";

// const MessageDetails = ({ selectedMessage, handleCloseMessage, onDeleteMessage }) => {
//   const iframeRef = useRef(null);
//   const [isReplyOpen, setIsReplyOpen] = useState(false);
//   const [isForwardOpen, setIsForwardOpen] = useState(false);
//   const [summary, setSummary] = useState('');
//   const [isLoadingSummary, setIsLoadingSummary] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [sentiment, setSentiment] = useState('');
//   const [isLoadingSentiment, setIsLoadingSentiment] = useState(false);
//   const [generatedReply, setGeneratedReply] = useState('');
//   const [isGeneratingReply, setIsGeneratingReply] = useState(false);
//   const [eventPrompt, setEventPrompt] = useState([]);

//   const { user } = useUser();

//   useEffect(() => {
//     if (iframeRef.current && selectedMessage) {
//       const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
//       iframeDoc.open();
//       iframeDoc.write(selectedMessage.body || "<p>No email body content found</p>");
//       iframeDoc.close();
//     }

//     handleSentimentAnalysis();
//     detectEventInEmail();
//   }, [selectedMessage]);

//   if (!selectedMessage) return null;

//   const detectEventInEmail = async () => {
//     try {
//       const response = await fetch('/api/ai/email/detect-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ emailContent: selectedMessage.body }),
//       });

//       const data = await response.json();
//       if (data.eventDetected && Array.isArray(data.events)) {
//         setEventPrompt(data.events);
//       } else {
//         setEventPrompt([]);
//       }
//     } catch (error) {
//       console.error('Error detecting event:', error);
//     }
//   };

//   const handleAddEventToCalendar = async (event) => {
//     try {
//       const response = await fetch('/api/user/calendar/add-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(event),
//       });

//       if (response.ok) {
//         alert('Event added to calendar successfully.');
//       } else {
//         const result = await response.json();
//         alert(`Failed to add event to calendar: ${result.message}`);
//       }
//     } catch (error) {
//       console.error('Error adding event to calendar:', error);
//     }
//   };

//   const handleSummarizeEmail = async () => {
//     setIsLoadingSummary(true);
//     try {
//       const response = await fetch('/api/ai/email/summarizeEmail', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ emailBody: selectedMessage.body }),
//       });

//       if (response.status === 403) {
//         setSummary('Feature not enabled. Please enable the summarization feature to use it.');
//         return;
//       }

//       if (!response.ok) {
//         setSummary('Error summarizing email.');
//         return;
//       }

//       const data = await response.json();
//       setSummary(data.summary);
//     } catch (error) {
//       console.error('Error summarizing email:', error);
//       setSummary('Error summarizing email.');
//     } finally {
//       setIsLoadingSummary(false);
//     }
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
//           onDeleteMessage();
//         } else {
//           const result = await response.json();
//           alert(`Failed to delete email: ${result.message}`);
//         }
//       } catch (error) {
//         console.error('Error deleting email:', error);
//         alert('Error deleting email.');
//       } finally {
//         setIsDeleting(false);
//       }
//     }
//   };

//   const handleSentimentAnalysis = async () => {
//     setIsLoadingSentiment(true);
//     try {
//       const response = await fetch('/api/ai/email/sentimentAnalysis', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ emailBody: selectedMessage.body }),
//       });

//       if (response.status === 403) {
//         setSentiment('Feature not enabled');
//         return;
//       }

//       if (!response.ok) {
//         setSentiment('Error analyzing sentiment');
//         return; 
//       }

//       const data = await response.json();
//       setSentiment(data.sentiment);
//     } catch (error) {
//       console.error('Error analyzing sentiment:', error);
//       setSentiment('Error analyzing sentiment');
//     } finally {
//       setIsLoadingSentiment(false);
//     }
//   };

//   const handleGenerateSmartReply = async () => {
//     setIsGeneratingReply(true);
//     try {
//       const response = await fetch('/api/ai/compose/smartReply', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ emailContent: selectedMessage.body }),
//       });

//       if (response.status === 403) {
//         setGeneratedReply('Feature not enabled. Please enable the smart reply feature to use it.');
//         return;
//       }

//       if (!response.ok) {
//         setGeneratedReply('Error generating reply.');
//         return;
//       }

//       const data = await response.json();
//       setGeneratedReply(data.reply);
//       setIsReplyOpen(true);
//     } catch (error) {
//       console.error('Error generating smart reply:', error);
//       setGeneratedReply('Error generating reply.');
//     } finally {
//       setIsGeneratingReply(false);
//     }
//   };

//   const getSentimentColor = (sentiment) => {
//     const sentimentMap = {
//       'positive': 'bg-green-50 text-green-700',
//       'negative': 'bg-red-50 text-red-700',
//       'neutral': 'bg-gray-50 text-gray-700'
//     };
//     return sentimentMap[sentiment.toLowerCase()] || 'bg-gray-50 text-gray-700';
//   };

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'Date not available';
//     const date = new Date(parseInt(timestamp));
//     return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
//   };

//   return (
//     <Card className="h-full overflow-hidden shadow-lg rounded-md bg-white">
//       <CardHeader className="sticky top-0 z-10 bg-gray-50 border-b shadow-sm">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" onClick={handleCloseMessage}>
//               <ArrowLeft className="h-5 w-5 text-gray-600" />
//             </Button>
//             <CardTitle className="text-lg font-semibold text-gray-800">{selectedMessage.subject || '(No Subject)'}</CardTitle>
//           </div>
//           {!isForwardOpen && (
//             <div className="flex items-center gap-2">
//               <Button variant="ghost" size="icon" onClick={() => setIsReplyOpen(true)}>
//                 <ReplyIcon className="h-5 w-5 text-gray-600 hover:text-blue-600" />
//               </Button>
//               <Button variant="ghost" size="icon" onClick={() => setIsForwardOpen(true)}>
//                 <Share className="h-5 w-5 text-gray-600 hover:text-blue-600" />
//               </Button>
//               <Button variant="ghost" size="icon" onClick={handleSummarizeEmail}>
//                 <Wand className="h-5 w-5 text-gray-600 hover:text-blue-600" />
//               </Button>
//               <Button variant="ghost" size="icon" onClick={handleGenerateSmartReply} disabled={isGeneratingReply}>
//                 <Lightbulb className={`h-5 w-5 text-gray-600 hover:text-blue-600 ${isGeneratingReply ? 'animate-spin' : ''}`} />
//               </Button>
//               <Button variant="ghost" size="icon" onClick={handleDeleteEmail} disabled={isDeleting}>
//                 <Trash2 className="h-5 w-5 text-gray-600 hover:text-red-600" />
//               </Button>
//             </div>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="p-6 space-y-6">
//         <div className="bg-gray-50 p-4 rounded-lg shadow-md">
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="font-medium text-gray-800">{selectedMessage.from}</p>
//               <p className="text-sm text-gray-600">{selectedMessage.from}</p>
//             </div>
//             <p className="text-sm text-gray-600">{formatTimestamp(selectedMessage.timestamp)}</p>
//           </div>
//           {sentiment && !isLoadingSentiment && (
//             <Badge variant="secondary" className={`${getSentimentColor(sentiment)} mt-2`}> 
//               {sentiment}
//             </Badge>
//           )}
//           {isLoadingSentiment && (
//             <Skeleton className="h-6 w-20 bg-gray-200" />
//           )}
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <iframe 
//             ref={iframeRef} 
//             title="Email Content" 
//             className="w-full h-[60vh] border-none rounded-md" 
//           />
//         </div>

//         {(isLoadingSummary || summary) && (
//           <Alert className="bg-gray-100 border border-gray-300 rounded-md mt-4">
//             <AlertTitle className="text-gray-700 font-semibold">Email Summary</AlertTitle>
//             <AlertDescription>
//               {isLoadingSummary ? (
//                 <div className="space-y-2">
//                   <Skeleton className="h-4 w-full bg-gray-200" />
//                   <Skeleton className="h-4 w-4/5 bg-gray-200" />
//                   <Skeleton className="h-4 w-3/5 bg-gray-200" />
//                 </div>
//               ) : (
//                 <p className="text-gray-700">{summary}</p>
//               )}
//             </AlertDescription>
//           </Alert>
//         )}

//         {selectedMessage.attachments?.length > 0 && (
//           <div className="space-y-2 mt-4">
//             <h3 className="font-medium text-gray-800">Attachments</h3>
//             <FilePreviewMessage files={selectedMessage.attachments} />
//           </div>
//         )}

//         {eventPrompt.length > 0 && (
//           <Alert className="bg-blue-50 border border-blue-200 rounded-md mt-4">
//             <Calendar className="h-4 w-4 text-blue-700" />
//             <AlertTitle className="text-blue-800 font-semibold">Detected Events</AlertTitle>
//             <AlertDescription>
//               <div className="space-y-4 mt-2">
//                 {eventPrompt.map((event, index) => (
//                   <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
//                     <div>
//                       <p className="font-medium text-gray-800">{event.title}</p>
//                       <p className="text-sm text-gray-600">
//                         {event.date} • {event.startTime} - {event.endTime}
//                       </p>
//                     </div>
//                     <Button 
//                       size="sm"
//                       onClick={() => handleAddEventToCalendar(event)}
//                       className="bg-blue-600 text-white hover:bg-blue-700 rounded-md"
//                     >
//                       Add to Calendar
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </AlertDescription>
//           </Alert>
//         )}

//         {isReplyOpen && (
//           <Reply
//             isOpen={isReplyOpen}
//             onClose={() => setIsReplyOpen(false)}
//             userEmail={user?.email}
//             to={selectedMessage.from}
//             initialSubject={`Re: ${selectedMessage.subject}`}
//             initialBody={generatedReply || ''}
//             selectedMessage={selectedMessage}
//           />
//         )}

//         {isForwardOpen && (
//           <Forward
//             isOpen={isForwardOpen}
//             onClose={() => setIsForwardOpen(false)}
//             selectedMessage={selectedMessage}
//             useRichHtml
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default MessageDetails;
