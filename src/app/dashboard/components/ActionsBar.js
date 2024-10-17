// app/dashboard/components/ActionsBar.js
const ActionsBar = ({ markAllAsRead }) => {
    return (
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={markAllAsRead}
        >
          Mark All as Read
        </button>
      </div>
    );
  };
  
  export default ActionsBar;
  