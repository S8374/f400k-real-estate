import { FileText, Search, User, UserCheck, UserX } from "lucide-react";
import { getStatus } from "../hooks/useKycVerification";

interface KycVerificationTableProps {
  searchUser: string;
  setSearchUser: (val: string) => void;
  groupedUsers: any[];
  pendingKycLoading: boolean;
  setSelectedUserGroup: (group: any) => void;
}

export function KycVerificationTable({
  searchUser,
  setSearchUser,
  groupedUsers,
  pendingKycLoading,
  setSelectedUserGroup
}: KycVerificationTableProps) {
  return (
    <div className="bg-[#1A1A1A] rounded shadow-lg border border-white/5 overflow-hidden">
      {/* Table Toolbar */}
      <div className="border-b border-white/5 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-[#00B37E]" />
          <h2 className="text-lg font-semibold text-white">Identity Queue</h2>
          <span className="ml-3 bg-[#00B37E]/10 text-[#00B37E] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#00B37E]/20">
            {groupedUsers.length} Users with Docs
          </span>
        </div>

        <div className="w-full max-w-sm relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="block w-full rounded border-0 bg-white/5 py-2 pl-10 pr-3 text-white placeholder:text-gray-400 focus:bg-white/10 outline-none text-sm"
            placeholder="Search by user name or ID..."
            type="text"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white">User Profile</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Document Stats</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Status Distribution</th>
              <th scope="col" className="px-6 py-3.5 text-right text-sm font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {pendingKycLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="whitespace-nowrap py-6 pl-6 pr-3"><div className="h-10 w-48 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-3 py-6"><div className="h-10 w-32 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-3 py-6"><div className="h-10 w-32 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-6 py-6"><div className="h-10 w-24 bg-white/10 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : groupedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <UserX className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                  <p className="text-white text-lg font-medium">No KYC submissions found</p>
                  <p className="text-gray-500 text-sm">There are no pending documents to review right now.</p>
                </td>
              </tr>
            ) : (
              groupedUsers.map((group: any) => {
                const docs = group.documents;
                const pending = docs.filter((d: any) => getStatus(d) === "PENDING").length;
                const verified = docs.filter((d: any) => getStatus(d) === "VERIFIED").length;
                const rejected = docs.filter((d: any) => getStatus(d) === "REJECTED").length;

                return (
                  <tr key={group.userId} className="hover:bg-white/5 transition-colors">
                    <td className="whitespace-nowrap py-5 pl-6 pr-3 text-sm">
                      <div className="flex items-center gap-3">
                        {group.user?.profileImage ? (
                          <img src={group.user.profileImage} alt="" className="h-10 w-10 rounded-full object-cover border border-white/10 bg-[#1f1f1f]" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#1f1f1f] flex items-center justify-center border border-white/10">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white group-hover:text-[#00B37E] transition-colors">{group.userName}</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{group.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-300">{docs.length} Total</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <div className="flex gap-2">
                        {pending > 0 && <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs px-2 py-0.5 rounded font-medium">{pending} Pending</span>}
                        {verified > 0 && <span className="bg-[#00B37E]/10 text-[#00B37E] border border-[#00B37E]/20 text-xs px-2 py-0.5 rounded font-medium">{verified} Verified</span>}
                        {rejected > 0 && <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-xs px-2 py-0.5 rounded font-medium">{rejected} Rejected</span>}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-right">
                      <button
                        className="bg-[#00B37E] hover:bg-[#00B37E]/80 text-white font-bold px-4 py-2 rounded transition-colors text-xs"
                        onClick={() => setSelectedUserGroup(group)}
                      >
                        Review Document
                      </button>
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
