import { Loader2, XSquare } from "lucide-react";

interface PropertyDetailsModalProps {
  viewingProperty: any;
  setViewingProperty: (property: any) => void;
  fullProperty: any;
  detailsLoading: boolean;
}

export function PropertyDetailsModal({
  viewingProperty,
  setViewingProperty,
  fullProperty,
  detailsLoading
}: PropertyDetailsModalProps) {
  if (!viewingProperty) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-bold text-white">Property Details: {fullProperty?.title}</h2>
          <button 
            onClick={() => setViewingProperty(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XSquare className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8">
          {detailsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 text-[#00B37E] animate-spin" />
              <p className="text-gray-400">Loading full property details...</p>
            </div>
          ) : (
            <>
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">General Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Property Type</span>
                    <span className="text-white font-medium">{fullProperty?.type?.replace(/_/g, ' ') || "N/A"}</span>
                  </div>
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Status & Purpose</span>
                    <span className="text-white font-medium">{fullProperty?.status} / {fullProperty?.listingPurpose}</span>
                  </div>
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Price</span>
                    <span className="text-[#00B37E] font-medium">{fullProperty?.currency || "SAR"} {fullProperty?.price?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Location</span>
                    <span className="text-white font-medium">{fullProperty?.location || "N/A"}</span>
                  </div>
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Agent / Owner</span>
                    <span className="text-white font-medium">{fullProperty?.agent?.user?.fullName || fullProperty?.user?.fullName || fullProperty?.ownerName || "N/A"}</span>
                  </div>
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Sak Number</span>
                    <span className="text-gray-300 font-mono">{fullProperty?.sakNumber || "Not Provided"}</span>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Area</span>
                    <span className="text-white font-medium">{fullProperty?.areaSqm ? `${fullProperty.areaSqm} sqm` : "N/A"}</span>
                  </div>
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Bedrooms</span>
                    <span className="text-white font-medium">{fullProperty?.bedrooms || "N/A"}</span>
                  </div>
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Bathrooms</span>
                    <span className="text-white font-medium">{fullProperty?.bathrooms || "N/A"}</span>
                  </div>
                  <div className="border border-white/5 bg-white/5 p-3 rounded">
                    <span className="text-gray-500 block mb-1">Parking</span>
                    <span className="text-white font-medium">{fullProperty?.parkingSlots || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Units */}
              {fullProperty?.units && fullProperty.units.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Units ({fullProperty.units.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fullProperty.units.map((unit: any, idx: number) => (
                      <div key={idx} className="border border-white/10 bg-[#1f1f1f] p-3 rounded text-sm">
                        <div className="flex justify-between mb-2">
                          <span className="text-white font-medium">{unit.title || `Unit ${unit.unitNumber || idx + 1}`}</span>
                          <span className="text-[#00B37E] font-medium">{unit.price?.toLocaleString()}</span>
                        </div>
                        <div className="text-gray-400 text-xs flex gap-3">
                          <span>{unit.bedrooms} Beds</span>
                          <span>{unit.bathrooms} Baths</span>
                          <span>{unit.area} sqm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Plans */}
              {fullProperty?.paymentPlans && fullProperty.paymentPlans.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Plans & Milestones</h3>
                  <div className="space-y-4">
                    {fullProperty.paymentPlans.map((plan: any, idx: number) => (
                      <div key={idx} className="border border-white/10 bg-[#1f1f1f] rounded overflow-hidden text-sm">
                        <div className="bg-white/5 p-4 border-b border-white/10">
                          <p className="text-white font-semibold">{plan.name || `Payment Plan ${idx + 1}`}</p>
                          {plan.description && <p className="text-gray-400 text-xs mt-1">{plan.description}</p>}
                        </div>
                        {plan.milestones && plan.milestones.length > 0 ? (
                          <div className="divide-y divide-white/5">
                            {plan.milestones.map((milestone: any, mIdx: number) => (
                              <div key={mIdx} className="p-3 px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-[#1A1A1A]">
                                <div>
                                  <span className="text-gray-300 font-medium text-xs block mb-0.5">
                                    {milestone.tittle || milestone.title || `Milestone ${milestone.milestoneOrder || mIdx + 1}`}
                                  </span>
                                  <span className="text-gray-500 text-xs">{milestone.description}</span>
                                </div>
                                <div className="text-right shrink-0">
                                  {milestone.percentage !== null && milestone.percentage !== undefined ? (
                                    <span className="text-[#00B37E] font-bold block">{milestone.percentage}%</span>
                                  ) : null}
                                  {milestone.amount !== null && milestone.amount !== undefined ? (
                                    <span className="text-[#00B37E] font-bold block">SAR {milestone.amount.toLocaleString()}</span>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-xs text-gray-500 italic">No milestones defined</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Plan Acceptances */}
              {fullProperty?.paymentPlanAcceptances && fullProperty.paymentPlanAcceptances.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Agreements</h3>
                  <div className="space-y-3">
                    {fullProperty.paymentPlanAcceptances.map((acceptance: any, idx: number) => (
                      <div key={idx} className="border border-[#00B37E]/30 bg-[#00B37E]/5 p-4 rounded text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-white font-semibold">Agreement #{acceptance.id?.substring(0,6) || idx + 1}</span>
                          <span className={`px-2 py-1 rounded text-xs ${acceptance.status === 'ACCEPTED' ? 'bg-[#00B37E]/20 text-[#00B37E]' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            {acceptance.status}
                          </span>
                        </div>
                        <div className="text-gray-300 text-xs grid grid-cols-2 gap-2 mt-3">
                          <div><span className="text-gray-500 block">Buyer Email</span>{acceptance.buyer?.email || acceptance.buyerEmail || "N/A"}</div>
                          <div><span className="text-gray-500 block">Seller Email</span>{acceptance.seller?.email || acceptance.sellerEmail || "N/A"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t border-white/10 shrink-0 flex justify-end">
          <button 
            onClick={() => setViewingProperty(null)}
            className="px-6 py-2 rounded bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
