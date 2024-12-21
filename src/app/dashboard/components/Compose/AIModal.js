'use client';

const AIModal = ({ isOpen, setIsOpen, aiInput, setAiInput, handleAiGenerate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">AI Email Template</h3>
        <textarea
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="Describe the email template you want..."
          className="w-full p-3 border bg-white rounded-lg resize-none h-24"
        />
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel1
          </button>
          <button
            onClick={async () => {
              setIsOpen(false);
              await handleAiGenerate(aiInput);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
