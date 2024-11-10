import React from 'react';

const examples = [
  "Label newsletters as 'Newsletter' and archive them",
  "Label marketing emails as 'Marketing' and archive them",
  "Label emails that require a reply as 'Reply Required'",
  "Label urgent emails as 'Urgent'",
  "Label receipts as 'Receipt' and forward them to jane@accounting.com",
  "Label pitch decks as 'Pitch Deck' and forward them to john@investing.com",
  "Reply to cold emails by telling them to check out Inbox Zero. Then mark them as spam",
  "Label high priority emails as 'High Priority'",
];

const ExamplesPanel = ({ onExampleClick }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-1/3">
      <h3 className="text-lg font-semibold mb-4">Examples</h3>
      <div className="space-y-2">
        {examples.map((example, index) => (
          <button
            key={index}
            className="w-full text-left px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={() => onExampleClick(example)}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplesPanel;
