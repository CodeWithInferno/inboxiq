import React, { useState } from 'react';

const EmailTemplate = ({ userEmail }) => {
  const [templateType, setTemplateType] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const templateOptions = [
    { value: 'Meeting Request', label: 'Meeting Request' },
    { value: 'Task Follow-Up', label: 'Task Follow-Up' },
    { value: 'Thank You', label: 'Thank You' },
  ];

  const fetchTemplate = async () => {
    if (!templateType) {
      alert('Please select a template type');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/emailTemplates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType,
          userDetails: `The user email is ${userEmail}`,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedEmail(data.email);
      } else {
        alert(`Error generating template: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      alert('Error generating template.');
    }

    setIsLoading(false);
  };

  return (
    <div className="email-template-container">
      <h2 className="text-lg font-semibold mb-4">Generate Email Template</h2>

      <div className="mb-4">
        <label className="block mb-2">Select Template Type:</label>
        <select
          className="p-2 border rounded-md w-full"
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value)}
        >
          <option value="">Select a Template</option>
          {templateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={fetchTemplate}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Template'}
      </button>

      {generatedEmail && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated Email</h3>
          <textarea
            className="w-full p-4 border rounded-md h-40"
            value={generatedEmail}
            onChange={(e) => setGeneratedEmail(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default EmailTemplate;
