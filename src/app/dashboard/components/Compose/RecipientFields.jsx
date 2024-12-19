'use client';

const RecipientFields = ({ message, handleChange, showCcBcc, setShowCcBcc }) => {
  return (
    <div>
      <input
        type="email"
        name="to"
        placeholder="Recipient's Email"
        value={message.to}
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
          Toggle CC/BCC
        </button>
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
    </div>
  );
};

export default RecipientFields;
