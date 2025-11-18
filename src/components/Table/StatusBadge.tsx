import type { Status } from "../../types";

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INACTIVE":
        return "bg-blue-100 text-blue-700";
      case "BLOCKED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: Status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
