// 'use client';

// import { useRouter, useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import Sidebar from '../components/Sidebar';
// import MessageDetails from '../components/MessageDetails';
// import Compose from '../components/Compose';
// import { FaExclamationCircle, FaSearch } from 'react-icons/fa';
// import Search from '../components/search';
// import Drafts from './components/Drafts';

// const DashboardPage = () => {
//   const router = useRouter();
//   const { slug } = useParams();
//   const { user, isLoading } = useUser();
//   const [emails, setEmails] = useState([]);
//   const [labelCounts, setLabelCounts] = useState({});
//   const [nextPageToken, setNextPageToken] = useState(null);
//   const [threadMessages, setThreadMessages] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [isComposeOpen, setIsComposeOpen] = useState(false);
//   const [isClassifying, setIsClassifying] = useState(false);
//   const [isBlocking, setIsBlocking] = useState(false);

//   useEffect(() => {
//     if (!slug) {
//       router.replace('/dashboard/inbox');
//     }
//   }, [slug, router]);

//   const getGmailLabel = (slug) => {
//     switch (slug) {
//       case 'inbox':
//         return 'INBOX';
//       case 'promotions':
//         return 'CATEGORY_PROMOTIONS';
//       case 'social':
//         return 'CATEGORY_SOCIAL';
//       case 'spam':
//         return 'SPAM';
//       case 'trash':
//         return 'TRASH';
//       case 'sent':
//         return 'SENT';
//       case 'drafts':
//         return 'DRAFT';
//       case 'starred':
//         return 'STARRED';
//       default:
//         return 'INBOX';
//     }
//   };

//   const fetchEmails = async (label, email, query = '', pageToken = null) => {
//     try {
//       const url = `/api/auth/google/fetchEmails?label=${label}&email=${encodeURIComponent(email)}${query ? `&query=${encodeURIComponent(query)}` : ''
//         }${pageToken ? `&pageToken=${pageToken}` : ''}`;

//       console.log('Fetching emails with URL:', url); // Debugging
//       const response = await fetch(url);
//       const data = await response.json();
//       setEmails(data.messages || []);
//     } catch (error) {
//       console.error('Error fetching emails:', error.message);
//     }
//   };

//   const classifyEmails = async (emails) => {
//     const classifiedEmails = [];

//     for (const email of emails) {
//       try {
//         const emailContent = {
//           subject: truncateContent(email.subject || '', 800), // Limit each part to prevent overflow
//           body: truncateContent(email.snippet || '', 800),
//         };

//         console.log('Sending email for classification:', emailContent);

//         const response = await fetch('/api/ai/email/classifyEmail', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email: emailContent }),
//         });

//         if (!response.ok) {
//           throw new Error('Classification failed');
//         }

//         const { priority } = await response.json();
//         classifiedEmails.push({ ...email, priority });
//       } catch (error) {
//         if (error.message.includes('context_length_exceeded')) {
//           console.warn(`Skipping email with ID ${email.id} due to token limit`);
//           classifiedEmails.push({ ...email, priority: 'Low Priority' });
//         } else {
//           console.error(`Error classifying email with ID ${email.id}:`, error.message);
//           classifiedEmails.push({ ...email, priority: 'Low Priority' });
//         }
//       }
//     }

//     return classifiedEmails;
//   };

//   const truncateContent = (text, limit) => {
//     return text.length > limit ? text.slice(0, limit - 1) + '…' : text;
//   };

//   const labelEmails = async () => {
//     return await Promise.all(
//       emails.map(async (email) => {
//         try {
//           const emailContent = { id: email.id, subject: email.subject, body: email.snippet };
//           const response = await fetch('/api/ai/email/labeling', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email: emailContent }),
//           });
//           const { category } = await response.json();
//           return { ...email, category };
//         } catch (error) {
//           console.error('Error labeling email:', error.message);
//           return { ...email, category: 'Unclassified' };
//         }
//       })
//     );
//   };

