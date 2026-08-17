export function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-stone-800/30 p-2 flex justify-between rounded">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}
