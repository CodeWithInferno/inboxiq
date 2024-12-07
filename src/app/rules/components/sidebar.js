'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaRobot, FaShieldAlt, FaEnvelope, FaChartBar, FaRocket, FaInbox } from 'react-icons/fa'; // Import icons
import { useUser } from '@auth0/nextjs-auth0/client'; // Import Auth0 hooks

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser(); // Get the authenticated user's information

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-gray-900 text-gray-200 transition-all duration-300`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-4">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold">INBOXIQ</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-800 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? (
            <span className="text-gray-200">☰</span>
          ) : (
            <span className="text-gray-200">✕</span>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-4 space-y-2">
        <Link
          href="/rules/ai-assistant"
          className="flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition"
        >
          <FaRobot className="mr-3" />
          {!isCollapsed && 'AI Personal Assistant'}
        </Link>
        <Link
          href="/rules/cold-email-blocker"
          className="flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition"
        >
          <FaShieldAlt className="mr-3" />
          {!isCollapsed && 'Cold Email Blocker'}
        </Link>
        <Link
          href="/rules/bulk-unsubscribe"
          className="flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition"
        >
          <FaEnvelope className="mr-3" />
          {!isCollapsed && 'Bulk Unsubscribe'}
        </Link>
        <Link
          href="/rules/analytics"
          className="flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition"
        >
          <FaChartBar className="mr-3" />
          {!isCollapsed && 'Analytics'}
        </Link>
        <Link
          href="/rules/early-access"
          className="flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition"
        >
          <FaRocket className="mr-3" />
          {!isCollapsed && 'Early Access'}
        </Link>
        <Link
          href="/dashboard/inbox"
          className="flex items-center py-2 px-3 rounded-md hover:bg-gray-800 transition"
        >
          <FaInbox className="mr-3" />
          {!isCollapsed && 'Back to Inbox'}
        </Link>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto px-4 py-4 border-t border-gray-800">
        {!isCollapsed ? (
          user ? (
            <div className="flex items-center space-x-3">
              <img
                src={user.picture}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold">Loading...</p>
              <p className="text-xs text-gray-400">Please wait</p>
            </div>
          )
        ) : (
          <div className="text-center">
            {user && (
              <img
                src={user.picture}
                alt="Profile"
                className="w-10 h-10 mx-auto rounded-full mb-2"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
