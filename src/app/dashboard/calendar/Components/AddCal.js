"use client";

import React, { useState } from "react";
import ICAL from "ical.js";
import { useGoogleCalendarAPI } from "react-google-calendar-api";

const AddCal = ({ onAddEvents, onClose }) => {
  const { signIn, getEvents } = useGoogleCalendarAPI({
    clientId: process.env.GOOGLE_CLIENT_SECRET,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    scope: "https://www.googleapis.com/auth/calendar.readonly",
  });

  const handleGoogleCalendarImport = async () => {
    try {
      await signIn();
      const calendarEvents = await getEvents();
      const formattedEvents = calendarEvents.map((event) => ({
        id: event.id,
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
      }));
      onAddEvents(formattedEvents);
      onClose();
    } catch (error) {
      console.error("Error importing Google Calendar events:", error);
    }
  };

  const handleICalFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jcalData = ICAL.parse(event.target.result);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");

        const icalEvents = vevents.map((vevent) => {
          const event = new ICAL.Event(vevent);
          return {
            id: event.uid,
            title: event.summary,
            start: event.startDate.toString(),
            end: event.endDate.toString(),
          };
        });

        onAddEvents(icalEvents);
        onClose();
      } catch (error) {
        console.error("Error parsing iCalendar file:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Calendar</h2>
        <div className="space-y-4">
          {/* Google Calendar Import */}
          <button
            onClick={handleGoogleCalendarImport}
            className="bg-green-500 text-white px-4 py-2 w-full rounded-lg shadow hover:bg-green-600 transition"
          >
            Import from Google Calendar
          </button>

          {/* iCalendar File Upload */}
          <div>
            <label
              htmlFor="upload-ical"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 w-full text-center rounded-lg shadow hover:bg-blue-600 transition"
            >
              Import from iCalendar (.ics)
            </label>
            <input
              type="file"
              accept=".ics"
              onChange={(e) => handleICalFileUpload(e.target.files[0])}
              className="hidden"
              id="upload-ical"
            />
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCal;
