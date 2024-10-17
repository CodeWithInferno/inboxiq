'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import ThemeToggle from './togglebutton'; // Ensure this matches the correct filename
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto p-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            MailMinds
          </h1>
        </div>

        {/* Desktop Navigation and Buttons */}
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="#" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
              Home
            </Link>
            <Link href="#" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
              Features
            </Link>
            <Link href="#" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
              Pricing
            </Link>
          </div>

          {/* Conditional User Profile or Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
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
              href="/api/auth/login"
              className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Login
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-900 dark:text-gray-100 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <div className="flex flex-col p-4 space-y-4">
            <Link href="#" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
              Home
            </Link>
            <Link href="#" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
              Features
            </Link>
            <Link href="#" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
              Pricing
            </Link>
            <Link href="#" className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
