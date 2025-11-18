import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  bgColor?: string;
  textColor?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBgColor = "bg-green-100",
  iconColor = "text-green-700",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center shrink-0`}
      >
        <div className={iconColor}>{icon}</div>
      </div>

      <div className="flex flex-col">
        <span className="text-sm text-gray-500 font-medium mb-1">{title}</span>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
    </div>
  );
}
