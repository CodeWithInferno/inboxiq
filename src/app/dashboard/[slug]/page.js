'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Sidebar from '../components/Sidebar';
import MessageDetails from '../components/MessageDetails';
import Compose from '../components/Compose';  // Import the Compose component

const DashboardPage = () => {
  const { slug } = useParams();  // Get the slug from the URL (inbox, promotions, social, spam, etc.)
  const { user, isLoading } = useUser();  // Use Auth0's hook to get the authenticated user
  const [emails, setEmails] = useState([]);
  const [labelCounts, setLabelCounts] = useState({});
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');  // Track search input
  const [searchMode, setSearchMode] = useState(false);  // Track if search is active
  const [isComposeOpen, setIsComposeOpen] = useState(false); // Track compose modal state
  const loaderRef = useRef(null); // Ref for observing when the user reaches the bottom

  // Helper function to map slug to Gmail label
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
        return 'INBOX'; // Fallback to inbox
    }
  };

  // Fetch Emails
  const fetchEmails = async (label, email, pageToken = null, query = '') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/google/fetchEmails?label=${label}&email=${encodeURIComponent(email)}${pageToken ? `&pageToken=${pageToken}` : ''}&query=${query}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred while fetching emails');
      }
  
      const data = await response.json();
  
      if (Array.isArray(data.messages)) {
        setEmails((prevEmails) => [...prevEmails, ...data.messages]);
      } else {
        setEmails([]);
      }
  
      setLabelCounts(data.labelCounts || {});
      setNextPageToken(data.nextPageToken || null);
    } catch (error) {
      console.error('Error fetching emails:', error.message);
    }
  
    setLoading(false);
  };

  // Handle when a specific message is selected
  const handleOpenMessage = (message) => {
    setSelectedMessage(message);
  };

  // Handle closing the message view
  const handleCloseMessage = () => {
    setSelectedMessage(null);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setEmails([]); // Clear previous emails before searching
    setSearchMode(true); // Set search mode to true
    const label = getGmailLabel(slug);
    fetchEmails(label, user.email, null, searchQuery);  // Fetch emails based on search query
  };

  // Handle going back to inbox
  const handleBackToInbox = () => {
    setSearchMode(false);  // Exit search mode
    setSearchQuery('');    // Clear search input
    setEmails([]);         // Clear the emails
    const label = getGmailLabel('inbox');  // Get the inbox label
    fetchEmails(label, user.email);        // Fetch the inbox emails
  };

  // Handle compose modal
  const openComposeModal = () => {
    setIsComposeOpen(true);
  };

  const closeComposeModal = () => {
    setIsComposeOpen(false);
  };

  // Fetch emails when the category (slug) changes or when user is authenticated
  useEffect(() => {
    if (user && slug && !searchMode) {
      const label = getGmailLabel(slug); // Get Gmail label from slug
      fetchEmails(label, user.email);
    }
  }, [slug, user, searchMode]);

  // Render loading state if the user info is still being loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar labelCounts={labelCounts} /> {/* Sidebar for navigation */}
      
      <div className="flex-grow p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold capitalize mb-8 text-gray-900">{slug}</h1>

        {/* Conditionally render search bar and compose button only when no message is selected */}
        {!selectedMessage && (
          <>
            {/* Search Bar */}
            <form className="mb-6" onSubmit={handleSearch}>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Back button to exit search mode */}
            {searchMode && (
              <button 
                className="mb-4 text-blue-500 hover:text-blue-700" 
                onClick={handleBackToInbox}
              >
                &larr; Back to Inbox
              </button>
            )}

            {/* Compose button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
              onClick={openComposeModal}
            >
              Compose
            </button>
          </>
        )}

        {/* Loading state */}
        {loading && emails.length === 0 ? (
          <p className="text-gray-600">Loading emails...</p>
        ) : selectedMessage ? (
          <MessageDetails 
            selectedMessage={selectedMessage} 
            handleCloseMessage={handleCloseMessage}
          />
        ) : emails.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-500">No emails found for {slug}</p>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-6">
              {emails.map((email) => (
                <li 
                  key={email.id} 
                  className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                  onClick={() => handleOpenMessage(email)} // Click to open message
                >
                  <h2 className="font-bold text-xl mb-2">{email.subject || '(No Subject)'}</h2>
                  <p className="text-sm text-gray-600">From: {email.from}</p>
                  <p className="mt-4">{email.snippet}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Compose Message Modal */}
      <Compose
        isOpen={isComposeOpen}
        onClose={closeComposeModal}
        userEmail={user?.email}
      />
    </div>
  );
};

export default DashboardPage;
