// "use client";

// import React, { useState, useRef, useEffect } from 'react';
// import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignCenter, FaAlignLeft, FaAlignRight, FaHeading } from "react-icons/fa";
// import DOMPurify from 'dompurify';

// const Compose = ({ isOpen, onClose, userEmail }) => {
//   const [message, setMessage] = useState({ to: '', cc: '', bcc: '', subject: '' });
//   const [htmlInput, setHtmlInput] = useState('');
//   const [showHtmlEditor, setShowHtmlEditor] = useState(false);
//   const editorRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
//   };

//   const validateEmailList = (emails) => {
//     if (!emails) return true;
//     const emailList = emails.split(',').map((email) => email.trim());
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailList.every((email) => emailRegex.test(email));
//   };

//   const decodeHtmlEntities = (str) => {
//     const textArea = document.createElement("textarea");
//     textArea.innerHTML = str;
//     return textArea.value;
//   };

//   const encodeHtmlEntities = (str) => {
//     const textArea = document.createElement("textarea");
//     textArea.textContent = str;
//     return textArea.innerHTML;
//   };

//   const handleHtmlInput = (e) => {
//     const rawHtml = e.target.value;
//     setHtmlInput(rawHtml);
//     if (editorRef.current) {
//       editorRef.current.innerHTML = DOMPurify.sanitize(decodeHtmlEntities(rawHtml));
//     }
//   };

//   useEffect(() => {
//     if (editorRef.current) {
//       editorRef.current.innerHTML = DOMPurify.sanitize(decodeHtmlEntities(htmlInput));
//     }
//   }, [htmlInput]);

//   const handleEditorChange = () => {
//     if (editorRef.current) {
//       const rawHtml = editorRef.current.innerHTML;
//       setHtmlInput(encodeHtmlEntities(rawHtml));
//     }
//   };

//   const applyFormat = (command, value = null) => {
//     document.execCommand(command, false, value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const body = editorRef.current.innerHTML;

//     if (!validateEmailList(message.to) || !validateEmailList(message.cc) || !validateEmailList(message.bcc)) {
//       alert('Please provide valid email addresses.');
//       return;
//     }

//     console.log("Email Body:", body);
//     alert('Email sent successfully!');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col overflow-auto max-h-screen">
//         <h2 className="text-xl font-bold mb-4">Compose a Message</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="to"
//             placeholder="Recipient's Email"
//             value={message.to}
//             onChange={handleChange}
//             className="p-2 border bg-white rounded w-full"
//             required
//           />
//           <input
//             type="text"
//             name="cc"
//             placeholder="CC"
//             value={message.cc}
//             onChange={handleChange}
//             className="p-2 border bg-white rounded w-full"
//           />
//           <input
//             type="text"
//             name="bcc"
//             placeholder="BCC"
//             value={message.bcc}
//             onChange={handleChange}
//             className="p-2 border bg-white rounded w-full"
//           />
//           <input
//             type="text"
//             name="subject"
//             placeholder="Subject"
//             value={message.subject}
//             onChange={handleChange}
//             className="p-2 border bg-white rounded w-full"
//             required
//           />

//           <div className="flex space-x-2 mb-2 bg-gray-200 p-2 rounded-md">
//             <button type="button" onClick={() => applyFormat('bold')} title="Bold" className="p-1 hover:bg-gray-300 rounded"><FaBold /></button>
//             <button type="button" onClick={() => applyFormat('italic')} title="Italic" className="p-1 hover:bg-gray-300 rounded"><FaItalic /></button>
//             <button type="button" onClick={() => applyFormat('underline')} title="Underline" className="p-1 hover:bg-gray-300 rounded"><FaUnderline /></button>
//             <button type="button" onClick={() => applyFormat('insertOrderedList')} title="Numbered List" className="p-1 hover:bg-gray-300 rounded"><FaListOl /></button>
//             <button type="button" onClick={() => applyFormat('insertUnorderedList')} title="Bullet List" className="p-1 hover:bg-gray-300 rounded"><FaListUl /></button>
//             <button type="button" onClick={() => applyFormat('justifyLeft')} title="Align Left" className="p-1 hover:bg-gray-300 rounded"><FaAlignLeft /></button>
//             <button type="button" onClick={() => applyFormat('justifyCenter')} title="Align Center" className="p-1 hover:bg-gray-300 rounded"><FaAlignCenter /></button>
//             <button type="button" onClick={() => applyFormat('justifyRight')} title="Align Right" className="p-1 hover:bg-gray-300 rounded"><FaAlignRight /></button>
//             <button type="button" onClick={() => applyFormat('formatBlock', 'H2')} title="Heading" className="p-1 hover:bg-gray-300 rounded"><FaHeading /></button>
//           </div>

