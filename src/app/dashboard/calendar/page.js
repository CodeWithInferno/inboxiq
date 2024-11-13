// "use client";

// import React, { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { DateTime } from 'luxon';
// import Sidebar from '../components/Sidebar';

// const Calendar = () => {
//   const [currentView, setCurrentView] = useState('dayGridMonth');
//   const [events, setEvents] = useState([]);

//   // Fetch events from the API
//   const fetchEvents = async () => {
//     try {
//       const response = await fetch('/api/user/calendar/get-events');
//       if (!response.ok) {
//         throw new Error("Failed to fetch events");
//       }
//       const responseData = await response.json();

//       // Log raw data from API to ensure structure
//       console.log("Raw data from API:", responseData);

//       // Ensure we're accessing the correct array within the response
//       const data = responseData.events || []; // Assuming events are nested under an 'events' key

//       // Log to verify the array being mapped
//       console.log("Events array:", data);

//       const formattedEvents = data.map(event => {
//         // Log each event before formatting
//         console.log("Event before formatting:", event);

//         const start = DateTime.fromISO(`${event.date}T${event.time || "00:00"}`).toISO();
//         const end = DateTime.fromISO(`${event.date}T${event.time || "01:00"}`).toISO(); // Default 1-hour duration if end time is not provided

//         // Log formatted start and end times
//         console.log("Formatted start:", start);
//         console.log("Formatted end:", end);

//         return {
//           title: event.title,
//           start,
//           end,
//         };
//       });

//       // Log formatted events array
//       console.log("Formatted events:", formattedEvents);

//       setEvents(formattedEvents);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   };

//   // Fetch events on component mount
//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const handleDateClick = () => {
//     setCurrentView('timeGridDay');
//   };

//   return (
//     <div className="flex h-screen bg-gradient-to-r from-gray-100 via-gray-50 to-white">
//       <Sidebar />

//       <div className="flex-1 p-6">
//         <div className="bg-white p-6 rounded-lg shadow-xl h-full border border-gray-200">
//           <FullCalendar
//             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             events={events} // Render fetched events here
//             headerToolbar={{
//               left: 'prev,next today',
//               center: 'title',
//               right: 'dayGridMonth,timeGridWeek,timeGridDay',
//             }}
//             height="100%"
//             dateClick={handleDateClick}
//             viewDidMount={(view) => setCurrentView(view.view.type)}
//             eventTimeFormat={{
//               hour: '2-digit',
//               minute: '2-digit',
//               meridiem: 'short',
//             }}
//             selectable
//             selectMirror
//             slotMinTime="01:00:00"
//             slotMaxTime="23:00:00"
//             navLinks
//             customButtons={{
//               today: {
//                 text: 'Today',
//                 click: () => setCurrentView('dayGridMonth'),
//               },
//             }}
//             dayCellClassNames={(date) => {
//               const today = DateTime.now().toISODate();
//               return date.date.toISOString().split('T')[0] === today
//                 ? 'bg-blue-50 border border-blue-300'
//                 : 'bg-white';
//             }}
//             dayCellContent={(e) => (
//               <div className="text-center font-semibold text-gray-700">{e.dayNumberText}</div>
//             )}
//             buttonText={{
//               today: 'Today',
//               month: 'Month',
//               week: 'Week',
//               day: 'Day',
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Calendar;
























// "use client";

// import React, { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { DateTime } from 'luxon';
// import Sidebar from '../components/Sidebar';

// const Calendar = () => {
//   const [currentView, setCurrentView] = useState('dayGridMonth');
//   const [events, setEvents] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     date: '',
//     startTime: '',
//     endTime: '',
//     description: '',
//     location: '',
//     attendees: '',
//   });

//   // Fetch events from the API
//   const fetchEvents = async () => {
//     try {
//       const response = await fetch('/api/user/calendar/get-events');
//       if (!response.ok) {
//         throw new Error("Failed to fetch events");
//       }
//       const responseData = await response.json();
//       const data = responseData.events || [];

//       const formattedEvents = data.map(event => ({
//         title: event.title,
//         start: DateTime.fromISO(`${event.date}T${event.startTime}`).toISO(),
//         end: DateTime.fromISO(`${event.date}T${event.endTime}`).toISO(),
//       }));

