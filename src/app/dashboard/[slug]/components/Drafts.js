// 'use client';

// import { useEffect, useState } from 'react';

// const Drafts = ({ email }) => {
//   const [drafts, setDrafts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchDrafts = async () => {
//     try {
//       const response = await fetch(`/api/drafts/fetch?email=${encodeURIComponent(email)}`);
//       const data = await response.json();
//       setDrafts(data.drafts || []);
//     } catch (error) {
//       console.error('Error fetching drafts:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (email) {
//       fetchDrafts();
//     }
//   }, [email]);

//   if (loading) return <p>Loading drafts...</p>;
//   if (drafts.length === 0) return <p>No drafts found.</p>;

//   return (
//     <div className="drafts-container">
//       <h2 className="text-xl font-semibold">Drafts</h2>
//       <ul className="space-y-4">
//         {drafts.map((draft) => (
//           <li key={draft.id} className="bg-white p-4 rounded shadow">
//             <h3 className="font-bold">{draft.subject || '(No Subject)'}</h3>
//             <p className="text-gray-600">To: {draft.to || '(Not specified)'}</p>
//             <p className="text-gray-800 truncate">{draft.snippet}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Drafts;









'use client';

import { useEffect, useState } from 'react';

const Drafts = ({ email, onDraftClick }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = async () => {
    try {
      const response = await fetch(`/api/drafts/fetch?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setDrafts(data.drafts || []);
    } catch (error) {
      console.error('Error fetching drafts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchDrafts();
    }
  }, [email]);

  if (loading) return <p>Loading drafts...</p>;
  if (drafts.length === 0) return <p>No drafts found.</p>;

  return (
    <div className="drafts-container">
      <ul className="space-y-4">
        {drafts.map((draft) => (
          <li
            key={draft.id}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => onDraftClick(draft)} // Pass the draft data on click
          >
            <h3 className="font-bold">{draft.subject || '(No Subject)'}</h3>
            <p className="text-gray-600">To: {draft.to || '(Not specified)'}</p>
            <p className="text-gray-800 truncate">{draft.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Drafts;
