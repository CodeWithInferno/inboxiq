import { useState } from 'react';
import { FiMenu, FiInbox } from 'react-icons/fi'; // Icons from react-icons
import { MdLocalOffer, MdPeople, MdWarning, MdStar, MdDrafts, MdSend } from 'react-icons/md'; // More icons from react-icons
import Link from 'next/link';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Manage the collapsed state

  // Toggle the collapsed state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex">
      {/* Sidebar Container */}
      <div
        className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen p-4 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
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
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