//       setEvents(formattedEvents);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const handleDateClick = () => {
//     setCurrentView('timeGridDay');
//   };

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setFormData({
//       title: '',
//       date: '',
//       startTime: '',
//       endTime: '',
//       description: '',
//       location: '',
//       attendees: '',
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const attendeesArray = formData.attendees.split(',').map(a => a.trim());
//     const newEvent = { ...formData, attendees: attendeesArray };

//     try {
//       const response = await fetch('/api/user/calendar/add-event', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newEvent),
//       });

//       if (response.ok) {
//         alert("Event added successfully!");
//         fetchEvents();
//         handleCloseModal();
//       } else {
//         const data = await response.json();
//         alert(`Failed to add event: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("Error adding event:", error);
//       alert("An error occurred while adding the event.");
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gradient-to-r from-gray-100 via-gray-50 to-white">
//       <Sidebar />

//       <div className="flex-1 p-6">
//         <div className="bg-white p-6 rounded-lg shadow-xl overflow-auto h-full border border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-bold">Calendar</h1>
//           <button
//             onClick={handleOpenModal}
//             className="bg-transparent text-black border px-4 py-2 rounded shadow"
//           >
//             Add Event
//           </button>
//         </div>
//           <FullCalendar
//             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             events={events}
//             headerToolbar={{
//               left: 'prev,next today',
//               center: 'title',
//               right: 'dayGridMonth,timeGridWeek,timeGridDay',
//             }}
//             height="100%"
//             dateClick={handleDateClick}
//             viewDidMount={(view) => setCurrentView(view.view.type)}
//             eventTimeFormat={{
//               hour: '2-digit',
//               minute: '2-digit',
//               meridiem: 'short',
//             }}
//             selectable
//             selectMirror
//             slotMinTime="00:00:00"
//             slotMaxTime="24:00:00"
//             navLinks
//           />
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Add New Event</h2>
//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="Event Title"
//                 required
//                 className="w-full mb-4 p-2 border rounded"
//               />
//               <input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//                 className="w-full mb-4 p-2 border rounded"
//               />
//               <input
//                 type="time"
//                 name="startTime"
//                 value={formData.startTime}
//                 onChange={handleChange}
//                 required
//                 className="w-full mb-4 p-2 border rounded"
//               />
//               <input
//                 type="time"
//                 name="endTime"
//                 value={formData.endTime}
//                 onChange={handleChange}
//                 required
//                 className="w-full mb-4 p-2 border rounded"
//               />
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Event Description"
//                 className="w-full mb-4 p-2 border rounded"
//               />
//               <input
//                 type="text"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 placeholder="Event Location"
//                 className="w-full mb-4 p-2 border rounded"
//               />
//               <input
//                 type="text"
//                 name="attendees"
//                 value={formData.attendees}
//                 onChange={handleChange}
//                 placeholder="Attendees (comma-separated)"
//                 className="w-full mb-4 p-2 border rounded"
//               />
//               <div className="flex justify-end space-x-2">
//                 <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-500 text-white rounded">
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
//                   Add Event
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Calendar;





























"use client";

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateTime } from 'luxon';
import Sidebar from '../components/Sidebar';

const Calendar = () => {
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    attendees: '',
  });

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/user/calendar/get-events');
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const responseData = await response.json();
      const data = responseData.events || [];

      const formattedEvents = data.map(event => ({
        id: event._id,
        title: event.title,
        start: DateTime.fromFormat(`${event.date} ${event.startTime}`, "yyyy-MM-dd HH:mm").toISO(),
        end: DateTime.fromFormat(`${event.date} ${event.endTime}`, "yyyy-MM-dd HH:mm").toISO(),
        extendedProps: {
          description: event.description,
          location: event.location,
          attendees: event.attendees,
        },
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = () => {
    setCurrentView('timeGridDay');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      attendees: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const attendeesArray = formData.attendees.split(',').map(a => a.trim());
    const newEvent = { ...formData, attendees: attendeesArray };

    try {
      const response = await fetch('/api/user/calendar/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        alert("Event added successfully!");
        fetchEvents();
        handleCloseModal();
      } else {
        const data = await response.json();
        alert(`Failed to add event: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("An error occurred while adding the event.");
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsEventDetailModalOpen(true);
  };

  const closeEventDetailModal = () => {
    setIsEventDetailModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 via-gray-50 to-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Calendar</h1>
          <button
            onClick={handleOpenModal}
            className="bg-transparent text-black border px-4 py-2 rounded shadow"
          >
            Add Event
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl overflow-auto h-full border border-gray-200">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            height="100%"
            dateClick={handleDateClick}
            viewDidMount={(view) => setCurrentView(view.view.type)}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short',
            }}
            selectable
            selectMirror
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            navLinks
            eventClick={handleEventClick}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Event</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Event Title"
                required
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full mb-4 p-2 border rounded"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event Description"
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event Location"
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="text"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                placeholder="Attendees (comma-separated)"
                className="w-full mb-4 p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-500 text-white rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEventDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
            <p><strong>Date:</strong> {DateTime.fromISO(selectedEvent.start?.toISOString()).toFormat('yyyy-MM-dd')}</p>
            <p><strong>Start Time:</strong> {DateTime.fromISO(selectedEvent.start?.toISOString()).toFormat('hh:mm a')}</p>
            <p><strong>End Time:</strong> {DateTime.fromISO(selectedEvent.end?.toISOString()).toFormat('hh:mm a')}</p>
            <p><strong>Location:</strong> {selectedEvent.extendedProps.location || 'N/A'}</p>
            <p><strong>Description:</strong> {selectedEvent.extendedProps.description || 'N/A'}</p>
            {selectedEvent.extendedProps.attendees?.length > 0 && (
              <p><strong>Attendees:</strong> {selectedEvent.extendedProps.attendees.join(', ')}</p>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={closeEventDetailModal} className="px-4 py-2 bg-blue-500 text-white rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