//   const handleLabelEmails = async () => {
//     setIsClassifying(true);
//     const label = getGmailLabel(slug);
//     if (user?.email) {
//       const labeledEmails = await labelEmails();
//       setEmails(labeledEmails);
//     }
//     setTimeout(() => setIsClassifying(false), 60000);
//   };

//   const handleBlockColdEmails = async () => {
//     setIsBlocking(true);
//     try {
//       const response = await fetch('/api/Rules/ColdEmail/BlockCold', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: user.email }),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to block cold emails');
//       }
//       const data = await response.json();
//       setEmails((prevEmails) => prevEmails.filter(email => !data.blockedEmails.includes(email.id)));
//     } catch (error) {
//       console.error('Error blocking cold emails:', error.message);
//     } finally {
//       setIsBlocking(false);
//     }
//   };

//   const handleOpenMessage = async (message) => {
//     if (message && message.threadId) {
//       try {
//         if (!message.isRead) {
//           await markAsRead(message.id);
//         }
//         setSelectedMessage(message);
//         await fetchThread(message.threadId);
//       } catch (error) {
//         console.error('Error opening message:', error.message);
//       }
//     }
//   };

//   const markAsRead = async (messageId) => {
//     try {
//       await fetch(`/api/messages/markAsRead?email=${encodeURIComponent(user.email)}&id=${messageId}&read=true`, {
//         method: 'POST',
//       });
//       setEmails((prevEmails) =>
//         prevEmails.map((email) => (email.id === messageId ? { ...email, isRead: true } : email))
//       );
//     } catch (error) {
//       console.error('Error marking email as read:', error.message);

//       setSelectedMessage(message);
//       fetchThread(message.threadId);
//     }
//   };

//   const fetchThread = async (threadId) => {
//     try {
//       const response = await fetch(
//         `/api/auth/google/fetchThreads?email=${encodeURIComponent(user.email)}&threadId=${threadId}`
//       );
//       if (!response.ok) {
//         throw new Error('Failed to fetch thread');
//       }
//       const data = await response.json();
//       setThreadMessages(data.messages || []);
//     } catch (error) {
//       console.error('Error fetching thread:', error.message);
//     }
//   };

//   const handleCloseMessage = () => {
//     setSelectedMessage(null);
//     setThreadMessages([]);
//   };

//   const handleBackToInbox = () => {
//     setEmails([]);
//     const label = getGmailLabel('inbox');
//     fetchEmails(label, user.email);
//   };

//   const openComposeModal = () => {
//     setIsComposeOpen(true);
//   };

//   const closeComposeModal = () => {
//     setIsComposeOpen(false);
//   };

//   const handleLoadMore = () => {
//     const label = getGmailLabel(slug);
//     if (user?.email && nextPageToken) {
//       fetchEmails(label, user.email, nextPageToken);
//     }
//   };

//   useEffect(() => {
//     if (user && slug) {
//       const label = getGmailLabel(slug);
//       fetchEmails(label, user.email);
//     }
//   }, [slug, user]);

//   if (isLoading || !user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-500">Loading user info...</p>
//       </div>
//     );
//   }

//   const handleSearchSubmit = async (query) => {
//     setEmails([]);
//     setLoading(true);
//     const label = getGmailLabel(slug);
//     try {
//       const url = `/api/auth/google/fetchEmails?label=${label}&email=${encodeURIComponent(user?.email)}&query=${encodeURIComponent(query)}`;
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Error fetching emails');
//       const data = await response.json();
//       setEmails(data.messages || []);
//     } catch (error) {
//       console.error('Error fetching emails:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar labelCounts={labelCounts} />
//       <div className="flex-grow p-6 overflow-y-auto">
//         <h1 className="text-3xl font-bold capitalize mb-4 text-gray-900">{slug}</h1>

