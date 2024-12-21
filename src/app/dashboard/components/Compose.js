//  "use client";

// import React, { useState, useRef, useEffect, useCallback } from "react";
// import dynamic from "next/dynamic";
// import RecipientFields from "./Compose/RecipientFields";
// import SubjectField from "./Compose/SubjectField";
// import BodyEditor from "./Compose/BodyEditor";
// import Attachments from "./Compose/Attachments";
// import ActionButtons from "./Compose/ActionButtons";
// import AIModal from "./Compose/AIModal";
// import "react-quill/dist/quill.snow.css";

// const Compose = ({ isOpen, onClose, userEmail, draftData }) => {
//   const [message, setMessage] = useState({
//     to: "",
//     cc: "",
//     bcc: "",
//     subject: "",
//   });
//   const [body, setBody] = useState("");
//   const [attachments, setAttachments] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isAiModalOpen, setIsAiModalOpen] = useState(false);
//   const [aiInput, setAiInput] = useState("");
//   const saveTimeout = useRef(null); // To track debounce timeout

//   // Effect to populate the form when draftData changes
//   useEffect(() => {
//     if (draftData) {
//       setMessage({
//         to: draftData.to || "",
//         cc: draftData.cc || "",
//         bcc: draftData.bcc || "",
//         subject: draftData.subject || "",
//       });
//       setBody(draftData.body || "");
//       setAttachments(draftData.attachments || []);
//     }
//   }, [draftData]);

//   // Auto-save draft API call
//   const saveDraft = useCallback(async () => {
//     if (!userEmail) return;
//     setIsSaving(true);
//     try {
//       const response = await fetch("/api/drafts/save", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to: message.to,
//           cc: message.cc,
//           bcc: message.bcc,
//           subject: message.subject,
//           body,
//           attachments,
//           userEmail,
//           draftId: draftData?.id || null, // Pass draft ID if editing an existing draft
//         }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to save draft");
//       }
//       console.log("Draft saved successfully");
//     } catch (error) {
//       console.error("Error saving draft:", error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [message, body, attachments, userEmail, draftData?.id]);

//   // Debounce function to delay saveDraft calls
//   const handleAutoSave = () => {
//     if (saveTimeout.current) clearTimeout(saveTimeout.current); // Clear previous timeout
//     saveTimeout.current = setTimeout(() => {
//       saveDraft();
//     }, 500); // Save after 500ms of inactivity
//   };

//   // Update message state and trigger auto-save
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
//     handleAutoSave();
//   };

//   // Update body and trigger auto-save
//   const handleBodyChange = (value) => {
//     setBody(value);
//     handleAutoSave();
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setAttachments((prev) => [...prev, ...files]);
//     handleAutoSave();
//   };

//   const handleRemoveAttachment = (index) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//     handleAutoSave();
//   };

//   const handleAiGenerate = async () => {
//     if (!aiInput) return;
//     try {
//       const response = await fetch("/api/ai/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ input: aiInput, userEmail }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to generate content");
//       }
//       setBody((prevBody) => `${prevBody}\n${data.generatedContent}`);
//       setAiInput("");
//     } catch (error) {
//       console.error("Error generating content:", error.message);
//     } finally {
//       setIsAiModalOpen(false);
//     }
//   };

//   useEffect(() => {
//     // Cleanup timeout on component unmount
//     return () => {
//       if (saveTimeout.current) clearTimeout(saveTimeout.current);
//     };
//   }, []);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col overflow-auto max-h-screen">
//         <h2 className="text-xl font-bold mb-4">Compose a Message</h2>
//         <form className="space-y-4">
//           <RecipientFields
//             message={message}
//             handleChange={handleChange}
//             showCcBcc={!!message.cc || !!message.bcc}
//             setShowCcBcc={() => {}}
//           />
//           <SubjectField message={message} handleChange={handleChange} />
//           <BodyEditor body={body} setBody={handleBodyChange} />
//           <Attachments
//             attachments={attachments}
//             handleFileChange={handleFileChange}
//             handleRemoveAttachment={handleRemoveAttachment}
//           />
//           <ActionButtons isSaving={isSaving} onClose={onClose} />
//         </form>
//         <AIModal
//           isOpen={isAiModalOpen}
//           setIsOpen={setIsAiModalOpen}
//           aiInput={aiInput}
//           setAiInput={setAiInput}
//           handleAiGenerate={handleAiGenerate}
//         />
//         {isSaving && <p className="text-gray-500 text-sm mt-2">Saving draft...</p>}
//       </div>
//     </div>
//   );
// };

// export default Compose;










"use client";

