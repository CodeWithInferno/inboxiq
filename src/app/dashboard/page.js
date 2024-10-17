// // app/dashboard/page.js
'use client';
// import { useEffect, useState } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import axios from 'axios';

// const Dashboard = () => {
//   const { user, isLoading } = useUser();
//   const [userData, setUserData] = useState(null);
//   const [inbox, setInbox] = useState([]);
//   const [message, setMessage] = useState({
//     to: '',
//     subject: '',
//     body: '',
//   });

//   useEffect(() => {
//     if (user) {
//       // Fetch user data
//       const fetchUserData = async () => {
//         try {
//           const response = await axios.get('/api/user/me');
//           setUserData(response.data);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       };

//       // Fetch user's inbox
//       const fetchInbox = async () => {
//         try {
//           const response = await axios.get('/api/messages/inbox');
//           setInbox(response.data.messages);
//         } catch (error) {
//           console.error('Error fetching inbox:', error);
//         }
//       };

//       fetchUserData();
//       fetchInbox();
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage({ ...message, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/messages/send', message);
//       console.log('Message sent:', response.data);
//       // Optionally, refresh the inbox after sending the message
//       const responseInbox = await axios.get('/api/messages/inbox');
//       setInbox(responseInbox.data.messages);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

// // In the existing dashboard component

// const toggleReadStatus = async (messageId, currentStatus) => {
//     try {
//       const response = await axios.patch('/api/messages/read', {
//         messageId,
//         isRead: !currentStatus,
//       });
//       console.log('Read status updated:', response.data);
//       // Refresh the inbox to show the updated status
//       const responseInbox = await axios.get('/api/messages/inbox');
//       setInbox(responseInbox.data.messages);
//     } catch (error) {
//       console.error('Error updating message status:', error);
//     }
//   };
  
//   const deleteMessage = async (messageId) => {
//     try {
//       await axios.delete('/api/messages/delete', {
//         data: { messageId },
//       });
//       // Refresh the inbox after deletion
//       const responseInbox = await axios.get('/api/messages/inbox');
//       setInbox(responseInbox.data.messages);
//     } catch (error) {
//       console.error('Error deleting message:', error);
//     }
//   };
  
//   // Inside the inbox.map() method:
//   <div className="flex justify-between items-center p-4 border rounded-lg shadow-md">
//     <div>
//       <h3 className={`font-bold ${message.isRead ? 'text-gray-500' : 'text-black'}`}>
//         {message.subject}
//       </h3>
//       <p className="text-sm text-gray-600">From: {message.from}</p>
//       <p className="mt-2">{message.body}</p>
//       <p className="text-xs text-gray-500 mt-2">
//         Sent on: {new Date(message.timestamp).toLocaleString()}
//       </p>
//     </div>
//     <div className="ml-4 flex space-x-2">
//       <button
//         className="text-blue-500 hover:text-blue-700"
//         onClick={() => toggleReadStatus(message._id, message.isRead)}
//       >
//         Mark as {message.isRead ? 'Unread' : 'Read'}
//       </button>
//       <button
//         className="text-red-500 hover:text-red-700"
//         onClick={() => deleteMessage(message._id)}
//       >
//         Delete
//       </button>
//     </div>
//   </div>
  

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (!user) {
//     return <p>You need to be logged in to view your dashboard.</p>;
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">Welcome, {userData?.name || user.name}!</h1>
//       <img src={userData?.picture || user.picture} alt="Profile" className="rounded-full w-24 h-24 mt-4" />
//       <p className="mt-4">Email: {userData?.email || user.email}</p>

//       <h2 className="text-xl mt-8 mb-4">Send a Message</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="to"
//           placeholder="Recipient's Email"
//           value={message.to}
//           onChange={handleChange}
//           className="p-2 border rounded w-full"
//           required
//         />
//         <input
//           type="text"
//           name="subject"
//           placeholder="Subject"
//           value={message.subject}
//           onChange={handleChange}
//           className="p-2 border rounded w-full"
//           required
//         />
//         <textarea
//           name="body"
//           placeholder="Message Body"
//           value={message.body}
//           onChange={handleChange}
//           className="p-2 border rounded w-full"
//           rows="4"
//           required
//         ></textarea>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Send Message
//         </button>
//       </form>

//       <h2 className="text-xl mt-8 mb-4">Your Inbox</h2>
//       <div className="space-y-4">
//         {inbox.length > 0 ? (
//           inbox.map((message) => (
//             <div className="flex justify-between items-center p-4 border rounded-lg shadow-md">
//   <div>
//     <h3 className={`font-bold ${message.isRead ? 'text-gray-500' : 'text-black'}`}>
//       {message.subject}
//     </h3>
//     <p className="text-sm text-gray-600">From: {message.from}</p>
//     <p className="mt-2">{message.body}</p>
//     <p className="text-xs text-gray-500 mt-2">
//       Sent on: {new Date(message.timestamp).toLocaleString()}
//     </p>
//   </div>
//   <div className="ml-4 flex space-x-2">
//     <button
//       className="text-blue-500 hover:text-blue-700"
//       onClick={() => toggleReadStatus(message._id, message.isRead)}
//     >
//       Mark as {message.isRead ? 'Unread' : 'Read'}
//     </button>
//     <button
//       className="text-red-500 hover:text-red-700"
//       onClick={() => deleteMessage(message._id)}
//     >
//       Delete
//     </button>
//   </div>
// </div>
//           ))
//         ) : (
//           <p>No messages in your inbox.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// src/app/dashboard/page.js
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import InboxList from './components/InboxList';
import MessageDetails from './components/MessageDetails';
import SendMessageModal from './components/SendMessageModal';

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [message, setMessage] = useState({
    to: '',
    subject: '',
    body: '',
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          console.log('Fetching user data...');
          const response = await axios.get('/api/user/me');
          console.log('User data response:', response.data);
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      const fetchInbox = async () => {
        try {
          console.log('Fetching inbox...');
          const userTokens = await getUserTokens(user.email); // Fetch user tokens
          console.log('User tokens:', userTokens);
          const response = await axios.get('/api/google/fetchEmails', {
            params: {
              accessToken: userTokens.access_token,
              refreshToken: userTokens.refresh_token,
            },
          });
          console.log('Inbox response:', response.data);
          setInbox(response.data.messages);
        } catch (error) {
          console.error('Error fetching user emails:', error);
        }
      };

      fetchUserData();
      fetchInbox();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({ ...message, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/messages/send', message);
      setIsComposeOpen(false);
      const responseInbox = await axios.get('/api/messages/inbox');
      setInbox(responseInbox.data.messages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleOpenMessage = (message) => setSelectedMessage(message);
  const handleCloseMessage = () => setSelectedMessage(null);

  const toggleReadStatus = async (messageId, currentStatus) => {
    try {
      await axios.patch('/api/messages/read', {
        messageId,
        isRead: !currentStatus,
      });
      const responseInbox = await axios.get('/api/messages/inbox');
      setInbox(responseInbox.data.messages);
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete('/api/messages/delete', {
        data: { messageId },
      });
      const responseInbox = await axios.get('/api/messages/inbox');
      setInbox(responseInbox.data.messages);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleReply = (message) => {
    setMessage({
      to: message.from,
      subject: `Re: ${message.subject}`,
      body: `\n\n--- Original message ---\n${message.body}`,
    });
    setIsComposeOpen(true);
  };

  const handleForward = (message) => {
    setMessage({
      to: '',
      subject: `Fwd: ${message.subject}`,
      body: `\n\n--- Forwarded message ---\nFrom: ${message.from}\nSent on: ${new Date(
        message.timestamp
      ).toLocaleString()}\n\n${message.body}`,
    });
    setIsComposeOpen(true);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>You need to be logged in to view your dashboard.</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar userEmail={userData?.email || user.email} />
      <div className="flex flex-col flex-grow">
        <div className="flex flex-grow">
          <InboxList
            inbox={inbox}
            toggleReadStatus={toggleReadStatus}
            deleteMessage={deleteMessage}
            handleOpenMessage={handleOpenMessage}
            handleCompose={() => setIsComposeOpen(true)}
          />
          <MessageDetails
            selectedMessage={selectedMessage}
            handleCloseMessage={handleCloseMessage}
            deleteMessage={deleteMessage}
            handleReply={handleReply}
            handleForward={handleForward}
          />
        </div>
      </div>

      <SendMessageModal
        isOpen={isComposeOpen}
        message={message}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
};

export default Dashboard;

// Helper function to fetch user tokens
const getUserTokens = async (email) => {
  try {
    console.log('Fetching tokens for user:', email);
    const response = await axios.get(`/api/user/tokens?email=${email}`);
    console.log('Tokens fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user tokens:', error);
    throw new Error('Failed to get user tokens');
  }
};
