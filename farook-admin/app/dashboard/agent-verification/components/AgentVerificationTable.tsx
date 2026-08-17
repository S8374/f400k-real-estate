import { Search, Edit2, CheckCircle2, XCircle, Eye, Loader2 } from 'lucide-react';

interface AgentVerificationTableProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterRega: string;
  setFilterRega: (val: string) => void;
  filterNafath: string;
  setFilterNafath: (val: string) => void;
  pendingLoading: boolean;
  allLoading: boolean;
  filteredAgents: any[];
  processingId: string | null;
  handleVerify: (agent: any, isRega: boolean, isNafath: boolean) => void;
  openEditModal: (agent: any) => void;
  setViewingAgent: (agent: any) => void;
}

export function AgentVerificationTable({
  searchQuery,
  setSearchQuery,
  filterRega,
  setFilterRega,
  filterNafath,
  setFilterNafath,
  pendingLoading,
  allLoading,
  filteredAgents,
  processingId,
  handleVerify,
  openEditModal,
  setViewingAgent
}: AgentVerificationTableProps) {
  return (
    <div className="bg-[#1A1A1A] rounded shadow-lg border border-white/5 overflow-hidden">
      {/* Table Toolbar */}
      <div className="border-b border-white/5 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-1 items-center justify-start">
          <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded border-0 bg-white/5 py-1.5 pl-10 pr-3 text-white placeholder:text-gray-400 focus:bg-white/10 focus:ring-0 sm:text-sm sm:leading-6 transition-colors outline-none"
                placeholder="Search agents by name or ID..."
                type="search"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0 flex gap-2">
          <select 
            value={filterRega}
            onChange={(e) => setFilterRega(e.target.value)}
            className="rounded bg-white/5 border-0 py-1.5 pl-3 pr-8 text-white focus:ring-0 sm:text-sm outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#1A1A1A] text-white">All REGA Status</option>
            <option value="verified" className="bg-[#1A1A1A] text-white">Verified</option>
            <option value="pending" className="bg-[#1A1A1A] text-white">Pending</option>
          </select>
          <select 
            value={filterNafath}
            onChange={(e) => setFilterNafath(e.target.value)}
            className="rounded bg-white/5 border-0 py-1.5 pl-3 pr-8 text-white focus:ring-0 sm:text-sm outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#1A1A1A] text-white">All Nafath Status</option>
            <option value="verified" className="bg-[#1A1A1A] text-white">Verified</option>
            <option value="pending" className="bg-[#1A1A1A] text-white">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Agent Details</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">REGA Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Nafath Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Date Joined</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {pendingLoading || allLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                 <tr key={i} className="animate-pulse">
                   <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                     <div className="flex flex-col gap-2">
                       <div className="h-4 w-32 bg-white/10 rounded"></div>
                       <div className="h-3 w-20 bg-white/10 rounded"></div>
                     </div>
                   </td>
                   <td className="whitespace-nowrap px-3 py-4"><div className="h-5 w-16 bg-white/10 rounded"></div></td>
                   <td className="whitespace-nowrap px-3 py-4"><div className="h-5 w-16 bg-white/10 rounded"></div></td>
                   <td className="whitespace-nowrap px-3 py-4"><div className="h-4 w-24 bg-white/10 rounded"></div></td>
                   <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6"><div className="h-6 w-24 bg-white/10 rounded ml-auto"></div></td>
                 </tr>
               ))
            ) : filteredAgents.length === 0 ? (
              <tr>
                 <td colSpan={5} className="py-8 text-center text-gray-400">No agents found</td>
              </tr>
            ) : (
              filteredAgents.map((agent: any) => {
                const user = agent?.user || agent;
                const profile = agent?.agentProfile || agent;
                const agentId = user?.id;
                
                return (
                  <tr key={agentId} className="hover:bg-white/5 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                      <div className="flex flex-col">
                        <span>{user?.fullName || 'Anonymous'}</span>
                        <span className="text-gray-500 font-normal text-xs">{profile?.licenseId || 'No License ID'}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        profile?.isRegaVerified ? 'bg-[#00B37E]/10 text-[#00B37E] ring-[#00B37E]/30' :
                        'bg-yellow-400/10 text-yellow-500 ring-yellow-400/30'
                      }`}>
                        {profile?.isRegaVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        profile?.isNafathVerified ? 'bg-[#00B37E]/10 text-[#00B37E] ring-[#00B37E]/30' :
                        'bg-yellow-400/10 text-yellow-500 ring-yellow-400/30'
                      }`}>
                        {profile?.isNafathVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                      {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {(!profile?.isRegaVerified || !profile?.isNafathVerified) ? (
                          <button 
                            onClick={() => handleVerify(agent, true, true)}
                            disabled={processingId === agentId}
                            className="text-gray-400 hover:text-[#00B37E] transition-colors p-1 rounded hover:bg-white/10 disabled:opacity-50" 
                            title="Verify Both"
                          >
                            {processingId === agentId ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                            <span className="sr-only">Verify, {user?.fullName}</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleVerify(agent, false, false)}
                            disabled={processingId === agentId}
                            className="text-gray-400 hover:text-amber-500 transition-colors p-1 rounded hover:bg-white/10 disabled:opacity-50" 
                            title="Revoke Verification (Unverify Both)"
                          >
                            {processingId === agentId ? <Loader2 className="h-5 w-5 animate-spin" /> : <XCircle className="h-5 w-5" />}
                            <span className="sr-only">Unverify, {user?.fullName}</span>
                          </button>
                        )}
                        <button 
                          onClick={() => setViewingAgent(agent)}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-white/10" 
                          title="View Agent Details"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details, {user?.fullName}</span>
                        </button>
                        <button 
                          onClick={() => openEditModal(agent)}
                          className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10" 
                          title="Edit Individual Verifications"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit, {user?.fullName}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
