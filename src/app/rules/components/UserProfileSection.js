import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

const UserProfileSection = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-end space-x-4 p-4">
      {user && (
        <>
          <img src={user.picture} alt="User avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-gray-800">{user.name}</p>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileSection;
