'use client';

import { useState } from 'react';

export default function TeamDetails({ teamData }) {
  const [isCopied, setIsCopied] = useState(false);
  if (!teamData) {
    return <p className="text-gray-600">Loading team details...</p>;
  }

  const copyAccessCode = () => {
    navigator.clipboard.writeText(teamData.joinCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
  };
  const { organization, privacy, description } = teamData;


  return (
    <div className="p-8 bg-gradient-to-b from-blue-50 to-gray-100 shadow-xl w-full max-w-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 border-b pb-4">
        Team Details
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
        <div className="flex flex-col space-y-4">
          <p className="text-gray-800 font-medium break-words w-full">
            <strong className="block text-gray-600 text-sm uppercase tracking-wide">
              Team Name
            </strong>
            <span className="truncate w-56 block">{organization?.teamName}</span>
          </p>
          <p className="text-gray-800 font-medium break-words w-full">
            <strong className="block text-gray-600 text-sm uppercase tracking-wide">
              Privacy
            </strong>
            <span className="truncate w-56 block">{privacy}</span>
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <p className="text-gray-800 font-medium break-words w-full">
            <strong className="block text-gray-600 text-sm uppercase tracking-wide">
              Department Name
            </strong>
            <span className="truncate w-56 block">{organization?.departmentName}</span>
          </p>
          <p className="text-gray-800 font-medium break-words w-full">
            <strong className="block text-gray-600 text-sm uppercase tracking-wide">
              Company Name
            </strong>
            <span className="truncate w-56 block">{organization?.companyName}</span>
          </p>
          <p className="text-gray-800 font-medium break-words w-full">
            <strong className="block text-gray-600 text-sm uppercase tracking-wide">
              Description
            </strong>
            <span className="truncate w-56 block">{teamData.description}</span>
          </p>
        </div>
      </div>
      <div
        onClick={copyAccessCode}
        className="mt-6 text-center bg-gray-50 p-4 rounded-lg border cursor-pointer hover:bg-gray-100 transition"
      >
        <p className="text-gray-800 font-bold text-lg">
          Access Code: <span className="text-blue-600">{teamData.joinCode}</span>
        </p>
        {isCopied && (
          <p className="text-green-500 mt-2 text-sm">
            Access code copied to clipboard!
          </p>
        )}
        {!isCopied && (
          <p className="text-gray-500 mt-2 text-sm">
            Click to copy the access code.
          </p>
        )}
      </div>
    </div>
  );
}
