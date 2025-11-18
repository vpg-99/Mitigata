import { useState, useRef, useEffect } from "react";
import { DateRangePicker, type RangeKeyDict } from "react-date-range";
import { FiCalendar, FiX } from "react-icons/fi";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (startDate: Date | null, endDate: Date | null) => void;
  setPage?: (page: number) => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onChange,
  setPage,
}: DateRangeFilterProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const handleSelect = (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges.selection;
    if (startDate && endDate) {
      onChange(startDate, endDate);
      setPage?.(1);
    }
  };

  const handleClear = () => {
    onChange(null, null);
    setPage?.(1);
    setShowCalendar(false);
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, "MMM dd, yyyy")} - ${format(
        endDate,
        "MMM dd, yyyy"
      )}`;
    }
    return "Select Date Range";
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
      >
        <FiCalendar className="text-gray-600" size={18} />
        <span className="text-sm">{formatDateRange()}</span>
        {startDate && endDate && (
          <FiX
            className="text-gray-500 hover:text-gray-700 ml-1"
            size={16}
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          />
        )}
      </button>

      {/* Calendar Dropdown */}
      {showCalendar && (
        <div className="absolute z-50 mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200">
          <DateRangePicker
            ranges={[
              {
                startDate: startDate || new Date(),
                endDate: endDate || new Date(),
                key: "selection",
              },
            ]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            rangeColors={["#3b82f6"]}
          />
          <div className="flex justify-end gap-2 p-3 border-t border-gray-200">
            <button
              onClick={() => setShowCalendar(false)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