//         {!selectedMessage && (
//           <>
//             <Search
//               userEmail={user?.email}
//               onSearchSubmit={(query) => {
//                 console.log('Search query submitted:', query);
//                 const label = getGmailLabel(slug);
//                 fetchEmails(label, user?.email, query);
//               }}
//             />

//             <div className="flex mb-5 space-x-4">
//               <button
//                 className="bg-black text-white px-5 py-3 rounded-lg shadow hover:bg-gray-800 transition"
//                 onClick={openComposeModal}
//               >
//                 Compose
//               </button>
//               <button
//                 onClick={handleLabelEmails}
//                 disabled={isClassifying}
//                 className={`px-5 py-3 rounded-lg shadow ${isClassifying ? 'bg-gray-400' : 'bg-transparent text-black border'} transition`}
//               >
//                 {isClassifying ? 'Labeling...' : 'Label Emails'}
//               </button>
//               <button
//                 onClick={handleBlockColdEmails}
//                 disabled={isBlocking}
//                 className={`px-5 py-3 rounded-lg shadow ${isBlocking ? 'bg-gray-400' : 'bg-transparent text-black border'} transition`}
//               >
//                 {isBlocking ? 'Blocking...' : 'Block Cold Emails'}
//               </button>
//             </div>
//           </>
//         )}

//         {slug === 'drafts' ? (
//           <Drafts email={user?.email} />
//         ) : loading && emails.length === 0 ? (
//           <p className="text-gray-600">Loading emails...</p>
//         ) : selectedMessage ? (
//           <MessageDetails
//             selectedMessage={selectedMessage}
//             threadMessages={threadMessages}
//             handleCloseMessage={handleCloseMessage}
//             onDeleteMessage={() => setEmails(emails.filter((e) => e.id !== selectedMessage.id))}
//           />
//         ) : emails.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-lg text-gray-500">No emails found for {slug}</p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 gap-4">
//               {emails.map((email) => (
//                 <div
//                   key={email.id}
//                   className={`relative p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer ${email.isRead
//                     ? 'bg-gray-300 text-gray-900'
//                     : 'bg-white text-gray-900'} ${email.category === 'Spam' ? 'border border-red-500' : ''}`}
//                   onClick={() => handleOpenMessage(email)}
//                 >
//                   <h2 className="font-bold text-xl mb-2">{email.subject || '(No Subject)'}</h2>
//                   <p className="text-sm text-gray-500 truncate">From: {email.from}</p>
//                   <p className="text-gray-600 mt-2 truncate">{email.snippet}</p>

//                   {email.priority && (
//                     <FaExclamationCircle
//                       className={`absolute top-2 right-2 ${email.priority === 'High Priority' ? 'text-red-500' : 'text-green-500'}`}
//                       size={20}
//                     />
//                   )}

//                 </div>
//               ))}
//             </div>
//             {nextPageToken && (
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
//                 onClick={handleLoadMore}
//               >
//                 Load More
//               </button>
//             )}
//           </>
//         )}
//       </div>

//       <Compose isOpen={isComposeOpen} onClose={closeComposeModal} userEmail={user?.email} />
//     </div>
//   );
// };

// export default DashboardPage;



























//VERSION 1






// 'use client';

// import { useRouter, useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import Sidebar from '../components/Sidebar';
// import MessageDetails from '../components/MessageDetails';
// import Compose from '../components/Compose';
// import { FaExclamationCircle, FaSearch } from 'react-icons/fa';
// import Search from '../components/search';
// import Drafts from './components/Drafts';

// const DashboardPage = () => {
//   const router = useRouter();
//   const { slug } = useParams();
//   const { user, isLoading } = useUser();
//   const [emails, setEmails] = useState([]);
//   const [labelCounts, setLabelCounts] = useState({});
//   const [nextPageToken, setNextPageToken] = useState(null);
//   const [threadMessages, setThreadMessages] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [isComposeOpen, setIsComposeOpen] = useState(false);
//   const [isClassifying, setIsClassifying] = useState(false);
//   const [isBlocking, setIsBlocking] = useState(false);
//   const [composeData, setComposeData] = useState(null); // State to hold draft data for Compose

