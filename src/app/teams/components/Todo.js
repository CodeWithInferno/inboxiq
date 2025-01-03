'use client';

import { useState } from 'react';

export default function TodoList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete team report', completed: false, priority: 'High' },
    { id: 2, text: 'Review onboarding process', completed: true, priority: 'Medium' },
    { id: 3, text: 'Plan team outing', completed: false, priority: 'Low' },
    { id: 4, text: 'Prepare presentation', completed: true, priority: 'High' },
    { id: 5, text: 'Team meeting at 3 PM', completed: true, priority: 'Low' },
    { id: 6, text: 'Update project roadmap', completed: false, priority: 'Medium' },
  ]);

  const toggleCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="p-4 bg-white shadow-lg w-full max-w-md rounded-lg border border-gray-200 flex flex-col">
      <h1 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Todo List</h1>
      {/* Scrollable List Container */}
      <div className="flex-grow overflow-y-auto max-h-48 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-2 rounded-md shadow-sm mb-2 ${
              task.completed ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompletion(task.id)}
                className="h-4 w-4 text-green-500 bg-white focus:ring-0 cursor-pointer"
              />
              <p
                className={`text-sm ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}
              >
                {task.text}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${
                  task.priority === 'High'
                    ? 'bg-red-100 text-red-500'
                    : task.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-500'
                    : 'bg-blue-100 text-blue-500'
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
