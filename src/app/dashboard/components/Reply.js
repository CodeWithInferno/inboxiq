import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const Reply = ({ isOpen, onClose, userEmail, to, initialSubject = '', initialBody = '', selectedMessage }) => {
  const [message, setMessage] = useState({
    subject: initialSubject,
  });
  const [editorHtml, setEditorHtml] = useState(initialBody);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      ['link', 'image'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
    ],
  };

// In your Reply Component (e.g., Reply.js)

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/messages/sendReply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: message.subject,
        body: editorHtml,
        userEmail,
        threadId: selectedMessage.threadId, // Ensure threadId is passed
        messageId: selectedMessage.id,      // Ensure messageId is passed
      }),
    });

    if (response.ok) {
      alert('Reply sent successfully!');
      onClose();
    } else {
      const result = await response.json();
      alert(`Failed to send reply: ${result.message}`);
    }
  } catch (error) {
    console.error('Error sending reply:', error);
    alert('Error sending reply.');
  }
};

  
  

const handleSmartReply = async () => {
  setIsLoadingReply(true);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/messages/sendReply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: message.subject,
        body: editorHtml, // Keep editorHtml as the HTML content
        userEmail,
        threadId: selectedMessage.threadId, // Ensure threadId is passed
        messageId: selectedMessage.id,      // Ensure messageId is passed
        isHtml: true, // Add this field to indicate HTML content if your API supports it
      }),
    });

    if (response.ok) {
      alert('Reply sent successfully!');
      onClose();
    } else {
      const result = await response.json();
      alert(`Failed to send reply: ${result.message}`);
    }
  } catch (error) {
    console.error('Error sending reply:', error);
    alert('Error sending reply.');
  }
};


  setIsLoadingReply(false);
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        <h2 className="text-xl font-bold mb-4">Reply</h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
          <input
            type="text"
            name="subject"
            value={message.subject}
            onChange={(e) => setMessage({ ...message, subject: e.target.value })}
            className="p-2 border bg-white rounded w-full"
            required
            placeholder="Subject"
          />

          <div className="flex-grow overflow-y-auto max-h-[50vh] border rounded">
            <ReactQuill
              value={editorHtml}
              onChange={setEditorHtml}
              modules={modules}
              theme="snow"
              placeholder="Write your reply here..."
              className="h-full"
            />
          </div>

          <div className="flex justify-between space-x-2 mt-4">
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSmartReply}
              disabled={isLoadingReply}
            >
              {isLoadingReply ? 'Generating Reply...' : 'Smart Reply'}
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Send
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reply;






















