// "use client";

// import React, { useState } from "react";

// const ScheduleModal = ({ isOpen, onClose, onSchedule }) => {
//   const [selectedDate, setSelectedDate] = useState("");

//   if (!isOpen) return null;

//   const handleSchedule = () => {
//     const selectedDateTime = new Date(selectedDate);
//     if (!selectedDate || selectedDateTime < new Date()) {
//       alert("Please select a valid future date and time.");
//       return;
//     }
//     onSchedule(selectedDateTime);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-lg font-semibold mb-4 text-gray-800">Select the Time to Send the Email</h2>
//         <input
//           type="datetime-local"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="w-full p-3 border rounded-lg mb-4 bg-white text-gray-700 shadow-inner"
//         />
//         <div className="flex justify-end">
//           <button
//             onClick={onClose}
//             className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSchedule}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-md"
//           >
//             Schedule
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScheduleModal;







"use client";

import React, { useState } from "react";

const ScheduleModal = ({ isOpen, onClose, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  const handleSchedule = () => {
    const selectedDateTime = new Date(selectedDate);
    if (!selectedDate || selectedDateTime < new Date()) {
      setError("Please select a valid future date and time.");
      return;
    }
    setError("");
    onSchedule(selectedDateTime);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Select the Time to Send the Email</h2>
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 bg-white text-gray-700 shadow-inner"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-md"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
