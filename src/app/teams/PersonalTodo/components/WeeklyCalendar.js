import { useState } from 'react';
import {
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  format,
  addHours,
  eachDayOfInterval,
  eachHourOfInterval,
  isToday,
} from 'date-fns';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const hours = eachHourOfInterval({
    start: new Date(2024, 0, 1, 0, 0),
    end: new Date(2024, 0, 1, 23, 0),
  });

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-md">
        {/* Header: Week Navigation */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <button
            onClick={handlePrevWeek}
            className="text-gray-500 hover:text-blue-500 transition"
          >
            &larr; Previous Week
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {format(startDate, 'MMMM yyyy')} (Week {format(startDate, 'd')} -{' '}
            {format(endDate, 'd')})
          </h2>
          <button
            onClick={handleNextWeek}
            className="text-gray-500 hover:text-blue-500 transition"
          >
            Next Week &rarr;
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)]">
          {/* Header: Days of the Week */}
          <div className="bg-gray-200 p-4"></div>
          {days.map((day) => (
            <div
              key={day}
              className="text-center bg-gray-200 p-4 font-semibold text-gray-700 border-r border-gray-300"
            >
              <div>{format(day, 'EEE')}</div>
              <div
                className={`text-sm ${
                  isToday(day) ? 'text-blue-600 font-bold' : 'text-gray-500'
                }`}
              >
                {format(day, 'd MMM')}
              </div>
            </div>
          ))}

          {/* Grid Content */}
          <div className="border-t border-gray-300">
            {hours.map((hour, hourIndex) => (
              <div key={hourIndex} className="flex">
                {/* Time Column */}
                <div className="p-2 text-gray-600 text-sm border-b border-r border-gray-300 bg-gray-100">
                  {format(hour, 'HH:mm')}
                </div>
                {/* Day Columns */}
                {days.map((day, dayIndex) => (
                  <div
                    key={`${dayIndex}-${hourIndex}`}
                    className="h-16 border-b border-r bg-white hover:bg-blue-50 transition rounded-lg shadow-sm"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
