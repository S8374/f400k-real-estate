import { Building2, CheckCircle2, Eye, Loader2, Search, Trash2, XCircle } from "lucide-react";

interface PropertyVerificationTableProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  isLoading: boolean;
  filteredProperties: any[];
  propertyForm: Record<string, { sakNumber: string }>;
  setPropertyForm: React.Dispatch<React.SetStateAction<Record<string, { sakNumber: string }>>>;
  setViewingProperty: (property: any) => void;
  isProcessing: string | null;
  handlePropertyVerify: (property: any) => void;
  handleUnverify: (property: any) => void;
  handleDelete: (id: string) => void;
}

export function PropertyVerificationTable({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  isLoading,
  filteredProperties,
  propertyForm,
  setPropertyForm,
  setViewingProperty,
  isProcessing,
  handlePropertyVerify,
  handleUnverify,
  handleDelete
}: PropertyVerificationTableProps) {
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
                placeholder="Search by title, owner, or Sak..."
                type="search"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0 flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded bg-white/5 border-0 py-1.5 pl-3 pr-8 text-white focus:ring-0 sm:text-sm outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#1A1A1A] text-white">All Status</option>
            <option value="pending" className="bg-[#1A1A1A] text-white">Pending Review</option>
            <option value="verified" className="bg-[#1A1A1A] text-white">Verified</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Property Details</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Agent / Owner</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Sak Number</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex gap-4">
                      <div className="h-12 w-16 bg-white/10 rounded"></div>
                      <div className="flex flex-col gap-2 justify-center">
                        <div className="h-4 w-32 bg-white/10 rounded"></div>
                        <div className="h-3 w-20 bg-white/10 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4"><div className="h-4 w-24 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-3 py-4"><div className="h-5 w-16 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap px-3 py-4"><div className="h-8 w-32 bg-white/10 rounded"></div></td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6"><div className="h-8 w-24 bg-white/10 rounded ml-auto"></div></td>
                </tr>
              ))
            ) : filteredProperties.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <Building2 className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                  <p className="text-gray-400 text-sm">No properties found.</p>
                </td>
              </tr>
            ) : (
              filteredProperties.map((property) => {
                const isVerified = property?.isVerified || property?.isRegaVerified;
                const rowState = propertyForm[property.id] || { sakNumber: property?.sakNumber || "" };

                return (
                  <tr key={property.id} className="hover:bg-white/5 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded border border-white/10 relative bg-white/5 flex items-center justify-center">
                          {property.images?.[0] ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.title || "Property"} 
                              className="object-cover w-full h-full" 
                            />
                          ) : (
                            <Building2 className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{property.title || "Untitled Property"}</span>
                          <span className="text-gray-500 font-normal text-xs">{property.type?.replace(/_/g, ' ') || 'Unknown Type'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-300">{property.agent?.user?.fullName || property.user?.fullName || property.ownerName || "N/A"}</span>
                        <span className="text-gray-500 text-xs">{property.agent?.user?.email || property.user?.email || "No email"}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        isVerified ? 'bg-[#00B37E]/10 text-[#00B37E] ring-[#00B37E]/30' :
                        'bg-yellow-400/10 text-yellow-500 ring-yellow-400/30'
                      }`}>
                        {isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {isVerified ? (
                        <code className="text-xs bg-white/5 px-2 py-1.5 rounded border border-white/10 text-gray-300">
                          {property.sakNumber || "N/A"}
                        </code>
                      ) : (
                        <input
                          type="text"
                          value={propertyForm[property.id]?.sakNumber ?? (property?.sakNumber || "")}
                          onChange={(e) =>
                            setPropertyForm((prev) => ({
                              ...prev,
                              [property.id]: { sakNumber: e.target.value },
                            }))
                          }
                          placeholder="Enter Sak #..."
                          className="w-32 bg-white/5 border border-white/10 focus:border-[#00B37E] rounded px-2 py-1.5 text-xs text-white outline-none transition-colors"
                        />
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {!isVerified ? (
                          <button 
                            onClick={() => handlePropertyVerify(property)}
                            disabled={isProcessing === `verify-${property.id}`}
                            className="bg-[#00B37E]/10 text-[#00B37E] hover:bg-[#00B37E]/20 transition-colors px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                          >
                            {isProcessing === `verify-${property.id}` ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            Verify
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnverify(property)}
                            disabled={isProcessing === `unverify-${property.id}`}
                            className="text-gray-400 hover:text-yellow-500 transition-colors p-1.5 rounded hover:bg-yellow-500/10 disabled:opacity-50"
                            title="Unverify Property"
                          >
                            {isProcessing === `unverify-${property.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <button 
                          onClick={() => setViewingProperty(property)}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1.5 rounded hover:bg-blue-400/10" 
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(property.id)}
                          disabled={isProcessing === `delete-${property.id}`}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-400/10 disabled:opacity-50" 
                          title="Delete Property"
                        >
                          {isProcessing === `delete-${property.id}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