//   useEffect(() => {
//     if (!slug) {
//       router.replace('/dashboard/inbox');
//     }
//   }, [slug, router]);

//   const getGmailLabel = (slug) => {
//     switch (slug) {
//       case 'inbox':
//         return 'INBOX';
//       case 'promotions':
//         return 'CATEGORY_PROMOTIONS';
//       case 'social':
//         return 'CATEGORY_SOCIAL';
//       case 'spam':
//         return 'SPAM';
//       case 'trash':
//         return 'TRASH';
//       case 'sent':
//         return 'SENT';
//       case 'drafts':
//         return 'DRAFT';
//       case 'starred':
//         return 'STARRED';
//       default:
//         return 'INBOX';
//     }
//   };

//   const fetchEmails = async (label, email, query = '', pageToken = null) => {
//     try {
//       const url = `/api/auth/google/fetchEmails?label=${label}&email=${encodeURIComponent(email)}${query ? `&query=${encodeURIComponent(query)}` : ''
//         }${pageToken ? `&pageToken=${pageToken}` : ''}`;

//       console.log('Fetching emails with URL:', url); // Debugging
//       const response = await fetch(url);
//       const data = await response.json();
//       setEmails(data.messages || []);
//     } catch (error) {
//       console.error('Error fetching emails:', error.message);
//     }
//   };

//   const classifyEmails = async (emails) => {
//     const classifiedEmails = [];

//     for (const email of emails) {
//       try {
//         const emailContent = {
//           subject: truncateContent(email.subject || '', 800), // Limit each part to prevent overflow
//           body: truncateContent(email.snippet || '', 800),
//         };

//         console.log('Sending email for classification:', emailContent);

//         const response = await fetch('/api/ai/email/classifyEmail', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email: emailContent }),
//         });

//         if (!response.ok) {
//           throw new Error('Classification failed');
//         }

//         const { priority } = await response.json();
//         classifiedEmails.push({ ...email, priority });
//       } catch (error) {
//         if (error.message.includes('context_length_exceeded')) {
//           console.warn(`Skipping email with ID ${email.id} due to token limit`);
//           classifiedEmails.push({ ...email, priority: 'Low Priority' });
//         } else {
//           console.error(`Error classifying email with ID ${email.id}:`, error.message);
//           classifiedEmails.push({ ...email, priority: 'Low Priority' });
//         }
//       }
//     }

//     return classifiedEmails;
//   };

//   const truncateContent = (text, limit) => {
//     return text.length > limit ? text.slice(0, limit - 1) + '…' : text;
//   };

//   const labelEmails = async () => {
//     return await Promise.all(
//       emails.map(async (email) => {
//         try {
//           const emailContent = { id: email.id, subject: email.subject, body: email.snippet };
//           const response = await fetch('/api/ai/email/labeling', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email: emailContent }),
//           });
//           const { category } = await response.json();
//           return { ...email, category };
//         } catch (error) {
//           console.error('Error labeling email:', error.message);
//           return { ...email, category: 'Unclassified' };
//         }
//       })
//     );
//   };

//   const handleLabelEmails = async () => {
//     setIsClassifying(true);
//     const label = getGmailLabel(slug);
//     if (user?.email) {
//       const labeledEmails = await labelEmails();
//       setEmails(labeledEmails);
//     }
//     setTimeout(() => setIsClassifying(false), 60000);
//   };

//   const handleBlockColdEmails = async () => {
//     setIsBlocking(true);
//     try {
//       const response = await fetch('/api/Rules/ColdEmail/BlockCold', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: user.email }),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to block cold emails');
//       }
//       const data = await response.json();
//       setEmails((prevEmails) => prevEmails.filter(email => !data.blockedEmails.includes(email.id)));
//     } catch (error) {
//       console.error('Error blocking cold emails:', error.message);
//     } finally {
//       setIsBlocking(false);
//     }
//   };

