import * as Dialog from '@radix-ui/react-dialog';

const GenerateTemplatePopup = ({ templateDescription, setTemplateDescription, handleTemplateGeneration, loadingTemplate, showGeneratePopup, setShowGeneratePopup }) => (
  <Dialog.Root open={showGeneratePopup} onOpenChange={setShowGeneratePopup}>
    <Dialog.Content className="max-w-md w-full rounded-lg shadow-lg bg-white p-6 z-50">
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
    </Dialog.Content>
  </Dialog.Root>
);

export default GenerateTemplatePopup;
