import { FiCheck, FiInfo } from "react-icons/fi";
import { MdBlock } from "react-icons/md";

interface ActionButtonsProps {
  id: string;
  onBlock?: (id: string) => void;
  onActivate?: (id: string) => void;
  onInactive?: (id: string) => void;
}

export default function ActionButtons({
  id,
  onBlock,
  onActivate,
  onInactive,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onBlock?.(id)}
        className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
        title="Block user"
        aria-label="Block user"
      >
        <MdBlock size={18} />
      </button>
      <button
        onClick={() => onActivate?.(id)}
        className="p-2 rounded-lg border border-green-200 text-green-500 hover:bg-green-50 transition-colors"
        title="Activate user"
        aria-label="Activate user"
      >
        <FiCheck size={18} />
      </button>
      <button
        onClick={() => onInactive?.(id)}
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        title="View info"
        aria-label="View info"
      >
        <FiInfo size={18} />
      </button>
    </div>
  );
}
