'use client';

import { useState } from 'react';

export default function ProfessionalCreateModal({ isOpen, onClose, onCreate }) {
  const [step, setStep] = useState(1); // Step tracker for the multi-step form
  const [companyName, setCompanyName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [privacy, setPrivacy] = useState('private'); // Default to private
  const [description, setDescription] = useState('');
  const [defaultPermission, setDefaultPermission] = useState('viewer'); // Default permission
  const [joinApproval, setJoinApproval] = useState('auto'); // Default join approval
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const newTeam = {
      companyName,
      departmentName,
      teamName,
      privacy,
      description,
      defaultPermission,
      joinApproval,
    };

    try {
      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam),
      });

      if (!response.ok) {
        throw new Error('Failed to create the team. Please try again.');
      }

      const { teamId, teamCode } = await response.json();
      alert(`Team created successfully! Your team code is: ${teamCode}`);
      onCreate({ teamId, teamCode }); // Pass the generated team data to the parent
      onClose();
    } catch (error) {
      console.error(error.message);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a New Team</h2>

        {/* Step 1: Company Details */}
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Department Name</label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter department name"
              />
            </div>
          </div>
        )}

        {/* Step 2: Team Details */}
        {step === 2 && (
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter team name"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Privacy</label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter team description (optional)"
              />
            </div>
          </div>
        )}

        {/* Step 3: Additional Settings */}
        {step === 3 && (
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Default Member Permissions</label>
              <select
                value={defaultPermission}
                onChange={(e) => setDefaultPermission(e.target.value)}
                className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer</option>
                <option value="contributor">Contributor</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-medium">Join Approval</label>
              <select
                value={joinApproval}
                onChange={(e) => setJoinApproval(e.target.value)}
                className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="auto">Auto-approve</option>
                <option value="manual">Manual approval</option>
              </select>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
