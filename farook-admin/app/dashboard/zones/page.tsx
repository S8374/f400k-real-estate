"use client";

import { Fragment, useState } from "react";
import { useGetAllZonesQuery, useDeleteZoneMutation, useUpdateZoneMutation } from "@/redux/api/adminApi";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronDown, Edit2, Trash2, MapPin, Search, Map, Layers, Activity } from "lucide-react";

export default function ZonesManagementPage() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { data: zonesData, isLoading, refetch } = useGetAllZonesQuery({});
  const [deleteZone, { isLoading: isDeleting }] = useDeleteZoneMutation();
  const [updateZone] = useUpdateZoneMutation();
  
  const zones = zonesData?.data || [];
  const topLevelZones = zones.filter((z: any) => !z.parentId);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      try {
        await deleteZone(id).unwrap();
        toast.success("Zone deleted successfully");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete zone");
      }
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await updateZone({ id, data: { isActive } }).unwrap();
      toast.success("Zone status updated successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update zone status");
    }
  };

  const totalMainZones = topLevelZones.length;
  let totalSubZones = 0;
  let totalActive = 0;
  let totalInactive = 0;

  topLevelZones.forEach((z: any) => {
    if (z.isActive) totalActive++;
    else totalInactive++;
    if (z.children) {
      totalSubZones += z.children.length;
      z.children.forEach((c: any) => {
        if (c.isActive) totalActive++;
        else totalInactive++;
      });
    }
  });

  const filteredZones = topLevelZones.filter((z: any) => {
    const matchesSearch = z.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "ACTIVE") {
      matchesStatus = z.isActive === true;
    } else if (statusFilter === "INACTIVE") {
      matchesStatus = z.isActive === false;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 mx-auto space-y-6 animate-in fade-in duration-700">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-[#00B37E]" />
            Zone Management
          </h1>
          <p className="text-gray-400 text-sm">Configure geographic zones and sub-zones for properties.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            href="/dashboard/zones/add"
            className="flex items-center gap-2 rounded bg-[#00B37E] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#00B37E]/90 transition-colors uppercase tracking-widest"
          >
            + Add New Zone
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex items-center gap-4 transition-all hover:bg-white/5">
          <div className="p-3 bg-[#00B37E]/20 rounded text-[#00B37E]">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Main Zones</p>
            <p className="text-2xl font-bold text-white">{totalMainZones}</p>
          </div>
        </div>
        <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex items-center gap-4 transition-all hover:bg-white/5">
          <div className="p-3 bg-blue-500/20 rounded text-blue-500">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Sub-Zones</p>
            <p className="text-2xl font-bold text-white">{totalSubZones}</p>
          </div>
        </div>
        <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex items-center gap-4 transition-all hover:bg-white/5">
          <div className="p-3 bg-emerald-500/20 rounded text-emerald-500">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Active Regions</p>
            <p className="text-2xl font-bold text-white">{totalActive}</p>
          </div>
        </div>
        <div className="bg-[#1A1A1A] p-5 rounded shadow-sm border border-white/5 flex items-center gap-4 transition-all hover:bg-white/5">
          <div className="p-3 bg-red-500/20 rounded text-red-500">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Inactive Regions</p>
            <p className="text-2xl font-bold text-white">{totalInactive}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search zones by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#00B37E] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1A1A1A] border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#00B37E] transition-colors cursor-pointer sm:w-48"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active Only</option>
          <option value="INACTIVE">Inactive Only</option>
        </select>
      </div>

      <div className="bg-[#1A1A1A] rounded shadow-lg border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 animate-pulse font-medium uppercase tracking-widest text-sm">Loading zones...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider w-2/5">Zone Info</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider w-1/6">Type</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider w-1/6">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredZones.map((parentZone: any) => (
                  <Fragment key={parentZone.id}>
                    {/* Parent Row */}
                    <tr 
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => setExpanded(prev => ({ ...prev, [parentZone.id]: !prev[parentZone.id] }))}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button type="button" className="text-gray-500 hover:text-white transition-colors">
                            {expanded[parentZone.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                          {parentZone.imageUrl ? (
                            <img src={parentZone.imageUrl} alt={parentZone.name} className="w-12 h-12 object-cover rounded shadow-sm border border-white/10" />
                          ) : (
                            <div className="w-12 h-12 bg-black/50 rounded flex items-center justify-center text-gray-500 text-[10px] font-bold border border-white/10 uppercase">No Img</div>
                          )}
                          <div>
                            <span className="text-[9px] tracking-wider uppercase font-bold text-[#00B37E] bg-[#00B37E]/10 px-2 py-0.5 rounded border border-[#00B37E]/20 mb-1 inline-block">Main Zone</span>
                            <h3 className="font-bold text-white group-hover:text-[#00B37E] transition-colors text-base">{parentZone.name}</h3>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400 font-medium bg-white/5 px-2 py-1 rounded">{parentZone.children?.length || 0} sub-zones</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={parentZone.isActive} 
                            onCheckedChange={(checked: boolean) => handleToggleStatus(parentZone.id, checked)}
                            className="data-[state=checked]:bg-[#00B37E]"
                          />
                          <span className={`text-xs font-bold uppercase tracking-wider ${parentZone.isActive ? 'text-[#00B37E]' : 'text-gray-500'}`}>
                            {parentZone.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/zones/edit/${parentZone.id}`); }} className="p-1.5 text-gray-400 hover:text-[#00B37E] hover:bg-white/10 rounded transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(parentZone.id); }} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Child Rows */}
                    {expanded[parentZone.id] && parentZone.children?.map((child: any) => (
                      <tr key={child.id} className="bg-black/20 hover:bg-white/5 transition-colors group/child">
                        <td className="px-6 py-3 pl-14">
                           <div className="flex items-center gap-3 relative before:absolute before:-left-4 before:top-1/2 before:w-3 before:h-px before:bg-white/10 before:-mt-px">
                            <div>
                              <h4 className="font-bold text-gray-300 text-sm group-hover/child:text-[#00B37E] transition-colors">{child.name}</h4>
                            </div>
                           </div>
                        </td>
                        <td className="px-6 py-3 text-xs text-gray-500 italic font-medium">
                          Sub-zone
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={child.isActive} 
                              onCheckedChange={(checked: boolean) => handleToggleStatus(child.id, checked)}
                              className="data-[state=checked]:bg-[#00B37E] scale-90"
                            />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${child.isActive ? 'text-[#00B37E]' : 'text-gray-500'}`}>
                              {child.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover/child:opacity-100 transition-opacity">
                            <button onClick={() => router.push(`/dashboard/zones/edit/${child.id}`)} className="p-1.5 text-gray-500 hover:text-[#00B37E] hover:bg-white/10 rounded transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(child.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/10 rounded transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
                
                {filteredZones.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                       <div className="flex justify-center mb-4"><MapPin className="h-10 w-10 text-gray-600" /></div>
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-1">No Zones Found</p>
                       <p className="text-gray-500 text-xs">Click "+ Add New Zone" to configure your first geographic region.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
