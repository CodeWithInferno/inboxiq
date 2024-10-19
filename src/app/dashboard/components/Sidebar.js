const Sidebar = ({ userEmail, labelCounts = {}, onSelectCategory }) => {
  return (
    <div className="bg-gray-200 text-black w-64 p-4 sm:w-48 md:w-64 h-screen overflow-y-auto">
      <p className="font-bold mb-6 truncate">{userEmail}</p>
      <nav>
        <ul>
          <li className="mb-2">
            <a href="#" onClick={() => onSelectCategory('INBOX')} className="hover:text-blue-500">
              Primary ({labelCounts.INBOX || 0})
            </a>
          </li>
          <li className="mb-2">
            <a href="#" onClick={() => onSelectCategory('CATEGORY_PROMOTIONS')} className="hover:text-blue-500">
              Promotions ({labelCounts.CATEGORY_PROMOTIONS || 0})
            </a>
          </li>
          <li className="mb-2">
            <a href="#" onClick={() => onSelectCategory('CATEGORY_SOCIAL')} className="hover:text-blue-500">
              Social ({labelCounts.CATEGORY_SOCIAL || 0})
            </a>
          </li>
          <li className="mb-2">
            <a href="#" onClick={() => onSelectCategory('SPAM')} className="hover:text-blue-500">
              Spam ({labelCounts.SPAM || 0})
            </a>
          </li>
          <li className="mb-2">
            <a href="#" onClick={() => onSelectCategory('TRASH')} className="hover:text-blue-500">
              Trash ({labelCounts.TRASH || 0})
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
