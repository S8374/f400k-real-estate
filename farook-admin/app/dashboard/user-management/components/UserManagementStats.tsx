import { Users, UserCheck, UserX, ShieldCheck } from 'lucide-react';

interface UserManagementStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    pendingUsers: number;
  };
}

export function UserManagementStats({ stats }: UserManagementStatsProps) {
  const statCards = [
    { name: 'Total Users', value: stats.totalUsers, change: '', changeType: 'positive', icon: Users },
    { name: 'Active Users', value: stats.activeUsers, change: '', changeType: 'positive', icon: UserCheck },
    { name: 'Banned Users', value: stats.bannedUsers, change: '', changeType: 'negative', icon: UserX },
    { name: 'Pending Users', value: stats.pendingUsers, change: '', changeType: 'positive', icon: ShieldCheck },
  ];

  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((item) => (
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
            {item.change && (
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${item.changeType === 'positive' ? 'text-[#00B37E]' : 'text-red-400'}`}>
                {item.change}
              </p>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
