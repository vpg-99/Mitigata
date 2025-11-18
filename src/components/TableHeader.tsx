import { FiChevronUp, FiChevronDown } from "react-icons/fi";

interface TableHeaderProps {
  onSort: (column: string) => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
}

export default function TableHeader({
  onSort,
  sortColumn,
  sortDirection,
}: TableHeaderProps) {
  const sortableColumns = [
    { key: "name", label: "Name", width: "w-1/6" },
    { key: "email", label: "Email", width: "w-1/5" },
    { key: "date", label: "Start Date", width: "w-1/6" },
    { key: "invitedBy", label: "Invited by", width: "w-1/6" },
    { key: "status", label: "Status", width: "w-1/6" },
  ];

  const renderSortIcon = (columnKey: string) => {
    if (sortColumn === columnKey) {
      return sortDirection === "asc" ? (
        <FiChevronUp className="inline ml-1" size={16} />
      ) : (
        <FiChevronDown className="inline ml-1" size={16} />
      );
    }
    return (
      <span className="inline-flex flex-col ml-1 opacity-40">
        <FiChevronUp size={12} style={{ marginBottom: -4 }} />
        <FiChevronDown size={12} />
      </span>
    );
  };

  return (
    <div className=" border-gray-200 sticky py-3">
      <div className="grid grid-cols-[1fr_1.2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3">
        {sortableColumns.map((column) => (
          <div
            key={column.key}
            onClick={() => onSort(column.key)}
            className="flex items-center text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors select-none"
          >
            {column.label}
            {renderSortIcon(column.key)}
          </div>
        ))}

        {/* Action column - no sorting */}
        <div className="text-sm font-medium text-gray-600">Action</div>
      </div>
    </div>
  );
}
