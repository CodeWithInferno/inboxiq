'use client';

import Sidebar from './components/Sidebar';

import WeeklyCalendar from './components/WeeklyCalendar';

export default function PersonalTodoPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Calendar Header */}


        {/* Weekly Calendar */}
        <WeeklyCalendar />
      </div>
    </div>
  );
}
