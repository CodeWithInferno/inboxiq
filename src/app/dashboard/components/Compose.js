// import React, { useState, useRef } from 'react';
// import { FaHtml5 } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";



// const Compose = ({ isOpen, onClose, userEmail }) => {
//   const [message, setMessage] = useState({
//     to: '',
//     subject: '',
//   });
//   const [loadingTemplate, setLoadingTemplate] = useState(false);
//   const [templateDescription, setTemplateDescription] = useState('');
//   const [showHtmlInput, setShowHtmlInput] = useState(false);
//   const [htmlInput, setHtmlInput] = useState(''); 
//   const editorRef = useRef(null); // Ref for the contentEditable div

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
//   };

//   const handleHtmlInput = (e) => {
//     const html = e.target.value;
//     setHtmlInput(html);
//     editorRef.current.innerHTML = html; // Update the editor preview with pasted HTML
//   };

//   const handleTemplateGeneration = async () => {
//     if (!templateDescription) {
//       alert('Please provide a description for the template.');
//       return;
//     }

//     setLoadingTemplate(true);

//     try {
//       const response = await fetch('/api/ai/emailTemplates', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ templateType: templateDescription, userEmail }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setMessage((prevMessage) => ({
//           ...prevMessage,
//           subject: data.subject,
//         }));
//         editorRef.current.innerHTML = data.body; // Populate editor with template
//         setHtmlInput(data.body); // Sync HTML input with generated template
//       } else {
//         const errorData = await response.json();
//         alert(`Failed to load template: ${errorData.message}`);
//       }
//     } catch (error) {
//       console.error('Error fetching template:', error);
//       alert('Error generating the template.');
//     }

//     setLoadingTemplate(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const body = editorRef.current.innerHTML; // Fetch HTML content directly from the editor

//     try {
//       const response = await fetch('/api/messages/sendMail', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           to: message.to,
//           subject: message.subject,
//           body,
//           userEmail,
//         }),
//       });

//       if (response.ok) {
//         alert('Email sent successfully!');
//         onClose();
//         setMessage({ to: '', subject: '' });
//         editorRef.current.innerHTML = ''; // Clear editor content
//         setHtmlInput(''); // Clear HTML input after sending
//       } else {
//         const data = await response.json();
//         alert(`Failed to send email: ${data.message}`);
//       }
//     } catch (error) {
//       console.error('Error sending email:', error);
//       alert('Error occurred while sending the message.');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex">
//         <div className="w-2/3">
//           <h2 className="text-xl font-bold mb-4">Compose a Message</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="email"
//               name="to"
//               placeholder="Recipient's Email"
//               value={message.to}
//               onChange={handleChange}
//               className="p-2 border bg-white rounded w-full"
//               required
//             />
//             <input
//               type="text"
//               name="subject"
//               placeholder="Subject"
//               value={message.subject}
//               onChange={handleChange}
//               className="p-2 border bg-white rounded w-full"
//               required
//             />

//             <div className="flex justify-between items-center">
//               <label className="font-semibold">Custom Html:</label>
//               <button
//                 type="button"
//                 onClick={() => setShowHtmlInput(!showHtmlInput)}
//                 className="text-blue-500 text-3xl underline"
//               >
//                 {showHtmlInput ? <IoMdClose /> : <FaHtml5 />}
//               </button>
//             </div>

//             {showHtmlInput && (
//               <textarea
//                 value={htmlInput}
//                 onChange={handleHtmlInput}
//                 placeholder="Paste your HTML here..."
//                 className="w-full p-2 border bg-white rounded h-24 mb-4"
//               />
//             )}

//             <div
//               contentEditable
//               ref={editorRef}
//               className="w-full p-4 border bg-white rounded h-96 overflow-y-auto mb-4"
//               style={{ minHeight: '200px' }}
//               placeholder="Write your message here..."
//               suppressContentEditableWarning
//             ></div>

//             <div className="flex justify-end space-x-2">
//               <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
//                 Cancel
//               </button>
//               <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//                 Send
//               </button>
//             </div>
//           </form>
//         </div>

