// import { useState } from 'react';

// const SendMessage = ({ user, onClose }) => {
//   const [formState, setFormState] = useState({
//     to: '',
//     subject: '',
//     body: '',
//     attachments: [],
//   });
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormState({ ...formState, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setFormState({ ...formState, attachments: [...e.target.files] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('to', formState.to);
//     formData.append('subject', formState.subject);
//     formData.append('body', formState.body);

//     formState.attachments.forEach((file) => {
//       formData.append('attachments', file);
//     });

//     try {
//       const response = await fetch('/api/messages/send', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Error sending message');
//       }

//       alert('Email sent successfully');
//       onClose(); // Close the modal after sending
//     } catch (error) {
//       setError('Error sending email. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-lg w-96 p-6">
//         <h2 className="text-xl font-bold mb-4">Compose Message</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="to"
//             placeholder="Recipient"
//             value={formState.to}
//             onChange={handleInputChange}
//             className="w-full p-2 mb-4 border rounded"
//             required
//           />
//           <input
//             type="text"
//             name="subject"
//             placeholder="Subject"
//             value={formState.subject}
//             onChange={handleInputChange}
//             className="w-full p-2 mb-4 border rounded"
//             required
//           />
//           <textarea
//             name="body"
//             placeholder="Message Body"
//             value={formState.body}
//             onChange={handleInputChange}
//             className="w-full p-2 mb-4 border rounded h-32"
//             required
//           />
//           <input
//             type="file"
//             multiple
//             onChange={handleFileChange}
//             className="w-full mb-4"
//           />
//           <div className="flex justify-between">
//             <button
//               type="button"
//               className="bg-gray-500 text-white px-4 py-2 rounded"
//               onClick={onClose}
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Sending...' : 'Send'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SendMessage;










import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import React-Quill (for Next.js)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],  // Add image option in toolbar
    ['clean']
  ],
};

const SendMessage = ({ user, onClose }) => {
  const quillRef = useRef(null);

  const [formState, setFormState] = useState({
    to: '',
    subject: '',
    body: '',
    attachments: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleQuillChange = (content) => {
    setFormState({ ...formState, body: content });
  };

  const handleFileChange = (e) => {
    const files = [...e.target.files];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];  // Strip the "data:image/png;base64," part
        const quillEditor = quillRef.current.getEditor();
        const range = quillEditor.getSelection();
        quillEditor.insertEmbed(range.index, 'image', `cid:image1`); // Reference image inline with CID
        setFormState((prevState) => ({
          ...prevState,
          attachments: [...prevState.attachments, base64String],  // Store base64 of the file
        }));
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('to', formState.to);
    formData.append('subject', formState.subject);
    formData.append('body', formState.body);  // HTML content from React-Quill
    formData.append('userEmail', user.email);

    formState.attachments.forEach((attachment) => {
      formData.append('attachments', attachment);
    });

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error sending message');
      }

      alert('Email sent successfully');
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4">Compose Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="to"
            placeholder="Recipient"
            value={formState.to}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formState.subject}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ReactQuill
            ref={quillRef}
            value={formState.body}
            onChange={handleQuillChange}
            modules={modules}
            className="bg-white text-black rounded-lg"
            placeholder="Message Body"
            required
          />
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"  // Attach images inline
          />
          <div className="flex justify-between space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMessage;
