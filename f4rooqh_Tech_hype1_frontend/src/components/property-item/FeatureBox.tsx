import React from "react";

export function FeatureBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-stone-800/30 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded p-2 sm:p-3 border border-stone-700 gap-1 sm:gap-2">
      <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
        {icon}
        <span className="text-[10px] sm:text-xs whitespace-nowrap">{label}</span>
      </div>
      <p className="text-sm sm:text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