//           <div className={`flex w-full border rounded overflow-hidden`} style={{ height: "300px" }}>
//             <div
//               className={`p-2 overflow-y-auto ${showHtmlEditor ? 'border-r' : ''}`}
//               style={{ resize: "horizontal", minWidth: showHtmlEditor ? "50%" : "100%", maxWidth: "100%" }}
//               contentEditable
//               ref={editorRef}
//               onInput={handleEditorChange}
//               className="p-4 border bg-white rounded h-full overflow-y-auto custom-editor"
//             ></div>

//             {showHtmlEditor && (
//               <div className="flex-1 p-2 overflow-y-auto">
//                 <textarea
//                   value={htmlInput}
//                   onChange={handleHtmlInput}
//                   className="w-full h-full p-3 border rounded-lg resize-horizontal bg-gray-100"
//                   placeholder="Edit raw HTML here..."
//                 />
//               </div>
//             )}
//           </div>

//           <div className="flex justify-between items-center mt-4">
//             <button
//               type="button"
//               className="bg-gray-500 text-white px-4 py-2 rounded"
//               onClick={() => setShowHtmlEditor((prev) => !prev)}
//             >
//               {showHtmlEditor ? "Hide HTML Editor" : "Show HTML Editor"}
//             </button>
//             <div className="space-x-2">
//               <button
//                 type="button"
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//                 Send
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Compose;






































// "use client";

// import React, { useState, useRef } from 'react';
// import dynamic from 'next/dynamic';
// import { FaAngleDown, FaPaperclip } from "react-icons/fa";
// import FilePreview from './FilePreview';

// const QuillNoSSRWrapper = dynamic(() => import('react-quill'), { ssr: false });
// import 'react-quill/dist/quill.snow.css';

// const Compose = ({ isOpen, onClose, userEmail }) => {
//   const [message, setMessage] = useState({ to: '', cc: '', bcc: '', subject: '' });
//   const [showCcBcc, setShowCcBcc] = useState(false);
//   const [body, setBody] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [isSending, setIsSending] = useState(false);
//   const dropRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     processFiles(files);
//   };

