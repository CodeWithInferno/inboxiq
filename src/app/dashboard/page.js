// 'use client';

// import { useEffect, useState } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import Sidebar from './components/Sidebar';
// import InboxList from './components/InboxList';
// import MessageDetails from './components/MessageDetails';
// import SendMessage from './components/SendMessage';

// const Dashboard = () => {
//   const { user, isLoading } = useUser();
//   const [userData, setUserData] = useState(null);
//   const [inbox, setInbox] = useState([]);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [isComposeOpen, setIsComposeOpen] = useState(false);

//   useEffect(() => {
//     if (user) {
//       const fetchUserData = async () => {
//         try {
//           const response = await fetch('/api/user/me');
//           const data = await response.json();
//           setUserData(data);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       };

//       const fetchInbox = async () => {
//         try {
//           const response = await fetch(`/api/auth/google/fetchEmails?email=${user.email}`);
//           const data = await response.json();
//           setInbox(data.messages);
//         } catch (error) {
//           console.error('Error fetching user inbox:', error);
//         }
//       };

//       fetchUserData();
//       fetchInbox();
//     }
//   }, [user]);

//   const handleCompose = () => {
//     setIsComposeOpen(true);
//   };

//   const handleSendClose = () => {
//     setIsComposeOpen(false);
//   };

//   const handleOpenMessage = (message) => {
//     setSelectedMessage(message);
//   };

//   const handleCloseMessage = () => {
//     setSelectedMessage(null);
//   };

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (!user) {
//     return <p>You need to be logged in to view your dashboard.</p>;
//   }

//   return (
//     <div className="flex h-screen">
//       <Sidebar userEmail={userData?.email || user.email} />

//       <div className="flex flex-col flex-grow">
//         {selectedMessage ? (
//           <MessageDetails
//             selectedMessage={selectedMessage}
//             handleCloseMessage={handleCloseMessage}
//           />
//         ) : (
//           <InboxList
//             inbox={inbox}
//             handleCompose={handleCompose}
//             handleOpenMessage={handleOpenMessage}
//           />
//         )}
//       </div>

//       {isComposeOpen && (
//         <SendMessage
//           user={user}
//           onClose={handleSendClose}
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;






// 'use client';

// import { useEffect, useState } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import Sidebar from './components/Sidebar';
// import InboxList from './components/InboxList';
// import MessageDetails from './components/MessageDetails';
// import SendMessage from './components/SendMessage';

// const Dashboard = () => {
//   const { user, isLoading } = useUser();
//   const [userData, setUserData] = useState(null);
//   const [inbox, setInbox] = useState([]);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [isComposeOpen, setIsComposeOpen] = useState(false);

//   useEffect(() => {
//     if (user) {
//       const fetchUserData = async () => {
//         try {
//           const response = await fetch('/api/user/me');
//           const data = await response.json();
//           setUserData(data);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       };

//       const fetchInbox = async () => {
//         try {
//           const response = await fetch(`/api/auth/google/fetchEmails?email=${user.email}`);
//           const data = await response.json();
//           setInbox(data.messages);
//         } catch (error) {
//           console.error('Error fetching user inbox:', error);
//         }
//       };

//       fetchUserData();
//       fetchInbox();
//     }
//   }, [user]);

//   const handleCompose = () => {
//     setIsComposeOpen(true);
//   };

//   const handleSendClose = () => {
//     setIsComposeOpen(false);
//   };

//   const handleOpenMessage = (message) => {
//     setSelectedMessage(message);
//   };

//   const handleCloseMessage = () => {
//     setSelectedMessage(null);
//   };

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (!user) {
//     return <p>You need to be logged in to view your dashboard.</p>;
//   }

//   return (
//     <div className="flex h-screen">
//       <Sidebar userEmail={userData?.email || user.email} />

//       <div className="flex flex-col flex-grow">
//         {selectedMessage ? (
//           <MessageDetails
//             selectedMessage={selectedMessage}
//             handleCloseMessage={handleCloseMessage}
//           />
//         ) : (
//           <InboxList
//             inbox={inbox}
//             handleCompose={handleCompose}
//             handleOpenMessage={handleOpenMessage}
//           />
//         )}
//       </div>

//       {isComposeOpen && (
//         <SendMessage
//           user={user}
//           onClose={handleSendClose}
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;





'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Sidebar from './components/Sidebar';
import InboxList from './components/InboxList';
import MessageDetails from './components/MessageDetails';
import SendMessage from './components/SendMessage';

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/user/me');
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      const fetchInbox = async () => {
        try {
          const response = await fetch(`/api/auth/google/fetchEmails?email=${user.email}`);
          const data = await response.json();
          setInbox(data.messages);
        } catch (error) {
          console.error('Error fetching user inbox:', error);
        }
      };

      fetchUserData();
      fetchInbox();
    }
  }, [user]);

  const handleCompose = () => {
    setIsComposeOpen(true);
  };

  const handleSendClose = () => {
    setIsComposeOpen(false);
  };

  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
  };

  const handleCloseMessage = () => {
    setSelectedMessage(null);
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
        {selectedMessage ? (
          <MessageDetails
            selectedMessage={selectedMessage}
            handleCloseMessage={handleCloseMessage}
          />
        ) : (
          <InboxList
            inbox={inbox}
            handleCompose={handleCompose}
            handleOpenMessage={handleOpenMessage}
          />
        )}
      </div>

      {isComposeOpen && (
        <SendMessage
          user={user}
          onClose={handleSendClose}
        />
      )}
    </div>
  );
};

export default Dashboard;
