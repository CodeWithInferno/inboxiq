import React, { useEffect, useState } from 'react';

const EmailThreads = ({ threads }) => {
  const [selectedThread, setSelectedThread] = useState(null);

  const handleThreadClick = (thread) => {
    setSelectedThread(thread);
  };

  if (!threads || threads.length === 0) {
    return <p>No emails found.</p>;
  }

  return (
    <div>
      {selectedThread ? (
        <div>
          <h2>Thread: {selectedThread.threadId}</h2>
          {selectedThread.messages.map((message, index) => (
            <div key={message.id} className="border p-4 my-2">
              <h3>{message.subject}</h3>
              <p><strong>From:</strong> {message.from}</p>
              <p><strong>Date:</strong> {new Date(message.timestamp).toLocaleString()}</p>
              <p>{message.snippet}</p>
              <div dangerouslySetInnerHTML={{ __html: message.body }} />
            </div>
          ))}
          <button onClick={() => setSelectedThread(null)} className="mt-4">Back to Threads</button>
        </div>
      ) : (
        <div>
          <h1>Email Threads</h1>
          <ul>
            {threads.map((thread) => (
              <li key={thread.threadId} className="border p-4 my-2 cursor-pointer" onClick={() => handleThreadClick(thread)}>
                <h3>Thread ID: {thread.threadId}</h3>
                <p>{thread.messages[0]?.snippet}</p> {/* Show first email snippet */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmailThreads;
