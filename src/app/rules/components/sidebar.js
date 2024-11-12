// 'use client';
// import React from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';

// const Sidebar = () => {
//   const { user } = useUser();

//   return (
//     <div className="flex flex-col h-screen w-60 bg-slate-950 text-white">
//       {/* Logo */}
//       <div className="text-2xl font-bold p-4 text-center">INBOXIQ</div>

//       {/* Navigation Links */}
//       <nav className="flex-grow p-4">
//         <a href="/rules" className="block py-2 px-4 rounded hover:bg-gray-800">✨ AI Personal Assistant</a>
//         <a href="/rules/cold-email-blocker" className="block py-2 px-4 rounded hover:bg-gray-800">❄️ Cold Email Blocker</a>
//         <a href="/rules/bulk-unsubscribe" className="block py-2 px-4 rounded hover:bg-gray-800">📩 Bulk Unsubscribe</a>
//         <a href="/rules/analytics" className="block py-2 px-4 rounded hover:bg-gray-800">📊 Analytics</a>
//         <a href="/rules/early-access" className="block py-2 px-4 rounded hover:bg-gray-800">🚀 Early Access</a>
//       </nav>

//       {/* User Info */}
//       {user && (
//         <div className="p-4 border-t border-gray-800">
//           <div className="flex items-center space-x-3">
//             <img src={user.picture} alt="User avatar" className="w-10 h-10 rounded-full" />
//             <div>
//               <p className="text-sm font-semibold">{user.name}</p>
//               <p className="text-xs text-gray-400">{user.email}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;








import React from 'react';

const Sidebar = () => (
  <div className="flex flex-col h-full w-64 p-4">
    <h1 className="text-2xl font-bold text-center mb-6">INBOXIQ</h1>
    <nav className="flex-grow space-y-2">
      <a href="/ai-assistant" className="block py-2 px-4 hover:bg-gray-700 rounded">✨ AI Personal Assistant</a>
      <a href="/rules/cold-email-blocker" className="block py-2 px-4 hover:bg-gray-700 rounded">❄️ Cold Email Blocker</a>
      <a href="/bulk-unsubscribe" className="block py-2 px-4 hover:bg-gray-700 rounded">📩 Bulk Unsubscribe</a>
      <a href="/analytics" className="block py-2 px-4 hover:bg-gray-700 rounded">📊 Analytics</a>
      <a href="/early-access" className="block py-2 px-4 hover:bg-gray-700 rounded">🚀 Early Access</a>
    </nav>
    <div className="mt-auto pt-4 border-t border-gray-700">
      <p className="text-sm font-semibold">Pratham Patel</p>
      <p className="text-xs text-gray-400">infernotech2618@gmail.com</p>
    </div>
  </div>
);

export default Sidebar;
