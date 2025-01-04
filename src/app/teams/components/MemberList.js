'use client';

import { useEffect, useState } from 'react';
import AddMemberModal from './AddMemberModal';

export default function MembersList({ teamId }) {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teamId) {
      console.error('teamId is missing:', teamId); // Debugging log
      setError('Team ID is required to fetch members.');
      return;
    }

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/teams/getMembers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ teamId }), // Ensure teamId is passed correctly
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch team members');
        }

        setMembers(data.members || []);
      } catch (err) {
        console.error('Error fetching members:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Member
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading members...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : members.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {members.map((member, index) => (
            <li key={index} className="py-4 flex items-center justify-between">
              <div>
                <p className="text-gray-800 font-medium">{member.email}</p>
                <p className="text-sm text-gray-500">Role: {member.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Joined At: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No members found.</p>
      )}

      {isModalOpen && (
        <AddMemberModal
          teamId={teamId}
          onClose={() => setIsModalOpen(false)}
          onMemberAdded={(newMember) => setMembers((prev) => [...prev, newMember])}
        />
      )}
    </div>
  );
}