//   const handleOpenMessage = async (message) => {
//     if (message && message.threadId) {
//       try {
//         if (!message.isRead) {
//           await markAsRead(message.id);
//         }
//         setSelectedMessage(message);
//         await fetchThread(message.threadId);
//       } catch (error) {
//         console.error('Error opening message:', error.message);
//       }
//     }
//   };

//   const markAsRead = async (messageId) => {
//     try {
//       await fetch(`/api/messages/markAsRead?email=${encodeURIComponent(user.email)}&id=${messageId}&read=true`, {
//         method: 'POST',
//       });
//       setEmails((prevEmails) =>
//         prevEmails.map((email) => (email.id === messageId ? { ...email, isRead: true } : email))
//       );
//     } catch (error) {
//       console.error('Error marking email as read:', error.message);

//       setSelectedMessage(message);
//       fetchThread(message.threadId);
//     }
//   };

//   const fetchThread = async (threadId) => {
//     try {
//       const response = await fetch(
//         `/api/auth/google/fetchThreads?email=${encodeURIComponent(user.email)}&threadId=${threadId}`
//       );
//       if (!response.ok) {
//         throw new Error('Failed to fetch thread');
//       }
//       const data = await response.json();
//       setThreadMessages(data.messages || []);
//     } catch (error) {
//       console.error('Error fetching thread:', error.message);
//     }
//   };

//   const handleCloseMessage = () => {
//     setSelectedMessage(null);
//     setThreadMessages([]);
//   };

//   const handleBackToInbox = () => {
//     setEmails([]);
//     const label = getGmailLabel('inbox');
//     fetchEmails(label, user.email);
//   };

//   const openComposeModal = () => {
//     setIsComposeOpen(true);
//   };

//   const closeComposeModal = () => {
//     setComposeData(null); // Clear draft data
//     setIsComposeOpen(false);
//   };

//   const handleDraftClick = (draft) => {
//     setComposeData(draft); // Pass draft data to Compose
//     setIsComposeOpen(true); // Open the Compose modal
//   };

//   const handleLoadMore = () => {
//     const label = getGmailLabel(slug);
//     if (user?.email && nextPageToken) {
//       fetchEmails(label, user.email, nextPageToken);
//     }
//   };

//   useEffect(() => {
//     if (user && slug) {
//       const label = getGmailLabel(slug);
//       fetchEmails(label, user.email);
//     }
//   }, [slug, user]);

//   if (isLoading || !user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-500">Loading user info...</p>
//       </div>
//     );
//   }

//   const handleSearchSubmit = async (query) => {
//     setEmails([]);
//     setLoading(true);
//     const label = getGmailLabel(slug);
//     try {
//       const url = `/api/auth/google/fetchEmails?label=${label}&email=${encodeURIComponent(user?.email)}&query=${encodeURIComponent(query)}`;
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Error fetching emails');
//       const data = await response.json();
//       setEmails(data.messages || []);
//     } catch (error) {
//       console.error('Error fetching emails:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar labelCounts={labelCounts} />
//       <div className="flex-grow p-6 overflow-y-auto">
//         <h1 className="text-3xl font-bold capitalize mb-4 text-gray-900">{slug}</h1>

//         {!selectedMessage && (
//           <>
//             <Search
//               userEmail={user?.email}
//               onSearchSubmit={(query) => {
//                 console.log('Search query submitted:', query);
//                 const label = getGmailLabel(slug);
//                 fetchEmails(label, user?.email, query);
//               }}
//             />

