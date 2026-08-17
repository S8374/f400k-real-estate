'use client';

import { Building2, Users, Map, Clock, ArrowRight, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { 
  useGetVerifiedStatsQuery, 
  useGetAllZonesQuery, 
  useGetPendingPropertiesQuery,
  useGetUsersListQuery
} from '@/redux/api/adminApi';
import { useGetMeQuery } from '@/redux/api/authApi';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

export default function DashboardPage() {
  const { data: meData } = useGetMeQuery(undefined);
  const adminId = meData?.data?.id || meData?.data?.data?.id;

  const { data: statsData, isLoading: isLoadingStats } = useGetVerifiedStatsQuery(undefined);
  const { data: zonesData, isLoading: isLoadingZones } = useGetAllZonesQuery(undefined);
  const { data: pendingPropertiesData, isLoading: isLoadingPending } = useGetPendingPropertiesQuery();
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsersListQuery(
    { adminId: adminId || "", limit: 5 },
    { skip: !adminId }
  );

  const stats = statsData?.data?.data || statsData?.data || { agents: { total: 0, pending: 0, fullyVerified: 0 }, properties: { total: 0, pending: 0, verified: 0 } };
  const zonesCount = zonesData?.data?.filter((z: any) => !z.parentId)?.length || 0;
  
  // extract users from usersResponse (which might be paginated)
  const usersList = usersResponse?.data?.users || usersResponse?.users || [];
  const usersCount = usersResponse?.data?.meta?.total || usersResponse?.meta?.total || usersList.length || 0;
  
  const pendingProperties = Array.isArray(pendingPropertiesData) ? pendingPropertiesData.slice(0, 5) : [];
  const pendingVerificationsTotal = (stats.properties?.pending || 0) + (stats.agents?.pending || 0);

  // A mock recent activity based on recent users
  const recentUsers = Array.isArray(usersList) 
    ? [...usersList].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5)
    : [];

  const cards = [
    { name: 'Total Properties', value: stats.properties?.total || 0, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Total Users', value: usersCount, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Total Zones', value: zonesCount, icon: Map, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Pending Verifications', value: pendingVerificationsTotal, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  // Prepare chart data
  const barChartData = [
    {
      name: 'Agents',
      Total: stats.agents?.total || 0,
      Verified: stats.agents?.fullyVerified || 0,
      Pending: stats.agents?.pending || 0,
    },
    {
      name: 'Properties',
      Total: stats.properties?.total || 0,
      Verified: stats.properties?.verified || 0,
      Pending: stats.properties?.pending || 0,
    }
  ];

  const COLORS = ['#00B37E', '#f59e0b', '#3b82f6'];

  if (isLoadingStats || isLoadingZones || isLoadingUsers) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="h-8 bg-[#1A1A1A] rounded w-64 mb-2"></div>
            <div className="h-4 bg-[#1A1A1A] rounded w-96"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="relative overflow-hidden rounded bg-[#1A1A1A] p-6 shadow-lg border border-white/5 flex items-center gap-4">
              <div className="h-16 w-16 bg-white/5 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-white/5 rounded w-full"></div>
                <div className="h-8 bg-white/5 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i} className="rounded bg-[#1A1A1A] shadow-lg border border-white/5 flex flex-col h-[400px] p-6">
              <div className="h-6 bg-white/5 rounded w-1/3 mb-6"></div>
              <div className="flex-1 bg-white/5 rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i} className="rounded bg-[#1A1A1A] shadow-lg border border-white/5 overflow-hidden flex flex-col h-[400px]">
              <div className="h-16 border-b border-white/5 bg-white/5"></div>
              <div className="flex-1 p-5 space-y-4">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="h-12 bg-white/5 rounded w-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-400">
            Get a high-level summary of your platform's performance.
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded bg-[#1A1A1A] p-6 shadow-lg border border-white/5 hover:border-white/10 transition-colors duration-300 flex items-center gap-4"
          >
            <div className={`p-4 rounded-full ${item.bg}`}>
              <item.icon className={`h-8 w-8 ${item.color}`} aria-hidden="true" />
            </div>
            <div>
              <dt className="truncate text-sm font-medium text-gray-400">{item.name}</dt>
              <dd className="text-3xl font-bold text-white tracking-tight">{item.value.toLocaleString()}</dd>
            </div>
          </div>
        ))}
      </dl>

      {/* Dynamic Overview Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded bg-[#1A1A1A] p-6 shadow-lg border border-white/5 flex flex-col h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Verification Overview</h3>
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
                <YAxis stroke="#888" tick={{ fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: '#ffffff10' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Verified" fill="#00B37E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded bg-[#1A1A1A] p-6 shadow-lg border border-white/5 flex flex-col h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Verification Success Rate</h3>
          <div className="flex-1 w-full h-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Verified Agents', value: stats.agents?.fullyVerified || 0 },
                    { name: 'Pending Agents', value: stats.agents?.pending || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#00B37E" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Pie
                  data={[
                    { name: 'Verified Properties', value: stats.properties?.verified || 0 },
                    { name: 'Pending Properties', value: stats.properties?.pending || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Pending Approvals List */}
        <div className="rounded bg-[#1A1A1A] shadow-lg border border-white/5 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Pending Property Verifications
            </h3>
            <Link href="/dashboard/property-verification" className="text-sm font-medium text-[#00B37E] hover:text-emerald-400 transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 p-0">
            {pendingProperties.length > 0 ? (
              <ul className="divide-y divide-white/5">
                {pendingProperties.map((prop: any) => (
                  <li key={prop.id} className="p-5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded">
                          <FileText className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{prop.title}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">{prop.currency} {prop.price?.toLocaleString()}</p>
                        </div>
                      </div>
                      <Link href={`/dashboard/property-verification?id=${prop.id}`} className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors uppercase">
                        Review
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3 opacity-50" />
                <p className="text-gray-400 font-medium">No pending properties!</p>
                <p className="text-xs text-gray-500 mt-1">All properties have been reviewed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="rounded bg-[#1A1A1A] shadow-lg border border-white/5 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00B37E]" />
              Recent Platform Signups
            </h3>
            <Link href="/dashboard/user-management" className="text-sm font-medium text-[#00B37E] hover:text-emerald-400 transition-colors flex items-center gap-1">
              View Users <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 p-0">
            {recentUsers.length > 0 ? (
              <ul className="divide-y divide-white/5">
                {recentUsers.map((user: any) => (
                  <li key={user.id} className="p-5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00B37E] to-emerald-300 flex items-center justify-center text-black font-bold uppercase text-sm shadow-inner">
                          {(user.fullName || user.email || '?')[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{user.fullName || 'Unknown User'}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-white/10 uppercase">
                          {user.role}
                        </span>
                        <p className="text-[10px] text-gray-500 mt-1">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <Users className="w-12 h-12 text-gray-600 mb-3" />
                <p className="text-gray-400 font-medium">No recent users found.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

