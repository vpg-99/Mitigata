import type { Record } from "../types";
import Tr from "./Table/Tr";
import Td from "./Table/Td";
import StatusBadge from "./Table/StatusBadge";
import ActionButtons from "./Table/ActionButtons";

interface TableRowProps {
  record: Record;
  onBlock?: (id: string) => void;
  onActivate?: (id: string) => void;
  onInactive?: (id: string) => void;
}

export default function TableRow({
  record,
  onBlock,
  onActivate,
  onInactive,
}: TableRowProps) {
  return (
    <Tr className="hover:bg-gray-50 py-5">
      <Td className="font-medium text-gray-900">{record.about.name}</Td>
      <Td>{record.about.email}</Td>
      <Td>{record.details.date}</Td>
      <Td>{record.details.invitedBy}</Td>
      <Td>
        <StatusBadge status={record.about.status} />
      </Td>
      <Td>
        <ActionButtons
          id={record.id}
          onBlock={onBlock}
          onActivate={onActivate}
          onInactive={onInactive}
        />
      </Td>
    </Tr>
  );
}