//         <div className="w-1/3 ml-6">
//           <h2 className="text-lg font-bold mb-4">Generate AI Email Template</h2>

//           <textarea
//             placeholder="Describe the type of email template you need (e.g., meeting request, follow-up, etc.)"
//             className="w-full p-2 border bg-white rounded"
//             value={templateDescription}
//             onChange={(e) => setTemplateDescription(e.target.value)}
//             rows="5"
//           />

//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
//             onClick={handleTemplateGeneration}
//             disabled={loadingTemplate}
//           >
//             {loadingTemplate ? 'Generating Template...' : 'Generate Template'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Compose;









// import React, { useState, useRef } from 'react';
// import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignCenter, FaAlignLeft, FaAlignRight, FaHeading, FaHtml5 } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import { ContextMenu, ContextMenuItem, ContextMenuTrigger, ContextMenuContent } from "@/components/ui/context-menu";
// import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
// import Draggable from 'react-draggable';

// const Compose = ({ isOpen, onClose, userEmail }) => {
//   const [message, setMessage] = useState({ to: '', cc: '', bcc: '', subject: '' });
//   const [showHtmlPopup, setShowHtmlPopup] = useState(false);
//   const [htmlInput, setHtmlInput] = useState('');
//   const editorRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
//   };

//   const handleHtmlInput = (e) => {
//     const html = e.target.value;
//     setHtmlInput(html);
//     editorRef.current.innerHTML = html; // Sync HTML editor with main content
//   };

//   const applyFormat = (command, value = null) => {
//     document.execCommand(command, false, value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const body = editorRef.current.innerHTML;

//     try {
//       const response = await fetch('/api/messages/sendMail', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           to: message.to,
//           cc: message.cc,
//           bcc: message.bcc,
//           subject: message.subject,
//           body,
//           userEmail,
//         }),
//       });

//       if (response.ok) {
//         alert('Email sent successfully!');
//         onClose();
//         setMessage({ to: '', cc: '', bcc: '', subject: '' });
//         editorRef.current.innerHTML = '';
//         setHtmlInput('');
//       } else {
//         const data = await response.json();
//         alert(`Failed to send email: ${data.message}`);
//       }
//     } catch (error) {
//       console.error('Error sending email:', error);
//       alert('Error occurred while sending the message.');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
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
//             type="email"
//             name="cc"
//             placeholder="CC"
//             value={message.cc}
//             onChange={handleChange}
//             className="p-2 border bg-white rounded w-full"
//           />
//           <input
//             type="email"
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

//           {/* Formatting Toolbar */}
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

//             {/* Dialog Trigger for HTML Popup */}
//             <Dialog>
//               <DialogTrigger asChild>
//                 <button
//                   type="button"
//                   onClick={() => setShowHtmlPopup(true)}
//                   title="HTML Editor"
//                   className="p-1 hover:bg-gray-300 rounded"
//                 >
//                   {showHtmlPopup ? <IoMdClose /> : <FaHtml5 />}
//                 </button>
//               </DialogTrigger>
//             </Dialog>
//           </div>

//           {/* Main Editor with Context Menu */}
//           <ContextMenu>
//             <ContextMenuTrigger>
//               <div
//                 contentEditable
//                 ref={editorRef}
//                 className="p-4 border bg-white rounded h-64 overflow-y-auto w-full"
//                 style={{ outline: 'none', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
//               >
//                 {/* Main Editor Content */}
//               </div>
//             </ContextMenuTrigger>
//             <ContextMenuContent>
//               <ContextMenuItem onClick={() => applyFormat('bold')}>Bold</ContextMenuItem>
//               <ContextMenuItem onClick={() => applyFormat('italic')}>Italic</ContextMenuItem>
//               <ContextMenuItem onClick={() => applyFormat('underline')}>Underline</ContextMenuItem>
//               <ContextMenuItem onClick={() => applyFormat('insertOrderedList')}>Numbered List</ContextMenuItem>
//               <ContextMenuItem onClick={() => applyFormat('insertUnorderedList')}>Bullet List</ContextMenuItem>
//               <ContextMenuItem onClick={() => applyFormat('justifyLeft')}>Align Left</ContextMenuItem>
//               <ContextMenuItem onClick={() => applyFormat('justifyCenter')}>Align Center</ContextMenuItem>
//               <ContextMenuItem onClick={() => applyFormat('justifyRight')}>Align Right</ContextMenuItem>
//               <ContextMenuItem onClick={() => applyFormat('formatBlock', 'H2')}>Heading</ContextMenuItem>
//             </ContextMenuContent>
//           </ContextMenu>

