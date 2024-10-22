import React, { useState } from 'react';
import dynamic from 'next/dynamic'; 

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const Compose = ({ isOpen, onClose, userEmail }) => {
  const [message, setMessage] = useState({
    to: '',
    subject: '',
  });
  const [editorHtml, setEditorHtml] = useState(''); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = editorHtml; 

    try {
      const response = await fetch('/api/messages/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: message.to,
          subject: message.subject,
          body,
          userEmail,
        }),
      });

      if (response.ok) {
        alert('Email sent successfully!');
        onClose();
        setMessage({ to: '', subject: '' });
        setEditorHtml(''); 
      } else {
        const data = await response.json();
        alert(`Failed to send email: ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error occurred while sending the message.');
    }
  };

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

          <ReactQuill
            value={editorHtml}
            onChange={setEditorHtml}
            modules={modules}
            theme="snow"
            placeholder="Write your message here..."
          />

          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Compose;