//   const processFiles = (files) => {
//     const filePromises = files.map((file) => {
//       return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve({
//           name: file.name,
//           content: reader.result.split(',')[1],
//           type: file.type
//         });
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(filePromises).then((filesData) => {
//       setAttachments((prev) => [...prev, ...filesData]);
//     });
//   };

//   const handleRemoveAttachment = (index) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     dropRef.current.classList.add("border-dashed", "border-blue-500");
//   };

//   const handleDragLeave = () => {
//     dropRef.current.classList.remove("border-dashed", "border-blue-500");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     dropRef.current.classList.remove("border-dashed", "border-blue-500");

//     const files = Array.from(e.dataTransfer.files);
//     processFiles(files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!message.to || !message.subject || !body) {
//       alert('Please provide recipient, subject, and body.');
//       return;
//     }

//     setIsSending(true);

//     try {
//       const response = await fetch('/api/messages/sendMail', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           to: message.to,
//           subject: message.subject,
//           body: body,
//           userEmail: userEmail,
//           attachments: attachments,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Error sending email');
//       }

//       alert('Email sent successfully!');
//       setMessage({ to: '', cc: '', bcc: '', subject: '' });
//       setBody('');
//       setAttachments([]);
//       onClose();
//     } catch (error) {
//       console.error('Error:', error.message);
//       alert('Failed to send email. Please try again.');
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const quillModules = {
//     toolbar: [
//       ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
//       ['blockquote', 'code-block'],

//       [{ 'header': 1 }, { 'header': 2 }],               // custom button values
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
//       [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
//       [{ 'direction': 'rtl' }],                         // text direction

//       [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
//       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

//       [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
//       [{ 'font': [] }],
//       [{ 'align': [] }],

//       ['clean'],                                         // remove formatting button
//       ['link', 'image', 'video']                        // link and image, video
//     ]
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//       <div 
//         ref={dropRef} 
//         onDragOver={handleDragOver} 
//         onDragLeave={handleDragLeave} 
//         onDrop={handleDrop} 
//         className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col overflow-auto max-h-screen border"
//       >
//         <h2 className="text-xl font-bold mb-4">Compose a Message</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="to"
//             placeholder="Recipient's Email"
//             value={message.to}
//             onChange={handleChange}
//             className="p-2 border bg-white rounded w-full"
//             required
//           />
//           <div className="flex items-center space-x-2">
//             <button
//               type="button"
//               className="text-gray-500 hover:text-gray-800"
//               onClick={() => setShowCcBcc(!showCcBcc)}
//               title="Add CC/BCC"
//             >
//               <FaAngleDown className={`transform transition-transform ${showCcBcc ? 'rotate-180' : ''}`} />
//             </button>
//             <span className="text-sm text-gray-600">Add CC/BCC</span>
//           </div>
//           {showCcBcc && (
//             <>
//               <input
//                 type="text"
//                 name="cc"
//                 placeholder="CC"
//                 value={message.cc}
//                 onChange={handleChange}
//                 className="p-2 border bg-white rounded w-full"
//               />
//               <input
//                 type="text"
//                 name="bcc"
//                 placeholder="BCC"
//                 value={message.bcc}
//                 onChange={handleChange}
//                 className="p-2 border bg-white rounded w-full"
//               />
//             </>
//           )}
//           <input
//             type="text"
//             name="subject"
//             placeholder="Subject"
//             value={message.subject}
//             onChange={handleChange}
//             className="p-2 border bg-white rounded w-full"
//             required
//           />
//           <div className="h-64 overflow-y-auto">
//             <QuillNoSSRWrapper
//               value={body}
//               onChange={setBody}
//               className="h-full bg-white rounded border overflow-y-auto"
//               theme="snow"
//               modules={quillModules}
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <label className="flex items-center space-x-2 cursor-pointer">
//               <FaPaperclip className="text-gray-500 hover:text-gray-800" />
//               <span className="text-sm text-gray-600">Attach Files</span>
//               <input
//                 type="file"
//                 multiple
//                 className="hidden"
//                 onChange={handleFileChange}
//               />
//             </label>
//           </div>
//           <FilePreview files={attachments} onRemove={handleRemoveAttachment} />
//           <div className="flex justify-end items-center mt-4 space-x-2">
//             <button
//               type="button"
//               className="bg-gray-500 text-white px-4 py-2 rounded"
//               onClick={onClose}
//               disabled={isSending}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               disabled={isSending}
//             >
//               {isSending ? 'Sending...' : 'Send'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Compose;















// "use client";

// import React, { useState, useRef } from "react";
// import dynamic from "next/dynamic";
// import { FaAngleDown, FaPaperclip } from "react-icons/fa";
// import FilePreview from "./FilePreview";

// const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });
// import "react-quill/dist/quill.snow.css";

// const Compose = ({ isOpen, onClose, userEmail }) => {
//   const [message, setMessage] = useState({ to: "", cc: "", bcc: "", subject: "" });
//   const [showCcBcc, setShowCcBcc] = useState(false);
//   const [body, setBody] = useState("");
//   const [attachments, setAttachments] = useState([]);
//   const [isSending, setIsSending] = useState(false);
//   const dropRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     processFiles(files);
//   };

//   const processFiles = (files) => {
//     const filePromises = files.map((file) => {
//       return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = () =>
//           resolve({
//             name: file.name,
//             content: reader.result.split(",")[1], // Base64 content
//             type: file.type,
//           });
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(filePromises).then((filesData) => {
//       setAttachments((prev) => [...prev, ...filesData]);
//     });
//   };

//   const handleRemoveAttachment = (index) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     dropRef.current.classList.add("border-dashed", "border-blue-500");
//   };

//   const handleDragLeave = () => {
//     dropRef.current.classList.remove("border-dashed", "border-blue-500");
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     dropRef.current.classList.remove("border-dashed", "border-blue-500");

//     const files = Array.from(e.dataTransfer.files);
//     processFiles(files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!message.to || !message.subject || !body) {
//       alert("Please provide recipient, subject, and body.");
//       return;
//     }

//     setIsSending(true);

//     try {
//       const response = await fetch("/api/messages/sendMail", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           to: message.to,
//           subject: message.subject,
//           body: body, // Quill content
//           userEmail: userEmail,
//           attachments: attachments, // Pass attachments to the backend
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Error sending email");
//       }

//       alert("Email sent successfully!");
//       setMessage({ to: "", cc: "", bcc: "", subject: "" });
//       setBody("");
//       setAttachments([]);
//       onClose();
//     } catch (error) {
//       console.error("Error:", error.message);
//       alert("Failed to send email. Please try again.");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const quillModules = {
//     toolbar: [
//       ["bold", "italic", "underline", "strike"],
//       ["blockquote", "code-block"],
//       [{ header: 1 }, { header: 2 }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ script: "sub" }, { script: "super" }],
//       [{ indent: "-1" }, { indent: "+1" }],
//       [{ direction: "rtl" }],
//       [{ size: ["small", false, "large", "huge"] }],
//       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//       [{ color: [] }, { background: [] }],
//       [{ font: [] }],
//       [{ align: [] }],
//       ["clean"],
//       ["link", "image", "video"],
//     ],
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//       <div
//         ref={dropRef}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col overflow-auto max-h-screen border"
//       >
//         <h2 className="text-xl font-bold mb-4">Compose a Message</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="to"
//             placeholder="Recipient's Email"
//             value={message.to}
//             onChange={handleChange}
//             className="p-2 border bg-white rounded w-full"
//             required
//           />
//           <div className="flex items-center space-x-2">
//             <button
//               type="button"
//               className="text-gray-500 hover:text-gray-800"
//               onClick={() => setShowCcBcc(!showCcBcc)}
//               title="Add CC/BCC"
//             >
//               <FaAngleDown className={`transform transition-transform ${showCcBcc ? "rotate-180" : ""}`} />
//             </button>
//             <span className="text-sm text-gray-600">Add CC/BCC</span>
//           </div>
//           {showCcBcc && (
//             <>
//               <input
//                 type="text"
//                 name="cc"
//                 placeholder="CC"
//                 value={message.cc}
//                 onChange={handleChange}
//                 className="p-2 border bg-white rounded w-full"
//               />
//               <input
//                 type="text"
//                 name="bcc"
//                 placeholder="BCC"
//                 value={message.bcc}
//                 onChange={handleChange}
//                 className="p-2 border bg-white rounded w-full"
//               />
//             </>
//           )}
//           <input
//             type="text"
//             name="subject"
//             placeholder="Subject"
//             value={message.subject}
//             onChange={handleChange}
//             className="p-2 border bg-white rounded w-full"
//             required
//           />
//           <div className="h-64 overflow-y-auto">
//             <QuillNoSSRWrapper
//               value={body}
//               onChange={setBody}
//               className="h-full bg-white rounded border overflow-y-auto"
//               theme="snow"
//               modules={quillModules}
//             />
//           </div>
//           <div className="flex items-center space-x-2">
//             <label className="flex items-center space-x-2 cursor-pointer">
//               <FaPaperclip className="text-gray-500 hover:text-gray-800" />
//               <span className="text-sm text-gray-600">Attach Files</span>
//               <input type="file" multiple className="hidden" onChange={handleFileChange} />
//             </label>
//           </div>
//           <FilePreview files={attachments} onRemove={handleRemoveAttachment} />
//           <div className="flex justify-end items-center mt-4 space-x-2">
//             <button
//               type="button"
//               className="bg-gray-500 text-white px-4 py-2 rounded"
//               onClick={onClose}
//               disabled={isSending}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//               disabled={isSending}
//             >
//               {isSending ? "Sending..." : "Send"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Compose;
















"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { FaAngleDown, FaPaperclip } from "react-icons/fa";
import FilePreview from "./FilePreview";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Compose = ({ isOpen, onClose, userEmail }) => {
  const [message, setMessage] = useState({ to: "", cc: "", bcc: "", subject: "" });
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const dropRef = useRef(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            name: file.name,
            content: reader.result.split(",")[1], // Base64 content
            type: file.type,
          });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((filesData) => {
      setAttachments((prev) => [...prev, ...filesData]);
    });
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.add("border-dashed", "border-blue-500");
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove("border-dashed", "border-blue-500");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.remove("border-dashed", "border-blue-500");

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.to || !message.subject || !body) {
      alert("Please provide recipient, subject, and body.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/messages/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: message.to,
          subject: message.subject,
          body: body, // Quill content
          userEmail: userEmail,
          attachments: attachments, // Pass attachments to the backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error sending email");
      }

      alert("Email sent successfully!");
      setMessage({ to: "", cc: "", bcc: "", subject: "" });
      setBody("");
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleContextCopy = () => {
    const plainText = body.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
    navigator.clipboard.writeText(plainText).then(
      () => alert("Copied to clipboard!"),
      (err) => console.error("Failed to copy text: ", err)
    );
  };

  const handleContextPaste = () => {
    navigator.clipboard.readText().then(
      (text) => setBody((prev) => `${prev}<p>${text}</p>`),
      (err) => console.error("Failed to paste text: ", err)
    );
  };

  const handleContextCut = () => {
    const plainText = body.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
    navigator.clipboard.writeText(plainText).then(() => setBody(""), (err) => console.error(err));
  };

  const handleAiGenerate = async (templateDescription) => {
    if (!templateDescription) return;

    try {
      const response = await fetch("/api/ai/compose/emailTemplates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateType: templateDescription, userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage((prev) => ({ ...prev, subject: data.subject }));
        setBody(data.body);
      } else {
        alert(data.message || "Error generating email template");
      }
    } catch (error) {
      console.error("Error fetching AI-generated template:", error.message);
      alert("Failed to generate template. Please try again.");
    }
  };

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "video"],
    ],
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col overflow-auto max-h-screen border"
      >
        <h2 className="text-xl font-bold mb-4">Compose a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="to"
            placeholder="Recipient's Email"
            value={message.to}
            onChange={handleChange}
            className="p-2 border bg-white rounded w-full"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={message.subject}
            onChange={handleChange}
            className="p-2 border bg-white rounded w-full"
            required
          />
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setShowCcBcc(!showCcBcc)}
              title="Add CC/BCC"
            >
              <FaAngleDown className={`transform transition-transform ${showCcBcc ? "rotate-180" : ""}`} />
            </button>
            <span className="text-sm text-gray-600">Add CC/BCC</span>
          </div>
          {showCcBcc && (
            <>
              <input
                type="text"
                name="cc"
                placeholder="CC"
                value={message.cc}
                onChange={handleChange}
                className="p-2 border bg-white rounded w-full"
              />
              <input
                type="text"
                name="bcc"
                placeholder="BCC"
                value={message.bcc}
                onChange={handleChange}
                className="p-2 border bg-white rounded w-full"
              />
            </>
          )}
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="h-64 overflow-y-auto">
                <QuillNoSSRWrapper
                  value={body}
                  onChange={setBody}
                  className="h-full bg-white rounded border overflow-y-auto"
                  theme="snow"
                  modules={quillModules}
                />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleContextCopy}>Copy</ContextMenuItem>
              <ContextMenuItem onClick={handleContextPaste}>Paste</ContextMenuItem>
              <ContextMenuItem onClick={handleContextCut}>Cut</ContextMenuItem>
              <ContextMenuItem onClick={() => setIsAiModalOpen(true)}>AI Generate ✨</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <FaPaperclip className="text-gray-500 hover:text-gray-800" />
              <span className="text-sm text-gray-600">Attach Files</span>
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
          </div>
          <FilePreview files={attachments} onRemove={handleRemoveAttachment} />
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
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">AI Email Template</h3>
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Describe the email template you want..."
              className="w-full p-3 border bg-white rounded-lg resize-none h-24 "
            />
            <div className="flex justify-end items-center mt-4 space-x-2">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsAiModalOpen(false);
                  await handleAiGenerate(aiInput);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Compose;
