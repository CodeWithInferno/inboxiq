// 'use client';
// import { useState } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import ThemeToggle from './togglebutton';
// import Link from 'next/link';
// import Image from 'next/image';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { user } = useUser();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <header className="bg-transparent  pt-5">
//       <nav className="container mx-auto p-4 flex items-center justify-between">
//         <div className="flex items-center">
//           <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
//             MailMinds
//           </h1>
//         </div>

//         <div className="hidden md:flex items-center space-x-6">
//           <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
//             Home
//           </Link>
//           <Link href="#features" className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
//             Features
//           </Link>
//           <Link href="#pricing" className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400">
//             Pricing
//           </Link>
//           {user ? (
//             <div className="relative">
//               <button onClick={toggleMenu} className="flex items-center">
//                 <img src={user.picture} alt={user.name} width={32} height={32} className="rounded-full" />
//               </button>
//               {isMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
//                   <Link href="/dashboard" className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900">Dashboard</Link>
//                   <Link href="/settings" className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900">Settings</Link>
//                   <Link href="/api/auth/logout" className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900">Logout</Link>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link href="/api/auth/login" className="text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
//               Login
//             </Link>
//           )}
//           <ThemeToggle />
//         </div>
//       </nav>
//       <br></br>
//     </header>
//   );
// };

// export default Navbar;










'use client';
import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import ThemeToggle from './togglebutton';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-transparent dark:text-white pt-5">
      <nav className="container mx-auto p-4 flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex items-center">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            InboxIQ
          </h1>
        </div>

        {/* Navigation links in the center */}
        <div className="hidden md:flex flex-grow justify-center space-x-6">
          <Link href="/" className="text-gray-700 dark:text-gray-200 font-medium text-xl">
            Home
          </Link>
          <Link href="/" className="text-gray-700 dark:text-gray-200 font-medium text-xl">
            FAQ
          </Link>
          <Link href="#features" className="text-gray-700 dark:text-gray-200 font-medium text-xl">
            Open Source
          </Link>
          <Link href="#pricing" className="text-gray-700 dark:text-gray-200 font-medium text-xl">
            Pricing
          </Link>
        </div>

        {/* Login/User menu and ThemeToggle on the right */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button onClick={toggleMenu} className="flex items-center">
                <Image
                  src={user.picture}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                  priority={true} // Helps with LCP optimization
                />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/api/auth/logout"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/api/auth/login?returnTo=/dashboard"
              className="text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Login
            </Link>

          )}
          <ThemeToggle />
        </div>
      </nav>
      <br />
    </header>
  );
};

export default Navbar;
