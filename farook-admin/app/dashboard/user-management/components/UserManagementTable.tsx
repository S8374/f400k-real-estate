import { Search, Loader2, Eye, Ban, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserManagementTableProps {
  search: string;
  setSearch: (val: string) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  isLoading: boolean;
  users: any[];
  meta: { totalPages: number; total: number };
  processingActionId: string | null;
  handleStatusChange: (userId: string, currentStatus: string) => void;
  handleBlockToggle: (userId: string, currentStatus: string) => void;
  handleDelete: (userId: string) => void;
  viewDetails: (userId: string) => void;
}

export function UserManagementTable({
  search,
  setSearch,
  page,
  setPage,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  isLoading,
  users,
  meta,
  processingActionId,
  handleStatusChange,
  handleBlockToggle,
  handleDelete,
  viewDetails
}: UserManagementTableProps) {
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
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="block w-full rounded border-0 bg-white/5 py-1.5 pl-10 pr-3 text-white placeholder:text-gray-400 focus:bg-white/10 focus:ring-0 sm:text-sm sm:leading-6 transition-colors outline-none"
                placeholder="Search users..."
                type="search"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0 flex gap-2">
          <Select 
            value={roleFilter} 
            onValueChange={(value) => { setRoleFilter(value); setPage(1); }}
          >
            <SelectTrigger className="w-[130px] rounded bg-[#2A2A2A] border-0 text-white focus:ring-0 sm:text-sm h-9">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border border-white/10 text-white">
              <SelectItem value="all" className="focus:bg-white/10 focus:text-white cursor-pointer">All Roles</SelectItem>
              <SelectItem value="agent" className="focus:bg-white/10 focus:text-white cursor-pointer">Agent</SelectItem>
              <SelectItem value="buyer" className="focus:bg-white/10 focus:text-white cursor-pointer">Buyer</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={statusFilter} 
            onValueChange={(value) => { setStatusFilter(value); setPage(1); }}
          >
            <SelectTrigger className="w-[140px] rounded bg-[#2A2A2A] border-0 text-white focus:ring-0 sm:text-sm h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border border-white/10 text-white">
              <SelectItem value="all" className="focus:bg-white/10 focus:text-white cursor-pointer">All Status</SelectItem>
              <SelectItem value="active" className="focus:bg-white/10 focus:text-white cursor-pointer">Active</SelectItem>
              <SelectItem value="banned" className="focus:bg-white/10 focus:text-white cursor-pointer">Banned</SelectItem>
              <SelectItem value="pending_verification" className="focus:bg-white/10 focus:text-white cursor-pointer">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Name</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Email</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Role</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Date Joined</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-white/10"></div>
                      <div className="h-4 w-32 bg-white/10 rounded"></div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4"><div className="h-4 w-40 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-3 py-4"><div className="h-5 w-16 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-3 py-4"><div className="h-5 w-20 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-3 py-4"><div className="h-4 w-24 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6"><div className="h-6 w-24 bg-white/10 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">No users found.</td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-[#00B37E]/20 flex items-center justify-center text-[#00B37E] font-bold text-xs border border-[#00B37E]/20 uppercase">
                        {user.firstName ? user.firstName.charAt(0) : (user.email ? user.email.charAt(0) : '?')}
                      </div>
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{user.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      user.role === 'ADMIN' ? 'bg-purple-400/10 text-purple-400 ring-purple-400/30' :
                      user.role === 'AGENT' ? 'bg-blue-400/10 text-blue-400 ring-blue-400/30' :
                      'bg-gray-400/10 text-gray-400 ring-gray-400/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <button className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors disabled:opacity-50 ${
                      user.status === 'ACTIVE' ? 'bg-[#00B37E]/10 text-[#00B37E] ring-[#00B37E]/30 hover:bg-[#00B37E]/20' : 
                      user.status === 'PENDING_VERIFICATION' ? 'bg-amber-500/10 text-amber-500 ring-amber-500/30 hover:bg-amber-500/20' :
                      'bg-red-400/10 text-red-400 ring-red-400/30 hover:bg-red-400/20'
                    }`}
                    onClick={() => handleStatusChange(user.id, user.status)}
                    disabled={processingActionId === user.id + "-status"}
                    title="Click to toggle status"
                    >
                      {processingActionId === user.id + "-status" && <Loader2 className="h-3 w-3 animate-spin" />}
                      {user.status}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => viewDetails(user.id)} className="text-gray-400 hover:text-[#00B37E] transition-colors p-1 rounded hover:bg-white/10" title="View Details">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </button>
                      <button 
                        onClick={() => handleBlockToggle(user.id, user.status)}
                        disabled={processingActionId === user.id + "-block"}
                        className={`transition-colors p-1 rounded hover:bg-white/10 disabled:opacity-50 ${user.status === 'BANNED' ? 'text-orange-400 hover:text-orange-300' : 'text-gray-400 hover:text-orange-400'}`}
                        title={user.status === 'BANNED' ? "Unblock User" : "Block User"}
                      >
                        {processingActionId === user.id + "-block" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                        <span className="sr-only">{user.status === 'BANNED' ? "Unblock" : "Block"}</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={processingActionId === user.id + "-delete"}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/10 disabled:opacity-50" 
                        title="Delete"
                      >
                        {processingActionId === user.id + "-delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-white/5 bg-transparent px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Showing page <span className="font-medium text-white">{page}</span> of <span className="font-medium text-white">{meta.totalPages || 1}</span>{' '}
              ({meta.total || 0} total results)
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded shadow-sm" aria-label="Pagination">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="relative z-10 inline-flex items-center bg-[#00B37E] px-4 py-2 text-sm font-semibold text-white">
                {page}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(meta.totalPages || 1, p + 1))}
                disabled={page >= (meta.totalPages || 1)}
                className="relative inline-flex items-center rounded-r px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
