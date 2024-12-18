'use client';

import React, { useState } from 'react';

const AdvancedFilters = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    label: '',
    dateFrom: '',
    dateTo: '',
    from: '',
    to: '',
    hasAttachment: false,
    includeWords: '',
    excludeWords: '',
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="w-full bg-white border border-gray-300 rounded-lg shadow-lg p-6 text-black">
      <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Label Filter */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Label</label>
          <select
            name="label"
            value={filters.label}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
          >
            <option value="">All</option>
            <option value="inbox">Inbox</option>
            <option value="promotions">Promotions</option>
            <option value="social">Social</option>
            <option value="updates">Updates</option>
            <option value="spam">Spam</option>
            <option value="trash">Trash</option>
          </select>
        </div>

        {/* From Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="email"
            name="from"
            placeholder="example@gmail.com"
            value={filters.from}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
          />
        </div>

        {/* To Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="email"
            name="to"
            placeholder="recipient@gmail.com"
            value={filters.to}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
          />
        </div>

        {/* Date From Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Date From</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
          />
        </div>

        {/* Date To Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Date To</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
          />
        </div>

        {/* Include Words Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Include Words</label>
          <input
            type="text"
            name="includeWords"
            placeholder="e.g., invoice, project"
            value={filters.includeWords}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
          />
        </div>

        {/* Exclude Words Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Exclude Words</label>
          <input
            type="text"
            name="excludeWords"
            placeholder="e.g., spam, ads"
            value={filters.excludeWords}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black"
          />
        </div>

        {/* Has Attachment Filter */}
        <div className="col-span-2">
          <label className="inline-flex items-center text-sm font-medium">
            <input
              type="checkbox"
              name="hasAttachment"
              checked={filters.hasAttachment}
              onChange={handleFilterChange}
              className="mr-2"
            />
            Has Attachment
          </label>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default AdvancedFilters;
