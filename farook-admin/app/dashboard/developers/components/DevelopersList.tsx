import { Activity, ArrowUpRight, Edit2, ExternalLink, LayoutGrid, List, Loader2, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DevelopersListProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (val: "grid" | "list") => void;
  isLoadingDevelopers: boolean;
  filteredDevelopers: any[];
  openEditModal: (developer: any) => void;
  handleDeleteDeveloper: (id: string) => void;
}

export function DevelopersList({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  isLoadingDevelopers,
  filteredDevelopers,
  openEditModal,
  handleDeleteDeveloper
}: DevelopersListProps) {
  return (
    <div className="bg-[#1A1A1A] rounded shadow-lg border border-white/5 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-white/5 px-4 py-4 sm:flex sm:items-center sm:justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search developers..."
            className="w-full pl-9 pr-3 py-2 bg-white/5 border-0 rounded text-white text-sm focus:bg-white/10 focus:ring-1 focus:ring-[#00B37E] transition-colors outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-4 sm:mt-0 flex items-center bg-white/5 p-1 rounded">
          <button
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#00B37E] text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setViewMode('list')}
          >
            <List size={18} />
          </button>
          <button
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#00B37E] text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* List/Grid Views */}
      {isLoadingDevelopers ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 text-[#00B37E] animate-spin" />
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Loading Network...</p>
        </div>
      ) : filteredDevelopers.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center space-y-4">
          <div className="bg-white/5 p-6 rounded-full">
            <Search className="h-8 w-8 text-gray-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Developers Found</h3>
            <p className="text-gray-400 text-sm">Adjust your search parameters.</p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((developer: any) => (
            <div key={developer.id} className="bg-[#1A1A1A] border border-white/5 rounded overflow-hidden group hover:border-[#00B37E]/30 transition-all shadow-lg flex flex-col">
              <div className="h-32 bg-white/5 flex items-center justify-center p-4 relative">
                <img
                  src={developer?.logoUrl || "/placeholder-image.png"}
                  alt={developer.name}
                  className="h-16 w-auto object-contain z-10"
                />
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="h-8 w-8 bg-black/60 rounded flex items-center justify-center text-white hover:bg-[#00B37E]"
                    onClick={() => openEditModal(developer)}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="h-8 w-8 bg-black/60 rounded flex items-center justify-center text-white hover:bg-red-500"
                    onClick={() => handleDeleteDeveloper(developer.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white line-clamp-1">{developer.name}</h3>
                  {developer.websiteUrl && (
                    <a href={developer.websiteUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#00B37E]">
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{developer.description}</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="bg-[#00B37E]/10 text-[#00B37E] text-[10px] font-bold px-2 py-0.5 rounded border border-[#00B37E]/20 uppercase">
                    {developer.projectsCount || 0} Assets
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1 uppercase">
                    <Activity size={10} className="text-[#00B37E]" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5 text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Developer</th>
                <th scope="col" className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Market Presence</th>
                <th scope="col" className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Assets</th>
                <th scope="col" className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDevelopers.map((developer: any) => (
                <tr key={developer.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                        <img src={developer?.logoUrl || "/placeholder-image.png"} className="h-6 w-6 object-contain" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{developer.name}</p>
                        {developer.websiteUrl && (
                          <a href={developer.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-[#00B37E] hover:underline flex items-center gap-1">
                            {developer.websiteUrl.replace(/^https?:\/\//, '')} <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-400 line-clamp-1 max-w-xs">{developer.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#00B37E]/10 text-[#00B37E] text-[10px] font-bold px-2 py-0.5 rounded border border-[#00B37E]/20 uppercase">
                      {developer.projectsCount || 0} Assets
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 text-gray-400 hover:text-[#00B37E] hover:bg-white/10 rounded transition-colors"
                        onClick={() => openEditModal(developer)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/5 text-gray-300 min-w-40 rounded shadow-2xl">
                          <DropdownMenuItem onClick={() => openEditModal(developer)} className="cursor-pointer focus:bg-[#00B37E] focus:text-white">
                            <Edit2 size={14} className="mr-2" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem onClick={() => handleDeleteDeveloper(developer.id)} className="cursor-pointer text-red-400 focus:bg-red-500 focus:text-white">
                            <Trash2 size={14} className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
