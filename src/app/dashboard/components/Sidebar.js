// 'use client';
// import { useState } from 'react';
// import { FiMenu, FiInbox, FiCalendar } from 'react-icons/fi'; // Icons from react-icons
// import { MdLocalOffer, MdPeople, MdWarning, MdStar, MdDrafts, MdSend } from 'react-icons/md'; // More icons from react-icons
// import Link from 'next/link';
// import { GiScrollQuill } from "react-icons/gi";
// import { useUser } from '@auth0/nextjs-auth0/client'; // Import Auth0 useUser hook
// import Image from 'next/image'; // Import Image for optimized image handling

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false); // Manage the collapsed state
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Manage dropdown visibility
//   const { user, isLoading } = useUser(); // Get the user data and loading state from Auth0

//   // Toggle the collapsed state
//   const toggleSidebar = () => {
//     // If collapsing the sidebar, close the dropdown
//     if (!isCollapsed && isDropdownOpen) {
//       setIsDropdownOpen(false);
//     }
//     setIsCollapsed(!isCollapsed);
//   };

//   // Toggle the dropdown menu
//   const toggleDropdown = () => {
//     // If the sidebar is collapsed, expand it
//     if (isCollapsed) {
//       setIsCollapsed(false);
//     } else {
//       setIsDropdownOpen(!isDropdownOpen); // Toggle the dropdown
//     }
//   };

//   // Handle logout using window.location.href
//   const handleLogout = () => {
//     window.location.href = '/api/auth/logout'; // Redirect to the logout route
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar Container */}
//       <div
//         className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen p-4 transition-all duration-300 flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-64'
//           }`}
//       >
//         <div>
//           {/* Toggle Button */}
//           <button
//             onClick={toggleSidebar}
//             className="text-white focus:outline-none mb-8"
//           >
//             <FiMenu size={28} />
//           </button>

//           {/* Sidebar Links */}
//           <nav>
//             <ul className="space-y-6">
//               <li className="flex items-center">
//                 <Link href="/dashboard/inbox" className="flex items-center space-x-4">
//                   <FiInbox size={24} />
//                   {!isCollapsed && <span className="text-lg">Inbox</span>}
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link href="/dashboard/promotions" className="flex items-center space-x-4">
//                   <MdLocalOffer size={24} />
//                   {!isCollapsed && <span className="text-lg">Promotions</span>}
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link href="/dashboard/social" className="flex items-center space-x-4">
//                   <MdPeople size={24} />
//                   {!isCollapsed && <span className="text-lg">Social</span>}
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link href="/dashboard/starred" className="flex items-center space-x-4">
//                   <MdStar size={24} />
//                   {!isCollapsed && <span className="text-lg">Starred</span>}
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link href="/dashboard/drafts" className="flex items-center space-x-4">
//                   <MdDrafts size={24} />
//                   {!isCollapsed && <span className="text-lg">Drafts</span>}
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link href="/dashboard/sent" className="flex items-center space-x-4">
//                   <MdSend size={24} />
//                   {!isCollapsed && <span className="text-lg">Sent</span>}
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link href="/dashboard/spam" className="flex items-center space-x-4">
//                   <MdWarning size={24} />
//                   {!isCollapsed && <span className="text-lg">Spam</span>}
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link href="/dashboard/calendar" className="flex items-center space-x-4">
//                   <FiCalendar size={24} />
//                   {!isCollapsed && <span className="text-lg">Calendar</span>}
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link href="/rules/" className="flex items-center space-x-4">
//                   <GiScrollQuill size={24} />
//                   {!isCollapsed && <span className="text-lg">Rules</span>}
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>

//         {/* User Information */}
//         {!isLoading && user && (
//           <div className="relative">
//             {/* User Info */}
//             <div
//               className={`flex items-center space-x-4 mt-8 cursor-pointer ${isCollapsed ? 'justify-center' : ''
//                 }`}
//               onClick={toggleDropdown} // Toggle dropdown on click
//             >
//               <Image
//                 src={user.picture} // User image from Auth0
//                 alt="User Profile"
//                 width={40}
//                 height={40}
//                 className="rounded-full"
//               />
//               {!isCollapsed && (
//                 <div>
//                   <p className="text-white text-sm font-medium">{user.name}</p>
//                   <p className="text-gray-400 text-xs">{user.email}</p>
//                 </div>
//               )}
//             </div>

//             {/* Dropdown Menu */}
//             {isDropdownOpen && (
//               <div className="absolute bottom-full mb-2 w-full bg-white text-gray-700 shadow-lg rounded-lg">
//                 <Link
//                   href="/settings"
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-200"
//                 >
//                   Settings
//                 </Link>
//                 <button
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-200"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;









'use client';

import { useState } from 'react';
import { FiMenu, FiInbox, FiCalendar } from 'react-icons/fi';
import { MdLocalOffer, MdPeople, MdWarning, MdStar, MdDrafts, MdSend } from 'react-icons/md';
import { GiScrollQuill } from "react-icons/gi";
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isLoading } = useUser();

  const toggleSidebar = () => {
    if (!isCollapsed && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
    setIsCollapsed(!isCollapsed);
  };

  const toggleDropdown = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  const navigationItems = [
    { href: '/dashboard/inbox', icon: FiInbox, label: 'Inbox', badge: 3 },
    { href: '/dashboard/promotions', icon: MdLocalOffer, label: 'Promotions' },
    { href: '/dashboard/social', icon: MdPeople, label: 'Social' },
    { href: '/dashboard/starred', icon: MdStar, label: 'Starred' },
    { href: '/dashboard/drafts', icon: MdDrafts, label: 'Drafts' },
    { href: '/dashboard/sent', icon: MdSend, label: 'Sent' },
    { href: '/dashboard/spam', icon: MdWarning, label: 'Spam' },
    { href: '/dashboard/calendar', icon: FiCalendar, label: 'Calendar' },
    { href: '/rules', icon: GiScrollQuill, label: 'Rules' }
  ];

  return (
    <div className="flex h-screen">
      <div
        className={`bg-slate-900 text-white h-full transition-all duration-300 flex flex-col 
          ${isCollapsed ? 'w-20' : 'w-72'} relative group`}
      >
        {/* Header with Logo and Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg">Inbox IQ</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FiMenu size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors
                    hover:bg-slate-700 group cursor-pointer
                    ${!isCollapsed ? 'justify-start' : 'justify-center'}`}
                >
                  <item.icon size={22} className="flex-shrink-0 text-slate-300" />
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  )}
                  {item.badge && !isCollapsed && (
                    <span className="ml-auto bg-blue-500 text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        {!isLoading && user && (
          <div className="border-t border-slate-700/50 p-4">
            <div className="relative">
              <div
                onClick={toggleDropdown}
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg
                  hover:bg-slate-700 transition-colors
                  ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className="relative">
                  <Image
                    src={user.picture}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-slate-700"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                )}
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm hover:bg-slate-700 transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-slate-700 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;