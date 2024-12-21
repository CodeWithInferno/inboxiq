'use client';

import React, { useState } from "react";

const RecipientFields = ({ message, handleChange }) => {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [emails, setEmails] = useState(message.to.split(",").filter((email) => email.trim() !== "") || []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const email = e.target.value.trim();
      if (email && !emails.includes(email)) {
        const updatedEmails = [...emails, email];
        setEmails(updatedEmails);

        // Update the parent state
        handleChange({
          target: { name: "to", value: updatedEmails.join(",") },
        });
      }
      e.target.value = ""; // Clear input field
    }
  };

  const removeEmail = (emailToRemove) => {
    const updatedEmails = emails.filter((email) => email !== emailToRemove);
    setEmails(updatedEmails);

    // Update the parent state
    handleChange({
      target: { name: "to", value: updatedEmails.join(",") },
    });
  };

  return (
    <div className="space-y-4">
      {/* To Field */}
      <div className="relative">
        <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">To</label>
        <div className="flex flex-wrap items-center border border-gray-300 rounded-lg p-2 bg-gray-50 shadow-sm w-full focus-within:ring-2 focus-within:ring-blue-500">
          {emails.map((email, index) => (
            <span
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full m-1 text-sm"
            >
              {email}
              <button
                type="button"
                className="ml-2 text-blue-800 hover:text-red-500"
                onClick={() => removeEmail(email)}
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Enter recipient emails"
            className="outline-none flex-grow bg-transparent p-1 text-gray-700 placeholder-gray-400 text-sm"
            onKeyDown={handleKeyDown}
          />
        </div>
        {/* Cc and Bcc Buttons */}
        <div className="flex space-x-4 mt-2 text-sm">
          <button
            type="button"
            className={`text-blue-500 hover:underline ${showCc ? "font-bold" : ""}`}
            onClick={() => setShowCc(!showCc)}
          >
            Cc
          </button>
          <button
            type="button"
            className={`text-blue-500 hover:underline ${showBcc ? "font-bold" : ""}`}
            onClick={() => setShowBcc(!showBcc)}
          >
            Bcc
          </button>
        </div>
      </div>

      {/* Cc Field */}
      {showCc && (
        <div className="relative">
          <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">Cc</label>
          <input
            type="text"
            name="cc"
            placeholder="Enter CC emails"
            value={message.cc}
            onChange={handleChange}
            className="p-2 border mb-2 border-gray-300 rounded-lg bg-gray-50 shadow-sm w-full focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
          />
        </div>
      )}

      {/* Bcc Field */}
      {showBcc && (
        <div className="relative">
          <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">Bcc</label>
          <input
            type="text"
            name="bcc"
            placeholder="Enter BCC emails"
            value={message.bcc}
            onChange={handleChange}
            className="p-2 border mb-2 border-gray-300 rounded-lg bg-gray-50 shadow-sm w-full focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
          />
        </div>
      )}
    </div>
  );
};

export default RecipientFields;
