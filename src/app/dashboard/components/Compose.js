 "use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import RecipientFields from "./compose/RecipientFields";
import SubjectField from "./compose/SubjectField";
import BodyEditor from "./compose/BodyEditor";
import Attachments from "./compose/Attachments";
import ActionButtons from "./compose/ActionButtons";
import AIModal from "./compose/AIModal";
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
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const saveTimeout = useRef(null); // To track debounce timeout

  // Effect to populate the form when draftData changes
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

  // Auto-save draft API call
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
          draftId: draftData?.id || null, // Pass draft ID if editing an existing draft
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

  // Debounce function to delay saveDraft calls
  const handleAutoSave = () => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current); // Clear previous timeout
    saveTimeout.current = setTimeout(() => {
      saveDraft();
    }, 500); // Save after 500ms of inactivity
  };

  // Update message state and trigger auto-save
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prevMessage) => ({ ...prevMessage, [name]: value }));
    handleAutoSave();
  };

  // Update body and trigger auto-save
  const handleBodyChange = (value) => {
    setBody(value);
    handleAutoSave();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
    handleAutoSave();
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    handleAutoSave();
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

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col overflow-auto max-h-screen">
        <h2 className="text-xl font-bold mb-4">Compose a Message</h2>
        <form className="space-y-4">
          <RecipientFields
            message={message}
            handleChange={handleChange}
            showCcBcc={!!message.cc || !!message.bcc}
            setShowCcBcc={() => {}}
          />
          <SubjectField message={message} handleChange={handleChange} />
          <BodyEditor body={body} setBody={handleBodyChange} />
          <Attachments
            attachments={attachments}
            handleFileChange={handleFileChange}
            handleRemoveAttachment={handleRemoveAttachment}
          />
          <ActionButtons isSaving={isSaving} onClose={onClose} />
        </form>
        <AIModal
          isOpen={isAiModalOpen}
          setIsOpen={setIsAiModalOpen}
          aiInput={aiInput}
          setAiInput={setAiInput}
          handleAiGenerate={handleAiGenerate}
        />
        {isSaving && <p className="text-gray-500 text-sm mt-2">Saving draft...</p>}
      </div>
    </div>
  );
};

export default Compose;
