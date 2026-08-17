"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings2, ShieldCheck, Star, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useDeletePropertyMutation } from '@/redux/api/propertyApi';
import { toast } from 'sonner';

interface PropertiesTableProps {
  properties: any[];
}

export function PropertiesTable({ properties }: PropertiesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [deleteProperty] = useDeletePropertyMutation();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const itemsPerPage = 10;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      setIsDeleting(id);
      await deleteProperty(id).unwrap();
      toast.success("Property deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete property");
    } finally {
      setIsDeleting(null);
    }
  };
  
  const totalPages = Math.max(1, Math.ceil((properties?.length || 0) / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = properties?.slice(startIndex, startIndex + itemsPerPage) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    return {
      ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      SOLD: "bg-red-500/10 text-red-500 border-red-500/20",
      RENTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    }[status] || "bg-stone-500/10 text-stone-500 border-stone-500/20";
  };

  return (
    <>
      <div className="w-full bg-stone-900/60 border border-stone-800/80 rounded overflow-hidden shadow-xl backdrop-blur-md">
        <div className="w-full">
          <div>
            {/* Header - Hidden on mobile */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 text-xs font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-800/80 bg-stone-950/40">
              <div className="col-span-4 pl-2">Listing Detail</div>
              <div className="col-span-2">Price & Status</div>
              <div className="col-span-3">Analytics & Units</div>
              <div className="col-span-2">Listed Date</div>
              <div className="col-span-1 text-right pr-4">Actions</div>
            </div>
            
            {/* Body */}
            <div className="divide-y divide-stone-800/50 bg-stone-900/20">
              {currentItems.length > 0 ? (
                currentItems.map((property) => (
                  <div key={property.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 items-start md:items-center hover:bg-stone-800/40 transition-colors duration-200">
                    {/* Listing Detail */}
                    <div className="md:col-span-4 flex items-center gap-4 pl-0 md:pl-2 w-full">
                      <div className="relative h-16 w-24 md:h-14 md:w-20 rounded overflow-hidden shrink-0 border border-stone-700/50">
                        <Image src={property.images?.[0] || "/no-image.png"} alt={property.title} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <h4 className="font-semibold text-stone-200 text-base md:text-sm line-clamp-1">{property.title}</h4>
                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{property.addressLine || property.location || "No address provided"}</p>
                        {property.isRegaVerified && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-medium text-emerald-500">REGA VERIFIED</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full grid grid-cols-2 md:contents gap-4 mt-2 md:mt-0">
                      {/* Price & Status */}
                      <div className="md:col-span-2 flex flex-col items-start justify-center">
                        <span className="text-[10px] text-stone-500 uppercase md:hidden mb-1">Price</span>
                        <span className="font-semibold text-emerald-400 text-sm">{formatCurrency(Number(property.price))}</span>
                        <Badge variant="outline" className={`mt-1.5 px-2 py-0 h-5 text-[10px] font-semibold border ${getStatusColor(property.status)}`}>
                          {property.status}
                        </Badge>
                      </div>

                      {/* Listed Date */}
                      <div className="md:col-span-2 flex flex-col items-start md:justify-center order-last md:order-none">
                        <span className="text-[10px] text-stone-500 uppercase md:hidden mb-1">Listed Date</span>
                        <span className="text-sm text-stone-300">{formatDate(property.createdAt)}</span>
                        {property.type && (
                          <span className="text-xs text-stone-500 mt-1 capitalize">{property.type.replace('_', ' ')}</span>
                        )}
                      </div>

                      {/* Analytics */}
                      <div className="md:col-span-3 flex items-center justify-between md:justify-start gap-4 col-span-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-stone-800/50 md:border-t-0">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-stone-300 font-medium text-sm">{property._count?.propertyViews || 0}</span>
                          <span className="text-[10px] text-stone-500 uppercase tracking-wider mt-0.5">Views</span>
                        </div>
                        <div className="w-px h-6 bg-stone-800 hidden md:block"></div>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-stone-300 font-medium text-sm">{property._count?.savedBy || 0}</span>
                          <span className="text-[10px] text-stone-500 uppercase tracking-wider mt-0.5">Saves</span>
                        </div>
                        <div className="w-px h-6 bg-stone-800 hidden md:block"></div>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-stone-300 font-medium text-sm">{property.totalUnits || property._count?.units || 0}</span>
                          <span className="text-[10px] text-stone-500 uppercase tracking-wider mt-0.5">Units</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1 flex items-center justify-end gap-2 w-full md:w-auto mt-3 md:mt-0 pr-0 md:pr-2 pt-3 md:pt-0 border-t border-stone-800/50 md:border-t-0">
                      <button
                        onClick={() => handleDelete(property.id)}
                        disabled={isDeleting === property.id}
                        className="flex items-center justify-center p-2 bg-stone-800 hover:bg-red-600 text-stone-300 hover:text-white rounded transition-all border border-stone-700 hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Property"
                      >
                        {isDeleting === property.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <Link 
                        href={`/dashboard/my-properties/${property.id}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 md:py-1.5 w-full md:w-auto bg-stone-800 hover:bg-emerald-600 text-stone-300 hover:text-white rounded transition-all border border-stone-700 hover:border-emerald-500 text-sm md:text-xs font-medium"
                      >
                        <Settings2 className="w-4 h-4 md:w-3.5 md:h-3.5" />
                        Manage Property
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-stone-800/50 flex items-center justify-center mb-3">
                    <Star className="w-6 h-6 text-stone-500" />
                  </div>
                  <h3 className="text-stone-300 font-medium">No properties found</h3>
                  <p className="text-stone-500 text-sm mt-1">You haven't listed any properties yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-stone-800/80 bg-stone-950/40">
            <p className="text-sm text-stone-400">
              Showing <span className="text-white font-medium">{properties?.length > 0 ? startIndex + 1 : 0}</span> to <span className="text-white font-medium">{Math.min(startIndex + itemsPerPage, properties?.length || 0)}</span> of <span className="text-white font-medium">{properties?.length || 0}</span> entries
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-stone-700 text-stone-300 disabled:opacity-30 hover:bg-stone-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-1 items-center px-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  // Show current, first, last, and pages adjacent to current
                  if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                          currentPage === page 
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                            : "text-stone-400 hover:text-white hover:bg-stone-800 border border-transparent"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  // Show ellipsis for gaps
                  if (Math.abs(page - currentPage) === 2) {
                    return <span key={page} className="text-stone-500 px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-stone-700 text-stone-300 disabled:opacity-30 hover:bg-stone-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