//           {/* Send & Cancel Buttons */}
//           <div className="flex justify-end space-x-2 mt-4">
//             <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//               Send
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Draggable HTML Editor Popup */}
//       <Dialog open={showHtmlPopup} onOpenChange={setShowHtmlPopup}>
//         <Draggable handle=".drag-handle">
//           <DialogContent className="max-w-md w-full rounded-lg shadow-lg bg-cream-light p-4 z-50">
//             <div className="flex justify-between items-center drag-handle cursor-move p-2 bg-cream-dark rounded-t-lg">
//               <h2 className="text-lg font-semibold text-gray-800">HTML Editor</h2>
//               <DialogClose asChild>
//                 <button className="text-gray-500 hover:text-gray-700 transition-all">
//                   <IoMdClose size={20} />
//                 </button>
//               </DialogClose>
//             </div>
//             <div className="p-4">
//               <textarea
//                 value={htmlInput}
//                 onChange={handleHtmlInput}
//                 placeholder="Edit HTML here..."
//                 className="w-full p-3 border rounded-lg h-64 resize-none bg-gray-100 shadow-inner"
//               />
//             </div>
//           </DialogContent>
//         </Draggable>
//       </Dialog>
//     </div>
//   );
// };

// export default Compose;




"use client";






import React, { useState, useRef, useEffect } from 'react';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignCenter, FaAlignLeft, FaAlignRight, FaHeading, FaHtml5 } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { ContextMenu, ContextMenuItem, ContextMenuTrigger, ContextMenuContent } from "@/components/ui/context-menu";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import Draggable from 'react-draggable';

const Compose = ({ isOpen, onClose, userEmail }) => {
  const [message, setMessage] = useState({ to: '', cc: '', bcc: '', subject: '' });
  const [showHtmlPopup, setShowHtmlPopup] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');
  const [showGeneratePopup, setShowGeneratePopup] = useState(false);
  const [templateDescription, setTemplateDescription] = useState('');
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const editorRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
  };

// Handle HTML input in the popup and sync it with the main editor
const handleHtmlInput = (e) => {
  const html = e.target.value.trim(); // Trim to prevent extra spaces or line breaks
  setHtmlInput(html);
  if (editorRef.current) {
    editorRef.current.innerHTML = html; // Sync HTML editor with main content
  }
};

