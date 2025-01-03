'use client';

import { useState } from 'react';
import ProfessionalCreateModal from './ProfessionalCreateModal'; // Import the create modal

export default function ProfessionalModal({ isOpen, onClose, onConfirm }) {
  const [code, setCode] = useState(['', '', '', '', '']); // Array for 5 digits
  const [showCreateModal, setShowCreateModal] = useState(false); // State for showing the create modal
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState(null); // State for success messages

  if (!isOpen) return null; // Don't render if the modal is not open

  // Handle input change for each digit
  const handleChange = (value, index) => {
    if (value.length > 1) return; // Ensure only a single digit is entered
    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);

    // Automatically move to the next input box if a digit is entered
    if (value && index < 4) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle paste event
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').slice(0, 5); // Only allow up to 5 digits
    const updatedCode = [...code];

    pastedData.split('').forEach((char, i) => {
      if (i < 5) updatedCode[i] = char; // Fill the boxes with pasted characters
    });

    setCode(updatedCode);

    // Automatically focus the last filled input box
    const nextInput = document.getElementById(`digit-${Math.min(pastedData.length, 5) - 1}`);
    if (nextInput) nextInput.focus();
  };

  // Handle keydown for backspace navigation
  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      if (prevInput) prevInput.focus();

      const updatedCode = [...code];
      updatedCode[index - 1] = ''; // Clear the previous box
      setCode(updatedCode);
    }
  };

  // API call to join a team
  const joinTeam = async (code) => {
    try {
      const response = await fetch('/api/teams/joinTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('Successfully joined the team!');
        setErrorMessage(null);
        console.log('Successfully joined the team:', data);
        onConfirm(data.teamId); // Notify parent of successful join
      } else {
        setErrorMessage(data.message);
        setSuccessMessage(null);
        console.error('Error joining the team:', data.message);
      }
    } catch (error) {
      setErrorMessage('An error occurred while joining the team.');
      setSuccessMessage(null);
      console.error('Error:', error);
    }
  };

  // Join team button logic
  const handleJoinTeam = () => {
    const teamCode = code.join('');
    if (teamCode.length !== 5) {
      setErrorMessage('Please enter a valid 5-digit team code.');
      return;
    }
    joinTeam(teamCode); // Call the joinTeam API
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Switch to Professional Dashboard</h2>
          <p className="text-gray-600 mb-4">
            Enter a 5-digit team code to join a team or{' '}
            <button
              onClick={() => setShowCreateModal(true)} // Show the create modal
              className="text-blue-500 hover:underline"
            >
              create a new team
            </button>.
          </p>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          {/* Success Message */}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

          {/* Input for 5-digit team code */}
          <div className="flex justify-center gap-2 mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`digit-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 bg-white text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Join Team Button */}
          <button
            onClick={handleJoinTeam}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Join Team
          </button>

          {/* Cancel Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <ProfessionalCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)} // Close the create modal
          onCreate={(data) => {
            console.log('New Team Created:', data);
            setShowCreateModal(false); // Close the modal after creation
          }}
        />
      )}
    </>
  );
}
