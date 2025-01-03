'use client';

import { useState } from 'react';

export default function AddMemberModal({ teamId, onClose }) {
  const [accessCode, setAccessCode] = useState(null); // Update variable name
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false); // Track if code is copied

  const generateCode = async () => {
    setIsLoading(true);
    setError(null);
    setIsCopied(false);

    try {
      const response = await fetch('/api/teams/updateCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const data = await response.json();

      // Format code to include spaces between digits
      const formattedCode = data.AccessCode.replace(/(\d)(?=(\d{1})+$)/g, '$1 ');
      setAccessCode(formattedCode);
    } catch (err) {
      console.error(err);
      setError('Failed to generate a new code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to copy the code to clipboard
  const copyToClipboard = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode.replace(/\s+/g, '')); // Remove spaces before copying
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Generate Access Code</h2>
        <p className="mb-4 text-gray-600">
          Click the button below to generate a unique code for adding new team members.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {accessCode && (
          <div
            onClick={copyToClipboard}
            className="bg-gray-100 p-4 rounded-lg text-center mb-4 cursor-pointer hover:bg-gray-200"
          >
            <p className="text-lg font-bold">{accessCode}</p>
            <p className="text-sm text-gray-600">
              {isCopied ? 'Copied!' : 'Click to copy this code and share it with the new team member.'}
            </p>
          </div>
        )}

        <button
          onClick={generateCode}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          {isLoading ? 'Generating...' : 'Generate Code'}
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 px-4 mt-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  );
}
