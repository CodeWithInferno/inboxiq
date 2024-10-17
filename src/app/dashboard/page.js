'use client';

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
  const [selectedMessage, setSelectedMessage] = useState(null); // To toggle between views
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/api/user/me');
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      const fetchInbox = async () => {
        try {
          const response = await axios.get(`/api/auth/google/fetchEmails`, {
            params: {
              email: user.email,
            },
          });
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
        {selectedMessage ? (
          <MessageDetails
            selectedMessage={selectedMessage}
            handleCloseMessage={handleCloseMessage}
            deleteMessage={deleteMessage}
            handleReply={handleReply}
            handleForward={handleForward}
          />
        ) : (
          <InboxList
            inbox={inbox}
            toggleReadStatus={toggleReadStatus}
            deleteMessage={deleteMessage}
            handleOpenMessage={handleOpenMessage}
            handleCompose={() => setIsComposeOpen(true)}
          />
        )}
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
