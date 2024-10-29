

// 'use client';
// import { useState, useEffect } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import { Switch } from '@headlessui/react';

// const Settings = () => {
//   const { user, isLoading } = useUser();
//   const [features, setFeatures] = useState(null);

//   useEffect(() => {
//     if (!user) return;

//     const fetchFeatures = async () => {
//       try {
//         const response = await fetch(`/api/features/get`);
//         const data = await response.json();
        
//         // Filter out non-boolean keys (such as '_id' and 'User Id')
//         const filteredFeatures = Object.fromEntries(
//           Object.entries(data.features).filter(([, value]) => typeof value === 'boolean')
//         );
        
//         setFeatures(filteredFeatures);
//       } catch (error) {
//         console.error('Error fetching features:', error);
//       }
//     };
//     fetchFeatures();
//   }, [user]);

//   const handleToggle = async (featureName, currentStatus) => {
//     if (!user) return;

//     try {
//       const updatedStatus = !currentStatus;
//       await fetch('/api/features/toggle', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: user.sub,
//           featureName,
//           enabled: updatedStatus,
//         }),
//       });
//       setFeatures((prev) => ({ ...prev, [featureName]: updatedStatus }));
//     } catch (error) {
//       console.error('Error updating feature status:', error);
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (!user) return <p>User not found. Please log in.</p>;

//   return (
//     <div className="p-8 max-w-4xl mx-auto bg-gray-50 shadow-md rounded-xl border border-gray-200">
//       {/* User Info Section */}
//       <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">User Profile</h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <div>
//             <span className="font-semibold text-gray-600">Name:</span>
//             <p className="text-lg text-gray-800">{user.name}</p>
//           </div>
//           <div>
//             <span className="font-semibold text-gray-600">Email:</span>
//             <p className="text-lg text-gray-800">{user.email}</p>
//           </div>
//           <div>
//             <span className="font-semibold text-gray-600">User ID:</span>
//             <p className="text-lg text-gray-800">{user.sub}</p>
//           </div>
//           {user.picture && (
//             <div className="flex flex-col items-start sm:items-center">
//               <span className="font-semibold text-gray-600">Profile Picture:</span>
//               <img src={user.picture} alt="Profile Picture" className="w-20 h-20 rounded-full mt-2 shadow-md" />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Feature Settings Section */}
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Feature Settings</h2>
//         <div className="divide-y divide-gray-200">
//           {features &&
//             Object.keys(features).map((featureName) => (
//               <div key={featureName} className="flex items-center justify-between py-4">
//                 <span className="text-lg font-semibold text-gray-700 capitalize">
//                   {featureName.replace(/([A-Z])/g, ' $1')}
//                 </span>
//                 <Switch
//                   checked={features[featureName]}
//                   onChange={() => handleToggle(featureName, features[featureName])}
//                   className={`${
//                     features[featureName] ? 'bg-green-500' : 'bg-gray-300'
//                   } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
//                 >
//                   <span
//                     className={`${
//                       features[featureName] ? 'translate-x-6' : 'translate-x-1'
//                     } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
//                   />
//                 </Switch>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;















'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Switch } from '@headlessui/react';

const Settings = () => {
  const { user, isLoading } = useUser();
  const [features, setFeatures] = useState(null);
  const [modifiedFeatures, setModifiedFeatures] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchFeatures = async () => {
      try {
        const response = await fetch(`/api/features/get`);
        const data = await response.json();
        
        const filteredFeatures = Object.fromEntries(
          Object.entries(data.features).filter(([, value]) => typeof value === 'boolean')
        );
        
        setFeatures(filteredFeatures);
      } catch (error) {
        console.error('Error fetching features:', error);
      }
    };
    fetchFeatures();
  }, [user]);

  const handleToggle = (featureName) => {
    const currentStatus = features[featureName];
    const updatedStatus = !currentStatus;

    // Update the main features state
    setFeatures((prev) => ({ ...prev, [featureName]: updatedStatus }));
    
    // Update the modified features state to track changes
    setModifiedFeatures((prev) => ({
      ...prev,
      [featureName]: updatedStatus,
    }));
  };

  const handleSubmitChanges = async () => {
    if (!user) return;
  
    try {
      const response = await fetch('/api/features/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.sub,
          changes: modifiedFeatures, // Send all modified features at once
        }),
      });
      
      const result = await response.json();
      if (response.ok) {
        alert('Changes saved successfully');
        setModifiedFeatures({}); // Clear the modified features
      } else {
        console.error('Error saving changes:', result.message);
      }
    } catch (error) {
      console.error('Error updating feature status:', error);
    }
  };
  
  

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>User not found. Please log in.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 shadow-md rounded-xl border border-gray-200">
      {/* User Info Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">User Profile</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="font-semibold text-gray-600">Name:</span>
            <p className="text-lg text-gray-800">{user.name}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Email:</span>
            <p className="text-lg text-gray-800">{user.email}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-600">User ID:</span>
            <p className="text-lg text-gray-800">{user.sub}</p>
          </div>
          {user.picture && (
            <div className="flex flex-col items-start sm:items-center">
              <span className="font-semibold text-gray-600">Profile Picture:</span>
              <img src={user.picture} alt="Profile Picture" className="w-20 h-20 rounded-full mt-2 shadow-md" />
            </div>
          )}
        </div>
      </div>

      {/* Feature Settings Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Feature Settings</h2>
        <div className="divide-y divide-gray-200">
          {features &&
            Object.keys(features).map((featureName) => (
              <div key={featureName} className="flex items-center justify-between py-4">
                <span className="text-lg font-semibold text-gray-700 capitalize">
                  {featureName.replace(/([A-Z])/g, ' $1')}
                </span>
                <Switch
                  checked={features[featureName]}
                  onChange={() => handleToggle(featureName)}
                  className={`${
                    features[featureName] ? 'bg-green-500' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      features[featureName] ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                  />
                </Switch>
              </div>
            ))}
        </div>
        {Object.keys(modifiedFeatures).length > 0 && (
          <button
            onClick={handleSubmitChanges}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
