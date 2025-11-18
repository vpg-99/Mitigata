import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  setPage?: (page: number) => void;
}

export default function SearchBar({
  placeholder = "Search",
  value,
  onChange,
  setPage,
}: SearchBarProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setPage?.(1);
  };

  return (
    <div className="relative max-w-2xs flex-1">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 size-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleSearch}
        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-400"
      />
    </div>
  );
}