//             <div className="flex mb-5 space-x-4">
//               <button
//                 className="bg-black text-white px-5 py-3 rounded-lg shadow hover:bg-gray-800 transition"
//                 onClick={openComposeModal}
//               >
//                 Compose
//               </button>
//               <button
//                 onClick={handleLabelEmails}
//                 disabled={isClassifying}
//                 className={`px-5 py-3 rounded-lg shadow ${isClassifying ? 'bg-gray-400' : 'bg-transparent text-black border'} transition`}
//               >
//                 {isClassifying ? 'Labeling...' : 'Label Emails'}
//               </button>
//               <button
//                 onClick={handleBlockColdEmails}
//                 disabled={isBlocking}
//                 className={`px-5 py-3 rounded-lg shadow ${isBlocking ? 'bg-gray-400' : 'bg-transparent text-black border'} transition`}
//               >
//                 {isBlocking ? 'Blocking...' : 'Block Cold Emails'}
//               </button>
//             </div>
//           </>
//         )}

//         {slug === 'drafts' ? (
//           <Drafts email={user?.email} onDraftClick={handleDraftClick} />
//         ) : loading && emails.length === 0 ? (
//           <p className="text-gray-600">Loading emails...</p>
//         ) : selectedMessage ? (
//           <MessageDetails
//             selectedMessage={selectedMessage}
//             threadMessages={threadMessages}
//             handleCloseMessage={handleCloseMessage}
//             onDeleteMessage={() => setEmails(emails.filter((e) => e.id !== selectedMessage.id))}
//           />
//         ) : emails.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-lg text-gray-500">No emails found for {slug}</p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 gap-4">
//               {emails.map((email) => (
//                 <div
//                   key={email.id}
//                   className={`relative p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer ${email.isRead
//                     ? 'bg-gray-300 text-gray-900'
//                     : 'bg-white text-gray-900'} ${email.category === 'Spam' ? 'border border-red-500' : ''}`}
//                   onClick={() => handleOpenMessage(email)}
//                 >
//                   <h2 className="font-bold text-xl mb-2">{email.subject || '(No Subject)'}</h2>
//                   <p className="text-sm text-gray-500 truncate">From: {email.from}</p>
//                   <p className="text-gray-600 mt-2 truncate">{email.snippet}</p>

//                   {email.priority && (
//                     <FaExclamationCircle
//                       className={`absolute top-2 right-2 ${email.priority === 'High Priority' ? 'text-red-500' : 'text-green-500'}`}
//                       size={20}
//                     />
//                   )}

//                 </div>
//               ))}
//             </div>
//             {nextPageToken && (
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
//                 onClick={handleLoadMore}
//               >
//                 Load More
//               </button>
//             )}
//           </>
//         )}
//       </div>

//       <Compose isOpen={isComposeOpen} onClose={closeComposeModal} userEmail={user?.email} draftData={composeData} />
//     </div>
//   );
// };

// export default DashboardPage;















// VERSION 2


'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Sidebar from '../components/Sidebar';
import MessageDetails from '../components/MessageDetails';
import Compose from '../components/Compose';
import { FaExclamationCircle, FaSearch, FaInbox, FaSpinner } from 'react-icons/fa';
import Search from '../components/search';
import Drafts from './components/Drafts';

