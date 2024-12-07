'use client';

import React, { useState } from 'react';
import { debounce } from 'lodash';
import { FaSearch } from 'react-icons/fa';

const Search = ({ onSearchSubmit, userEmail }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const fetchSuggestions = debounce(async (query) => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    try {
      setLoadingSuggestions(true);
      const response = await fetch(
        `/api/auth/google/searchSuggestions?query=${encodeURIComponent(query)}&email=${encodeURIComponent(userEmail)}`
      );
      if (!response.ok) {
        throw new Error('Error fetching search suggestions');
      }
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error.message);
    } finally {
      setLoadingSuggestions(false);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSuggestions(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery); // Ensure search query is captured
    setSuggestions([]); // Clear suggestions
    onSearchSubmit(searchQuery); // Trigger the parent search
  };
  


  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.subject); // Use the selected suggestion
    setSuggestions([]); // Clear suggestions
    onSearchSubmit(suggestion.subject); // Trigger parent search
  };

  return (
    <form className="mb-4 relative" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        className="w-full p-3 pr-10 border border-gray-300 bg-white text-black rounded-lg focus:outline-none focus:border-blue-500 transition"
        placeholder="Search emails..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button
        type="submit"
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
      >
        <FaSearch size={25} />
      </button>
      {loadingSuggestions && <p>Loading suggestions...</p>}
      {suggestions.length > 0 && (
        <ul className="border border-gray-300 rounded-lg bg-white mt-2 max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.subject || '(No Subject)'}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default Search;
