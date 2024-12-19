'use client';

const ActionButtons = ({ isSending, onClose, handleSubmit }) => {
  return (
    <div className="flex justify-end items-center mt-4 space-x-2">
      <button
        type="button"
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={onClose}
        disabled={isSending}
      >
        Cancel1
      </button>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default ActionButtons;
