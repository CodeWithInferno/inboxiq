// components/Banner.js
'use client';

import Image from 'next/image';

export default function Banner() {
  return (
    <div className="relative h-[80vh] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/Deep Purple.jpg" // Replace with your image path
          alt="Beautiful landscape"
          layout="fill"
          objectFit="cover"
          className="opacity-50"
          priority
        />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12 lg:px-24">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg mb-4">
          Welcome to InboxIQ
        </h1>
        <p className="text-lg md:text-2xl text-white drop-shadow-md mb-8 max-w-2xl">
          Manage your emails smartly with AI-powered features. Stay connected, stay organized, stay efficient.
        </p>
        <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-full shadow-md hover:bg-blue-100 transition duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
}
