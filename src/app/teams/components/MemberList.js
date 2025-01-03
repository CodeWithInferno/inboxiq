'use client';

import { useEffect, useState } from 'react';
import AddMemberModal from './AddMemberModal';

export default function MembersList({ teamId }) {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch team members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/teams/getMembers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ teamId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch team members');
        }

        setMembers(data.members);
      } catch (err) {
        console.error('Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Header with Add Member Button */}
      <div className="flex justify-between items-center mb-4"> 
        <h2 className="text-xl font-semibold">Team Members</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Member
        </button>
      </div>

      {/* Members Table */}
      {loading ? (
        <p className="text-gray-600">Loading members...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="border-b-2 p-2">
                <input type="checkbox" className="bg-white" />
              </th>
              <th className="border-b-2 p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((email, index) => (
                <tr key={index}>
                  <td className="border-b p-2">
                    <input type="checkbox" className="bg-white" />
                  </td>
                  <td className="border-b p-2">{email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-4 text-center text-gray-600">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <AddMemberModal
          teamId={teamId} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
