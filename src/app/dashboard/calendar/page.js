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

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/user/calendar/get-events');
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const responseData = await response.json();

      // Log raw data from API to ensure structure
      console.log("Raw data from API:", responseData);

      // Ensure we're accessing the correct array within the response
      const data = responseData.events || []; // Assuming events are nested under an 'events' key

      // Log to verify the array being mapped
      console.log("Events array:", data);

      const formattedEvents = data.map(event => {
        // Log each event before formatting
        console.log("Event before formatting:", event);

        const start = DateTime.fromISO(`${event.date}T${event.time || "00:00"}`).toISO();
        const end = DateTime.fromISO(`${event.date}T${event.time || "01:00"}`).toISO(); // Default 1-hour duration if end time is not provided

        // Log formatted start and end times
        console.log("Formatted start:", start);
        console.log("Formatted end:", end);

        return {
          title: event.title,
          start,
          end,
        };
      });

      // Log formatted events array
      console.log("Formatted events:", formattedEvents);

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = () => {
    setCurrentView('timeGridDay');
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 via-gray-50 to-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded-lg shadow-xl h-full border border-gray-200">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events} // Render fetched events here
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
            slotMinTime="01:00:00"
            slotMaxTime="23:00:00"
            navLinks
            customButtons={{
              today: {
                text: 'Today',
                click: () => setCurrentView('dayGridMonth'),
              },
            }}
            dayCellClassNames={(date) => {
              const today = DateTime.now().toISODate();
              return date.date.toISOString().split('T')[0] === today
                ? 'bg-blue-50 border border-blue-300'
                : 'bg-white';
            }}
            dayCellContent={(e) => (
              <div className="text-center font-semibold text-gray-700">{e.dayNumberText}</div>
            )}
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
