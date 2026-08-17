import { Building2, CheckCircle, Clock } from 'lucide-react';

interface PropertyVerificationStatsProps {
  stats: {
    total: number;
    verified: number;
    pending: number;
  };
}

export function PropertyVerificationStats({ stats }: PropertyVerificationStatsProps) {
  const statCards = [
    { name: 'Total Properties', value: stats.total, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Verified Properties', value: stats.verified, icon: CheckCircle, color: 'text-[#00B37E]', bg: 'bg-[#00B37E]/10' },
    { name: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {statCards.map((item) => (
        <div
          key={item.name}
          className="relative overflow-hidden rounded bg-[#1A1A1A] px-4 py-5 shadow-lg border border-white/5 sm:px-6 hover:border-white/10 transition-colors duration-300"
        >
          <dt>
            <div className={`absolute rounded p-3 ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-400">{item.name}</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-1">
            <p className="text-2xl font-semibold text-white">{item.value}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
