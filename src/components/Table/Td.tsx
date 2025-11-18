interface TdProps {
  children: React.ReactNode;
  className?: string;
}

export default function Td({ children, className = "" }: TdProps) {
  return (
    <div className={`text-sm text-gray-600 flex items-center ${className}`}>
      {children}
    </div>
  );
}
