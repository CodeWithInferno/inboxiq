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


































'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Sidebar from '../components/Sidebar';
import MessageDetails from '../components/MessageDetails';
import Compose from '../components/Compose';
import { FaExclamationCircle, FaSearch } from 'react-icons/fa';
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
  const [composeData, setComposeData] = useState(null); // State to hold draft data for Compose

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

      console.log('Fetching emails with URL:', url); // Debugging
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
          subject: truncateContent(email.subject || '', 800), // Limit each part to prevent overflow
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

      setSelectedMessage(message);
      fetchThread(message.threadId);
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
    setComposeData(null); // Clear draft data
    setIsComposeOpen(false);
  };

  const handleDraftClick = (draft) => {
    setComposeData(draft); // Pass draft data to Compose
    setIsComposeOpen(true); // Open the Compose modal
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

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading user info...</p>
      </div>
    );
  }

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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar labelCounts={labelCounts} />
      <div className="flex-grow p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold capitalize mb-4 text-gray-900">{slug}</h1>

        {!selectedMessage && (
          <>
            <Search
              userEmail={user?.email}
              onSearchSubmit={(query) => {
                console.log('Search query submitted:', query);
                const label = getGmailLabel(slug);
                fetchEmails(label, user?.email, query);
              }}
            />

            <div className="flex mb-5 space-x-4">
              <button
                className="bg-black text-white px-5 py-3 rounded-lg shadow hover:bg-gray-800 transition"
                onClick={openComposeModal}
              >
                Compose
              </button>
              <button
                onClick={handleLabelEmails}
                disabled={isClassifying}
                className={`px-5 py-3 rounded-lg shadow ${isClassifying ? 'bg-gray-400' : 'bg-transparent text-black border'} transition`}
              >
                {isClassifying ? 'Labeling...' : 'Label Emails'}
              </button>
              <button
                onClick={handleBlockColdEmails}
                disabled={isBlocking}
                className={`px-5 py-3 rounded-lg shadow ${isBlocking ? 'bg-gray-400' : 'bg-transparent text-black border'} transition`}
              >
                {isBlocking ? 'Blocking...' : 'Block Cold Emails'}
              </button>
            </div>
          </>
        )}

        {slug === 'drafts' ? (
          <Drafts email={user?.email} onDraftClick={handleDraftClick} />
        ) : loading && emails.length === 0 ? (
          <p className="text-gray-600">Loading emails...</p>
        ) : selectedMessage ? (
          <MessageDetails
            selectedMessage={selectedMessage}
            threadMessages={threadMessages}
            handleCloseMessage={handleCloseMessage}
            onDeleteMessage={() => setEmails(emails.filter((e) => e.id !== selectedMessage.id))}
          />
        ) : emails.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-500">No emails found for {slug}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`relative p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer ${email.isRead
                    ? 'bg-gray-300 text-gray-900'
                    : 'bg-white text-gray-900'} ${email.category === 'Spam' ? 'border border-red-500' : ''}`}
                  onClick={() => handleOpenMessage(email)}
                >
                  <h2 className="font-bold text-xl mb-2">{email.subject || '(No Subject)'}</h2>
                  <p className="text-sm text-gray-500 truncate">From: {email.from}</p>
                  <p className="text-gray-600 mt-2 truncate">{email.snippet}</p>

                  {email.priority && (
                    <FaExclamationCircle
                      className={`absolute top-2 right-2 ${email.priority === 'High Priority' ? 'text-red-500' : 'text-green-500'}`}
                      size={20}
                    />
                  )}

                </div>
              ))}
            </div>
            {nextPageToken && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            )}
          </>
        )}
      </div>

      <Compose isOpen={isComposeOpen} onClose={closeComposeModal} userEmail={user?.email} draftData={composeData} />
    </div>
  );
};

export default DashboardPage;
