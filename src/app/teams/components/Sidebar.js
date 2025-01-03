'use client';

import { FiInbox, FiCalendar } from 'react-icons/fi';
import { MdLocalOffer, MdPeople, MdWarning, MdStar, MdDrafts, MdSend } from 'react-icons/md';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

const Sidebar = () => {
  const { user, isLoading } = useUser(); // Fetch user data from Auth0

  const navItems = [
    { label: 'Inbox', icon: <FiInbox />, path: '/dashboard/inbox' },
    { label: 'Todo', icon: <MdLocalOffer />, path: '/teams/PersonalTodo' },
    { label: 'Team Todo', icon: <MdPeople />, path: '/TeamTodo' },
    { label: 'Manage Members', icon: <MdStar />, path: '/dashboard/starred' },
    { label: 'Drafts', icon: <MdDrafts />, path: '/dashboard/drafts' },
    { label: 'Sent', icon: <MdSend />, path: '/dashboard/sent' },
    { label: 'Spam', icon: <MdWarning />, path: '/dashboard/spam' },
    { label: 'Calendar', icon: <FiCalendar />, path: '/dashboard/calendar' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 h-screen fixed top-0 left-0 flex flex-col justify-between">
      <div>
        {/* Sidebar Header */}
        <div className="p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.path} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-700">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-lg">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* User Information */}
      {!isLoading && user && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <Image
              src={user.picture || '/default-user.png'}
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
