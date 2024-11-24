import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

const UserProfileSection = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-end space-x-4 p-4">
      {user && (
        <>
          <Image 
            src={user.picture} 
            alt="User avatar" 
            width={40} 
            height={40} 
            className="rounded-full" 
          />
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
