import { Building2, LayoutGrid } from "lucide-react";

interface DevelopersStatsProps {
  stats: {
    total: number;
    activeProjects: number;
  };
}

export function DevelopersStats({ stats }: DevelopersStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex items-center gap-4 transition-all hover:bg-white/5">
        <div className="p-3 bg-[#00B37E]/20 rounded text-[#00B37E]">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Developers</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
      </div>
      <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex items-center gap-4 transition-all hover:bg-white/5">
        <div className="p-3 bg-blue-500/20 rounded text-blue-500">
          <LayoutGrid className="h-6 w-6" />
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Combined Projects</p>
          <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
        </div>
      </div>
    </div>
  );
}
