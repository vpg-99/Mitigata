import React from "react";
import { FiChevronDown } from "react-icons/fi";

interface DropDownProps {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
  setPage?: (page: number) => void;
}

export default function DropDown({
  options,
  onChange,
  value,
  setPage,
}: DropDownProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
    setPage?.(1);
  };
  return (
    <div className="relative inline-block">
      <select
        value={value}
        className="w-full pl-4 pr-8 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder:text-gray-400 appearance-none"
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-900 size-5" />
    </div>
  );
}
