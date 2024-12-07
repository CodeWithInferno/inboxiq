"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateTime } from "luxon";
import Sidebar from "../components/Sidebar";
import AddCal from "./Components/AddCal";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddCalModalOpen, setIsAddCalModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    attendees: "",
  });
  const handleDateClick = (info) => {
    // Change FullCalendar view to the selected date's day view
    const calendarApi = info.view.calendar;
    calendarApi.changeView("timeGridDay", info.dateStr);
  };


  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/user/calendar/get-events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const { events: data } = await response.json();

      const formattedEvents = data.map((event) => ({
        id: event._id,
        title: event.title,
        start: DateTime.fromFormat(
          `${event.date} ${event.startTime}`,
          "yyyy-MM-dd HH:mm"
        ).toISO(),
        end: DateTime.fromFormat(
          `${event.date} ${event.endTime}`,
          "yyyy-MM-dd HH:mm"
        ).toISO(),
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

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      location: "",
      attendees: "",
    });
  };

  const handleEventClick = ({ event }) => {
    setSelectedEvent(event);
    setIsEventDetailModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const attendeesArray = formData.attendees
        .split(",")
        .map((a) => a.trim());
      const newEvent = { ...formData, attendees: attendeesArray };

      const response = await fetch("/api/user/calendar/add-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        alert("Event added successfully!");
        fetchEvents();
        handleCloseModal();
      } else {
        const { message } = await response.json();
        alert(`Failed to add event: ${message}`);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      alert("An error occurred while adding the event.");
    }
  };

  const closeEventDetailModal = () => {
    setIsEventDetailModalOpen(false);
    setSelectedEvent(null);
  };
  const handleAddCalEvents = (newEvents) => {
    setEvents((prev) => [...prev, ...newEvents]);
  };



  const handleOpenAddCalModal = () => setIsAddCalModalOpen(true);
  const handleCloseAddCalModal = () => setIsAddCalModalOpen(false);


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Add Event
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow-lg border h-[calc(100%-80px)]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="100%"
            eventClick={handleEventClick}
            dateClick={handleDateClick} // Add this line
          />

        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Event</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Event Title"
                className="w-full bg-white text-black mb-4 p-3 border rounded-lg"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="w-full bg-white text-black mb-4 p-3 border rounded-lg"
                required
              />
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleFormChange}
                className="w-full bg-white text-black mb-4 p-3 border rounded-lg"
                required
              />
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleFormChange}
                className="w-full bg-white text-black mb-4 p-3 border rounded-lg"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Event Description"
                className="w-full  bg-white text-black mb-4 p-3 border rounded-lg"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="Event Location"
                className="w-full mb-4 p-3 border bg-white text-black rounded-lg"
              />
              <input
                type="text"
                name="attendees"
                value={formData.attendees}
                onChange={handleFormChange}
                placeholder="Attendees (comma-separated)"
                className="w-full mb-4 bg-white text-black p-3 border rounded-lg"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-black text-white px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-black border px-4 py-2 rounded-lg transition"
                >
                  Add Event
                </button>
                <button
                  onClick={handleOpenAddCalModal}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
                >
                  Add Calendar
                </button>
                {isAddCalModalOpen && (
                  <AddCal
                    onAddEvents={handleAddCalEvents}
                    onClose={handleCloseAddCalModal}
                  />
                )}


              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {isEventDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
            <p>
              <strong>Date:</strong>{" "}
              {DateTime.fromISO(selectedEvent.start).toFormat("yyyy-MM-dd")}
            </p>
            <p>
              <strong>Start Time:</strong>{" "}
              {DateTime.fromISO(selectedEvent.start).toFormat("hh:mm a")}
            </p>
            <p>
              <strong>End Time:</strong>{" "}
              {DateTime.fromISO(selectedEvent.end).toFormat("hh:mm a")}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {selectedEvent.extendedProps.location || "N/A"}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedEvent.extendedProps.description || "N/A"}
            </p>
            {selectedEvent.extendedProps.attendees?.length > 0 && (
              <p>
                <strong>Attendees:</strong>{" "}
                {selectedEvent.extendedProps.attendees.join(", ")}
              </p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeEventDetailModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
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