const DashboardPage = () => {
  const router = useRouter();
  const { slug } = useParams();
  const { user, isLoading } = useUser();
  const [emails, setEmails] = useState([]);
  const [labelCounts, setLabelCounts] = useState({});
  const [nextPageToken, setNextPageToken] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [composeData, setComposeData] = useState(null);

  useEffect(() => {
    if (!slug) {
      router.replace('/dashboard/inbox');
    }
  }, [slug, router]);

  const getGmailLabel = (slug) => {
    switch (slug) {
      case 'inbox':
        return 'INBOX';
      case 'promotions':
        return 'CATEGORY_PROMOTIONS';
      case 'social':
        return 'CATEGORY_SOCIAL';
      case 'spam':
        return 'SPAM';
      case 'trash':
        return 'TRASH';
      case 'sent':
        return 'SENT';
      case 'drafts':
        return 'DRAFT';
      case 'starred':
        return 'STARRED';
      default:
        return 'INBOX';
    }
  };

  const fetchEmails = async (label, email, query = '', pageToken = null) => {
    try {
      const url = `/api/auth/google/fetchEmails?label=${label}&email=${encodeURIComponent(email)}${query ? `&query=${encodeURIComponent(query)}` : ''
        }${pageToken ? `&pageToken=${pageToken}` : ''}`;

      console.log('Fetching emails with URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      setEmails(data.messages || []);
    } catch (error) {
      console.error('Error fetching emails:', error.message);
    }
  };

  const classifyEmails = async (emails) => {
    const classifiedEmails = [];

    for (const email of emails) {
      try {
        const emailContent = {
          subject: truncateContent(email.subject || '', 800),
          body: truncateContent(email.snippet || '', 800),
        };

        console.log('Sending email for classification:', emailContent);

        const response = await fetch('/api/ai/email/classifyEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailContent }),
        });

        if (!response.ok) {
          throw new Error('Classification failed');
        }

        const { priority } = await response.json();
        classifiedEmails.push({ ...email, priority });
      } catch (error) {
        if (error.message.includes('context_length_exceeded')) {
          console.warn(`Skipping email with ID ${email.id} due to token limit`);
          classifiedEmails.push({ ...email, priority: 'Low Priority' });
        } else {
          console.error(`Error classifying email with ID ${email.id}:`, error.message);
          classifiedEmails.push({ ...email, priority: 'Low Priority' });
        }
      }
    }

    return classifiedEmails;
  };

  const truncateContent = (text, limit) => {
    return text.length > limit ? text.slice(0, limit - 1) + '…' : text;
  };

  const labelEmails = async () => {
    return await Promise.all(
      emails.map(async (email) => {
        try {
          const emailContent = { id: email.id, subject: email.subject, body: email.snippet };
          const response = await fetch('/api/ai/email/labeling', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailContent }),
          });
          const { category } = await response.json();
          return { ...email, category };
        } catch (error) {
          console.error('Error labeling email:', error.message);
          return { ...email, category: 'Unclassified' };
        }
      })
    );
  };

  const handleLabelEmails = async () => {
    setIsClassifying(true);
    const label = getGmailLabel(slug);
    if (user?.email) {
      const labeledEmails = await labelEmails();
      setEmails(labeledEmails);
    }
    setTimeout(() => setIsClassifying(false), 60000);
  };

  const handleBlockColdEmails = async () => {
    setIsBlocking(true);
    try {
      const response = await fetch('/api/Rules/ColdEmail/BlockCold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      if (!response.ok) {
        throw new Error('Failed to block cold emails');
      }
      const data = await response.json();
      setEmails((prevEmails) => prevEmails.filter(email => !data.blockedEmails.includes(email.id)));
    } catch (error) {
      console.error('Error blocking cold emails:', error.message);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleOpenMessage = async (message) => {
    if (message && message.threadId) {
      try {
        if (!message.isRead) {
          await markAsRead(message.id);
        }
        setSelectedMessage(message);
        await fetchThread(message.threadId);
      } catch (error) {
        console.error('Error opening message:', error.message);
      }
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await fetch(`/api/messages/markAsRead?email=${encodeURIComponent(user.email)}&id=${messageId}&read=true`, {
        method: 'POST',
      });
      setEmails((prevEmails) =>
        prevEmails.map((email) => (email.id === messageId ? { ...email, isRead: true } : email))
      );
    } catch (error) {
      console.error('Error marking email as read:', error.message);
    }
  };

  const fetchThread = async (threadId) => {
    try {
      const response = await fetch(
        `/api/auth/google/fetchThreads?email=${encodeURIComponent(user.email)}&threadId=${threadId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch thread');
      }
      const data = await response.json();
      setThreadMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching thread:', error.message);
    }
  };

  const handleCloseMessage = () => {
    setSelectedMessage(null);
    setThreadMessages([]);
  };

  const handleBackToInbox = () => {
    setEmails([]);
    const label = getGmailLabel('inbox');
    fetchEmails(label, user.email);
  };

  const openComposeModal = () => {
    setIsComposeOpen(true);
  };

  const closeComposeModal = () => {
    setComposeData(null);
    setIsComposeOpen(false);
  };

  const handleDraftClick = (draft) => {
    setComposeData(draft);
    setIsComposeOpen(true);
  };

  const handleLoadMore = () => {
    const label = getGmailLabel(slug);
    if (user?.email && nextPageToken) {
      fetchEmails(label, user.email, nextPageToken);
    }
  };

  useEffect(() => {
    if (user && slug) {
      const label = getGmailLabel(slug);
      fetchEmails(label, user.email);
    }
  }, [slug, user]);

  const handleSearchSubmit = async (query) => {
    setEmails([]);
    setLoading(true);
    const label = getGmailLabel(slug);
    try {
      const url = `/api/auth/google/fetchEmails?label=${label}&email=${encodeURIComponent(user?.email)}&query=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error fetching emails');
      const data = await response.json();
      setEmails(data.messages || []);
    } catch (error) {
      console.error('Error fetching emails:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="animate-spin text-blue-600 text-4xl" />
          <p className="text-gray-600 font-medium">Loading user info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <Sidebar labelCounts={labelCounts} /> */}
      {!selectedMessage && <Sidebar labelCounts={labelCounts} />}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        {!selectedMessage && (
  <div className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900 capitalize">{slug}</h1>
      <div className="flex items-center space-x-4">
        <button
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 font-medium"
          onClick={openComposeModal}
        >
          Compose
        </button>
        <button
          onClick={handleLabelEmails}
          disabled={isClassifying}
          className={`px-4 py-2.5 rounded-lg shadow-sm font-medium transition-colors duration-200 
            ${isClassifying
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          {isClassifying ? 'Labeling...' : 'Label Emails'}
        </button>
        <button
          onClick={handleBlockColdEmails}
          disabled={isBlocking}
          className={`px-4 py-2.5 rounded-lg shadow-sm font-medium transition-colors duration-200
            ${isBlocking
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          {isBlocking ? 'Blocking...' : 'Block Cold Emails'}
        </button>
      </div>
    </div>

    <div className="mt-4">
      <Search
        userEmail={user?.email}
        onSearchSubmit={(query) => {
          console.log('Search query submitted:', query);
          const label = getGmailLabel(slug);
          fetchEmails(label, user?.email, query);
        }}
      />
    </div>
  </div>
)}


        {/* Main Content Area */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {slug === 'drafts' ? (
            <Drafts email={user?.email} onDraftClick={handleDraftClick} />
          ) : loading && emails.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            </div>
          ) : selectedMessage ? (
            <MessageDetails
              selectedMessage={selectedMessage}
              threadMessages={threadMessages}
              handleCloseMessage={handleCloseMessage}
              onDeleteMessage={() => setEmails(emails.filter((e) => e.id !== selectedMessage.id))}
            />
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FaInbox className="text-6xl mb-4" />
              <p className="text-xl">No emails found in {slug}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleOpenMessage(email)}
                  className={`
                    group relative p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                    ${email.isRead ? 'bg-white' : 'bg-blue-50 border-l-4 border-blue-600'}
                    ${email.category === 'Spam' ? 'border border-red-200 bg-red-50' : ''}
                  `}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {email.from?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                          {email.subject || '(No Subject)'}
                        </h2>
                        {email.priority && (
                          <FaExclamationCircle
                            className={`${email.priority === 'High Priority' ? 'text-red-500' : 'text-green-500'
                              }`}
                            size={20}
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">From: {email.from}</p>
                      <p className="text-gray-700 mt-2 line-clamp-2">{email.snippet}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {nextPageToken && (
            <button
              className="w-full mt-4 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium shadow-sm"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <Compose
        isOpen={isComposeOpen}
        onClose={closeComposeModal}
        userEmail={user?.email}
        draftData={composeData}
      />
    </div>
  );
};

export default DashboardPage;











