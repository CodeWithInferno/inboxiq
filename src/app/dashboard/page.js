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
import PromotionList from './components/PromotionList';
import SocialList from './components/SocialList';
import SpamList from './components/SpamList';
import MessageDetails from './components/MessageDetails';
import SendMessage from './components/SendMessage';

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [social, setSocial] = useState([]);
  const [spam, setSpam] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);  // This state controls the compose modal
  const [labelCounts, setLabelCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('INBOX');
  const [nextPageToken, setNextPageToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetching Emails Functions (Inbox, Promotions, Social, Spam)
  const fetchInbox = async (pageToken = null) => {
    try {
      const response = await fetch(`/api/auth/google/fetchEmails?email=${user.email}&label=INBOX${pageToken ? `&pageToken=${pageToken}` : ''}`);
      const data = await response.json();
      setInbox((prevInbox) => [...prevInbox, ...data.messages]);
      setLabelCounts(data.labelCounts);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error('Error fetching user inbox:', error);
    }
  };

  const fetchPromotions = async (pageToken = null) => {
    try {
      const response = await fetch(`/api/auth/google/fetchEmails?email=${user.email}&label=CATEGORY_PROMOTIONS${pageToken ? `&pageToken=${pageToken}` : ''}`);
      const data = await response.json();
      setPromotions((prevPromotions) => [...prevPromotions, ...data.messages]);
      setLabelCounts(data.labelCounts);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error('Error fetching promotion emails:', error);
    }
  };

  const fetchSocial = async (pageToken = null) => {
    try {
      const response = await fetch(`/api/auth/google/fetchEmails?email=${user.email}&label=CATEGORY_SOCIAL${pageToken ? `&pageToken=${pageToken}` : ''}`);
      const data = await response.json();
      setSocial((prevSocial) => [...prevSocial, ...data.messages]);
      setLabelCounts(data.labelCounts);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error('Error fetching social emails:', error);
    }
  };

  const fetchSpam = async (pageToken = null) => {
    try {
      const response = await fetch(`/api/auth/google/fetchEmails?email=${user.email}&label=SPAM${pageToken ? `&pageToken=${pageToken}` : ''}`);
      const data = await response.json();
      setSpam((prevSpam) => [...prevSpam, ...data.messages]);
      setLabelCounts(data.labelCounts);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error('Error fetching spam emails:', error);
    }
  };

  // Search Emails
  const searchEmails = async () => {
    if (!searchTerm) return;
    try {
      const response = await fetch(`/api/auth/google/fetchEmails?email=${user.email}&query=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data.messages || []); // Handle empty array if no messages found
    } catch (error) {
      console.error('Error searching emails:', error);
    }
  };

  // Compose Button and Modal Handler
  const handleCompose = () => {
    setIsComposeOpen(true);  // Open the compose modal
  };

  const handleSendClose = () => {
    setIsComposeOpen(false);  // Close the compose modal
  };

  // Go Back to Inbox when Search is Active
  const handleGoBack = () => {
    setSearchResults(null);  // Clear search results and go back to normal inbox view
    setSearchTerm('');  // Clear search term
    setSelectedCategory('INBOX');  // Return to the inbox
  };

  // Message Selection Handlers
  const handleOpenMessage = (message) => {
    setSelectedMessage(message);  // Open the selected message
  };

  const handleCloseMessage = () => {
    setSelectedMessage(null);  // Close the message details view
  };

  // Fetch data when the user is loaded and based on the selected category
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

      fetchUserData();

      if (selectedCategory === 'INBOX') {
        fetchInbox();
      } else if (selectedCategory === 'CATEGORY_PROMOTIONS') {
        fetchPromotions();
      } else if (selectedCategory === 'CATEGORY_SOCIAL') {
        fetchSocial();
      } else if (selectedCategory === 'SPAM') {
        fetchSpam();
      }
    }
  }, [user, selectedCategory]);

  // Load More Emails (Pagination)
  const loadMoreEmails = () => {
    if (nextPageToken) {
      if (selectedCategory === 'INBOX') {
        fetchInbox(nextPageToken);
      } else if (selectedCategory === 'CATEGORY_PROMOTIONS') {
        fetchPromotions(nextPageToken);
      } else if (selectedCategory === 'CATEGORY_SOCIAL') {
        fetchSocial(nextPageToken);
      } else if (selectedCategory === 'SPAM') {
        fetchSpam(nextPageToken);
      }
    }
  };

  // Render Loading or User Not Logged In states
  if (isLoading) {
    return (<div className='min-h-0'>
      <p>Loading...</p>
    </div>);
  }

  if (!user) {
    return <p>You need to be logged in to view your dashboard.</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        userEmail={userData?.email || user.email} 
        labelCounts={labelCounts}
        onSelectCategory={setSelectedCategory} 
      />

      <div className="flex flex-col flex-grow">
        <div className="p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search emails..."
            className="p-2 borde w-3/4 border-gray-300 bg-white rounded-lg"
          />
          <button
            onClick={searchEmails}
            className="ml-2 text-black border px-4 py-2 rounded"
          >
            Search
          </button>

          {searchResults && (
            <button
              onClick={handleGoBack}
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Go Back to Inbox
            </button>
          )}
        </div>

        {searchResults && searchResults.length > 0 ? (
          <InboxList
            inbox={searchResults}
            handleCompose={handleCompose}
            handleOpenMessage={handleOpenMessage}
          />
        ) : searchResults && searchResults.length === 0 ? (
          <p className="p-4">No emails found</p>
        ) : selectedMessage ? (
          <MessageDetails
            selectedMessage={selectedMessage}
            handleCloseMessage={handleCloseMessage}
          />
        ) : (
          <>
            {selectedCategory === 'INBOX' && (
              <InboxList
                inbox={inbox}
                handleCompose={handleCompose}
                handleOpenMessage={handleOpenMessage}
              />
            )}
            {selectedCategory === 'CATEGORY_PROMOTIONS' && (
              <PromotionList
                promotions={promotions}
                handleCompose={handleCompose}
                handleOpenMessage={handleOpenMessage}
              />
            )}
            {selectedCategory === 'CATEGORY_SOCIAL' && (
              <SocialList
                social={social}
                handleCompose={handleCompose}
                handleOpenMessage={handleOpenMessage}
              />
            )}
            {selectedCategory === 'SPAM' && (
              <SpamList
                spam={spam}
                handleCompose={handleCompose}
                handleOpenMessage={handleOpenMessage}
              />
            )}
            {nextPageToken && (
              <button
                onClick={loadMoreEmails}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Load More Emails
              </button>
            )}
          </>
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
