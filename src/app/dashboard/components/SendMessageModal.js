// src/app/dashboard/components/SendMessageModal.js
import React from 'react';

const SendMessageModal = ({
  isOpen,
  message,
  handleChange,
  handleSubmit,
  handleClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Compose a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="to"
            placeholder="Recipient's Email"
            value={message.to}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={message.subject}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          <textarea
            name="body"
            placeholder="Message Body"
            value={message.body}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            rows="4"
            required
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMessageModal;
