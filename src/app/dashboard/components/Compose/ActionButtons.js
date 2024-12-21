'use client';

const ActionButtons = ({ isSending, onClose, handleSubmit, onScheduleClick }) => {
  return (
    <div className="flex justify-end items-center mt-4 space-x-2">
      <button
        type="button"
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={onClose}
        disabled={isSending}
      >
        Cancel
      </button>
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 disabled:opacity-50"
        onClick={onScheduleClick}
        disabled={isSending}
      >
        <span className="inline-flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3"
            />
          </svg>
          <span>Send Later</span>
        </span>
      </button>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default ActionButtons;
