"use client";

import React, { useState } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search posts..."
      value={query}
      onChange={handleChange}
      className="mb-4 p-2 border border-gray-300 rounded-md w-full"
    />
  );
};

export default SearchInput;
