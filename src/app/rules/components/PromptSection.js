'use client';
import React, { useState } from 'react';

const PromptSection = ({ promptText, setPromptText }) => {
  const handleTextChange = (e) => {
    setPromptText(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/Rules/save-rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptText }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Rule saved successfully!');
      } else {
        alert(`Failed to save rule: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('An error occurred while saving the rule.');
    }
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-md w-2/3">
      <h2 className="text-lg font-semibold mb-2">How your AI personal assistant should handle your emails</h2>
      <p className="text-sm text-gray-600 mb-4">Write a prompt for your assistant to follow.</p>
      <textarea
        className="w-full h-80 p-3 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="* Label newsletters as 'Newsletter' and archive them\n* Label marketing emails as 'Marketing' and archive them..."
        value={promptText}
        onChange={handleTextChange}
      />
      <div className="flex space-x-4 mt-4">
        <button onClick={handleSave} className="bg-black text-white px-4 py-2 rounded">
          Save
        </button>
        <button className="bg-white border text-black px-4 py-2 rounded">Create Rules Manually</button>
        <button className="bg-white border text-black px-4 py-2 rounded">AI Generate Prompt</button>
      </div>
    </div>
  );
};

export default PromptSection;
