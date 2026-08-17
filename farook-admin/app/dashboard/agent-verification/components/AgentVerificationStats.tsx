import { Users, ShieldCheck, BadgeCheck, XCircle } from 'lucide-react';

interface AgentVerificationStatsProps {
  statsData: any;
}

export function AgentVerificationStats({ statsData }: AgentVerificationStatsProps) {
  const stats = [
    { name: 'Total Agents', value: statsData.totalAgents || 0, change: '', changeType: 'positive', icon: Users },
    { name: 'REGA Verified', value: statsData.regaVerified || 0, change: '', changeType: 'positive', icon: ShieldCheck },
    { name: 'Nafath Verified', value: statsData.nafathVerified || 0, change: '', changeType: 'positive', icon: BadgeCheck },
    { name: 'Unverified', value: statsData.unverifiedCount || 0, change: '', changeType: 'negative', icon: XCircle },
  ];

  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.name}
          className="relative overflow-hidden rounded bg-[#1A1A1A] px-4 py-5 shadow-lg border border-white/5 sm:px-6 hover:border-white/10 transition-colors duration-300"
        >
          <dt>
            <div className="absolute rounded bg-[#00B37E]/10 p-3">
              <item.icon className="h-6 w-6 text-[#00B37E]" aria-hidden="true" />
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
