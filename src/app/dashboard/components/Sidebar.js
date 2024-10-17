// src/app/dashboard/components/Sidebar.js
const Sidebar = ({ userEmail }) => {
  return (
    <div className="bg-gray-200 text-black w-64 p-4 sm:w-48 md:w-64 h-screen overflow-y-auto">
      <p className="font-bold mb-6 truncate">{userEmail}</p>
      <nav>
        <ul>
          <li className="mb-2">
            <a href="#" className="hover:text-blue-500">Inbox (10)</a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-blue-500">Drafts (0)</a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-500">Sent (3)</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
