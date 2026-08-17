interface KycVerificationStatsProps {
  stats: {
    total: number;
    pending: number;
    verified: number;
    rejected: number;
  };
}

export function KycVerificationStats({ stats }: KycVerificationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex flex-col justify-center transition-all hover:bg-white/5">
        <p className="text-gray-400 text-sm font-medium mb-1">Total Documents</p>
        <p className="text-2xl font-bold text-white">{stats.total}</p>
      </div>
      <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex flex-col justify-center transition-all hover:bg-white/5">
        <p className="text-gray-400 text-sm font-medium mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending Review
        </p>
        <p className="text-2xl font-bold text-white">{stats.pending}</p>
      </div>
      <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex flex-col justify-center transition-all hover:bg-white/5">
        <p className="text-gray-400 text-sm font-medium mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00B37E]"></span> Verified
        </p>
        <p className="text-2xl font-bold text-white">{stats.verified}</p>
      </div>
      <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex flex-col justify-center transition-all hover:bg-white/5">
        <p className="text-gray-400 text-sm font-medium mb-1 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> Rejected
        </p>
        <p className="text-2xl font-bold text-white">{stats.rejected}</p>
      </div>
    </div>
  );
}
