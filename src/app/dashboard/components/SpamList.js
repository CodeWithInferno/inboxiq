const SpamList = ({ spam, handleCompose, handleOpenMessage }) => {
    return (
      <div className="w-full bg-white p-4 border-r overflow-y-auto h-screen max-h-screen">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
          onClick={handleCompose}
        >
          Compose
        </button>
        <div className=" text-black space-y-4">
          {spam.length > 0 ? (
            spam.map((message) => (
              <div
                key={message.id}
                className="p-4 border-b cursor-pointer hover:bg-gray-200"
                onClick={() => handleOpenMessage(message)}
              >
                <h3 className="font-bold">{message.from}</h3>
                <p className="text-sm text-gray-600">{message.subject}</p>
                <p className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  {message.body.slice(0, 100)}... {/* Truncate body */}
                </p>
              </div>
            ))
          ) : (
            <p>No spam emails available.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default SpamList;
  