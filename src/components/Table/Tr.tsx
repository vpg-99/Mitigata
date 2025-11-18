interface TrProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tr({ children, className = "" }: TrProps) {
  return (
    <div
      className={`grid grid-cols-[1fr_1.2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${className}`}
    >
      {children}
    </div>
  );
}