import { FaPaperclip } from "react-icons/fa";
import FilePreview from "./Compose/FilePreview";
import React, { useState, useRef, useEffect, useCallback } from "react";
import RecipientFields from "./Compose/RecipientFields";
import SubjectField from "./Compose/SubjectField";
import BodyEditor from "./Compose/BodyEditor";
import ActionButtons from "./Compose/ActionButtons";
import AIModal from "./Compose/AIModal";
import ScheduleModal from "./Compose/ScheduleModal";
import Attachments from "./Compose/Attachments";
import "react-quill/dist/quill.snow.css";

const Compose = ({ isOpen, onClose, userEmail, draftData }) => {
  const [message, setMessage] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
  });
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");

  // Reset the form state when the Compose modal is opened or closed
  useEffect(() => {
    if (isOpen && !draftData) {
      setMessage({ to: "", cc: "", bcc: "", subject: "" });
      setBody("");
      setAttachments([]);
    }
  }, [isOpen, draftData]);

  // Populate form with draft data when available
  useEffect(() => {
    if (draftData) {
      setMessage({
        to: draftData.to || "",
        cc: draftData.cc || "",
        bcc: draftData.bcc || "",
        subject: draftData.subject || "",
      });
      setBody(draftData.body || "");
      setAttachments(draftData.attachments || []);
    }
  }, [draftData]);

  // Save draft
  const saveDraft = useCallback(async () => {
    if (!userEmail) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/drafts/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: message.to,
          cc: message.cc,
          bcc: message.bcc,
          subject: message.subject,
          body,
          attachments,
          userEmail,
          draftId: draftData?.id || null,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save draft");
      }
      console.log("Draft saved successfully");
    } catch (error) {
      console.error("Error saving draft:", error.message);
    } finally {
      setIsSaving(false);
    }
  }, [message, body, attachments, userEmail, draftData?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (value) => {
    setBody(value);
  };

  // const handleFileChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setAttachments((prev) => [...prev, ...files]);
  // };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    const readFiles = await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              type: file.type,
              content: reader.result.split(",")[1], // Extract base64 content
            });
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      })
    );

    setAttachments((prev) => [...prev, ...readFiles]);
  };




  const handleRemoveAttachment = (fileToRemove) => {
    setAttachments((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/messages/sendMail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: message.to,
          cc: message.cc,
          bcc: message.bcc,
          subject: message.subject,
          body,
          attachments,
          userEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        throw new Error("Failed to send email");
      }

      const data = await response.json();
      console.log("Email sent successfully:", data);

      // Reset form after successful submission
      setMessage({ to: "", cc: "", bcc: "", subject: "" });
      setBody("");
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error("Error sending email:", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    saveDraft(); // Save draft when cancel is clicked
    onClose(); // Close the modal
  };

  const handleSchedule = async (scheduledTime) => {
    try {
      const payload = {
        to: message.to,
        cc: message.cc,
        bcc: message.bcc,
        subject: message.subject,
        body,
        attachments,
        userEmail,
        scheduledTime: scheduledTime.toISOString(),
      };
  
      console.log("Payload to /api/Schedule/create:", payload);
  
      const response = await fetch("/api/Schedule/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from API:", errorData);
        throw new Error("Failed to schedule email");
      }
  
      const data = await response.json();
      console.log("Email scheduled successfully:", data);
    } catch (error) {
      console.error("Error scheduling email:", error.message);
    }
  };
  

  const handleAiGenerate = async () => {
    if (!aiInput) return;
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: aiInput, userEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate content");
      }
      setBody((prevBody) => `${prevBody}\n${data.generatedContent}`);
      setAiInput("");
    } catch (error) {
      console.error("Error generating content:", error.message);
    } finally {
      setIsAiModalOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Compose Email</h2>
        <form>
          <RecipientFields
            message={message}
            handleChange={handleChange}
            showCcBcc={showCcBcc}
            setShowCcBcc={setShowCcBcc}
          />
          <SubjectField message={message} handleChange={handleChange} />
          <BodyEditor body={body} setBody={handleBodyChange} />
          <Attachments
            attachments={attachments}
            handleFileChange={handleFileChange}
            handleRemoveAttachment={(index) => {
              setAttachments((prev) => prev.filter((_, i) => i !== index));
            }}
          />

          <ActionButtons
            isSending={isSaving}
            onClose={handleCancel}
            handleSubmit={handleSubmit}
            onScheduleClick={() => setIsScheduleModalOpen(true)}
          />
        </form>
        <AIModal
          isOpen={isAiModalOpen}
          setIsOpen={setIsAiModalOpen}
          aiInput={aiInput}
          setAiInput={setAiInput}
          handleAiGenerate={handleAiGenerate}
        />
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          onSchedule={handleSchedule}
        />
      </div>
    </div>
  );
};

export default Compose;