// Update the editor content when `htmlInput` changes
useEffect(() => {
  if (editorRef.current) {
    editorRef.current.innerHTML = htmlInput; // Set innerHTML without extra tags or spaces
  }
}, [htmlInput]);


  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleTemplateGeneration = async () => {
    if (!templateDescription) {
      alert('Please provide a description for the template.');
      return;
    }

    setLoadingTemplate(true);
    try {
      const response = await fetch('/api/ai/compose/emailTemplates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateType: templateDescription, userEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        editorRef.current.innerHTML = data.body; // Populate editor with generated template
        setHtmlInput(data.body); // Sync HTML input with generated template
      } else {
        const errorData = await response.json();
        alert(`Failed to load template: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      alert('Error generating the template.');
    } finally {
      setLoadingTemplate(false);
      setShowGeneratePopup(false); // Close the popup after generation
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = editorRef.current.innerHTML;

    try {
      const response = await fetch('/api/messages/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: message.to,
          cc: message.cc,
          bcc: message.bcc,
          subject: message.subject,
          body,
          userEmail,
        }),
      });

      if (response.ok) {
        alert('Email sent successfully!');
        onClose();
        setMessage({ to: '', cc: '', bcc: '', subject: '' });
        editorRef.current.innerHTML = '';
        setHtmlInput('');
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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col overflow-auto max-h-screen">
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
            type="email"
            name="cc"
            placeholder="CC"
            value={message.cc}
            onChange={handleChange}
            className="p-2 border bg-white rounded w-full"
          />
          <input
            type="email"
            name="bcc"
            placeholder="BCC"
            value={message.bcc}
            onChange={handleChange}
            className="p-2 border bg-white rounded w-full"
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

          {/* Formatting Toolbar */}
          <div className="flex space-x-2 mb-2 bg-gray-200 p-2 rounded-md">
            <button type="button" onClick={() => applyFormat('bold')} title="Bold" className="p-1 hover:bg-gray-300 rounded"><FaBold /></button>
            <button type="button" onClick={() => applyFormat('italic')} title="Italic" className="p-1 hover:bg-gray-300 rounded"><FaItalic /></button>
            <button type="button" onClick={() => applyFormat('underline')} title="Underline" className="p-1 hover:bg-gray-300 rounded"><FaUnderline /></button>
            <button type="button" onClick={() => applyFormat('insertOrderedList')} title="Numbered List" className="p-1 hover:bg-gray-300 rounded"><FaListOl /></button>
            <button type="button" onClick={() => applyFormat('insertUnorderedList')} title="Bullet List" className="p-1 hover:bg-gray-300 rounded"><FaListUl /></button>
            <button type="button" onClick={() => applyFormat('justifyLeft')} title="Align Left" className="p-1 hover:bg-gray-300 rounded"><FaAlignLeft /></button>
            <button type="button" onClick={() => applyFormat('justifyCenter')} title="Align Center" className="p-1 hover:bg-gray-300 rounded"><FaAlignCenter /></button>
            <button type="button" onClick={() => applyFormat('justifyRight')} title="Align Right" className="p-1 hover:bg-gray-300 rounded"><FaAlignRight /></button>
            <button type="button" onClick={() => applyFormat('formatBlock', 'H2')} title="Heading" className="p-1 hover:bg-gray-300 rounded"><FaHeading /></button>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowHtmlPopup(true)}
                  title="HTML Editor"
                  className="p-1 hover:bg-gray-300 rounded"
                >
                  {showHtmlPopup ? <IoMdClose /> : <FaHtml5 />}
                </button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Main Editor with Context Menu */}
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                contentEditable
                ref={editorRef}
                className="p-4 border bg-white rounded h-64 overflow-y-auto w-full"
                style={{ outline: 'none', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: htmlInput }}
              >
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => setShowGeneratePopup(true)}>
                ✨ Generate Email
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          {/* Send & Cancel Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Draggable HTML Editor Popup */}
      <Dialog open={showHtmlPopup} onOpenChange={setShowHtmlPopup}>
        <Draggable handle=".drag-handle">
          <DialogContent className="max-w-md w-full rounded-lg shadow-xl bg-white p-4 z-50 border border-gray-200">
            <div className="flex justify-between items-center drag-handle cursor-move p-2 bg-gray-100 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-700">HTML Editor</h2>
              <DialogClose asChild>
              </DialogClose>
            </div>
            <div className="p-4">
              <textarea
                value={htmlInput}
                onChange={handleHtmlInput}
                placeholder="Edit HTML here..."
                className="w-full p-3 border rounded-lg h-64 resize-none bg-gray-50 shadow-inner"
              />
            </div>
          </DialogContent>
        </Draggable>
      </Dialog>

      {/* Generate Email Template Popup */}
      <Dialog open={showGeneratePopup} onOpenChange={setShowGeneratePopup}>
        <DialogContent className="max-w-md w-full rounded-lg shadow-lg bg-white p-6 z-50">
          <h2 className="text-lg font-semibold mb-4">Generate Email Template</h2>
          <textarea
            placeholder="Describe the type of email template you need..."
            className="w-full p-3 border rounded-lg h-32 resize-none"
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
          />
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setShowGeneratePopup(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleTemplateGeneration}
              className="bg-green-500 text-white px-4 py-2 rounded"
              disabled={loadingTemplate}
            >
              {loadingTemplate ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Compose;
