'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../components/Sidebar'; // Ensure Sidebar component is correctly located
import TeamDetails from '../components/TeamDetails'; // Ensure TeamDetails component is correctly located
import TodoList from '../components/Todo'; // Ensure TodoList component is correctly located
import MembersList from '../components/MemberList'; // Import MembersList component

export default function TeamOwnerDashboard() {
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams(); // Use useParams to get dynamic route params

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`/api/teams/getTeams?teamId=${params.teamid}`);
        if (!response.ok) throw new Error('Failed to fetch team data');
        const data = await response.json();
        setTeamData(data.data || null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch team data');
      }
    };

    fetchTeamData();
  }, [params.teamid]);

  return (
    <div className="flex overflow-auto  h-screen">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-6 flex-grow">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : teamData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TeamDetails teamData={teamData} />
            <TodoList />
          </div>
        ) : (
          <p className="text-gray-600">Loading team data...</p>
        )}
        {/* Members List */}
        <div className="mt-6 pb-5">
        <MembersList teamId={params.teamid} />
        </div>
      </div>
    </div>
  );
}
