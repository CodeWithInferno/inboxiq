import { useState } from 'react';
import { FiMenu, FiInbox, FiCalendar } from 'react-icons/fi'; // Icons from react-icons
import { MdLocalOffer, MdPeople, MdWarning, MdStar, MdDrafts, MdSend } from 'react-icons/md'; // More icons from react-icons
import Link from 'next/link';
import { GiScrollQuill } from "react-icons/gi";
import { useUser } from '@auth0/nextjs-auth0/client'; // Import Auth0 useUser hook

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Manage the collapsed state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manage dropdown visibility
  const { user, isLoading } = useUser(); // Get the user data and loading state from Auth0

  // Toggle the collapsed state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle logout using window.location.href
  const handleLogout = () => {
    window.location.href = '/api/auth/logout'; // Redirect to the logout route
  };

  return (
    <div className="flex">
      {/* Sidebar Container */}
      <div
        className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen p-4 transition-all duration-300 flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        <div>
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none mb-8"
          >
            <FiMenu size={28} />
          </button>

          {/* Sidebar Links */}
          <nav>
            <ul className="space-y-6">
              <li className="flex items-center">
                <Link href="/dashboard/inbox" className="flex items-center space-x-4">
                  <FiInbox size={24} />
                  {!isCollapsed && <span className="text-lg">Inbox</span>}
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/dashboard/promotions" className="flex items-center space-x-4">
                  <MdLocalOffer size={24} />
                  {!isCollapsed && <span className="text-lg">Promotions</span>}
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/dashboard/social" className="flex items-center space-x-4">
                  <MdPeople size={24} />
                  {!isCollapsed && <span className="text-lg">Social</span>}
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/dashboard/starred" className="flex items-center space-x-4">
                  <MdStar size={24} />
                  {!isCollapsed && <span className="text-lg">Starred</span>}
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/dashboard/drafts" className="flex items-center space-x-4">
                  <MdDrafts size={24} />
                  {!isCollapsed && <span className="text-lg">Drafts</span>}
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/dashboard/sent" className="flex items-center space-x-4">
                  <MdSend size={24} />
                  {!isCollapsed && <span className="text-lg">Sent</span>}
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/dashboard/spam" className="flex items-center space-x-4">
                  <MdWarning size={24} />
                  {!isCollapsed && <span className="text-lg">Spam</span>}
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/dashboard/calendar" className="flex items-center space-x-4">
                  <FiCalendar size={24} />
                  {!isCollapsed && <span className="text-lg">Calendar</span>}
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/rules/" className="flex items-center space-x-4">
                  <GiScrollQuill size={24} />
                  {!isCollapsed && <span className="text-lg">Rules</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* User Information */}
        {!isLoading && user && (
          <div className="relative">
            {/* User Info */}
            <div
              className={`flex items-center space-x-4 mt-8 cursor-pointer ${isCollapsed ? 'justify-center' : ''
                }`}
              onClick={toggleDropdown} // Toggle dropdown on click
            >
              <img
                src={user.picture} // User image from Auth0
                alt="User Profile"
                className="w-10 h-10 rounded-full"
              />
              {!isCollapsed && (
                <div>
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              )}
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute bottom-full mb-2 w-full bg-white text-gray-700 shadow-lg rounded-lg">
                <Link
                  href="/settings"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
