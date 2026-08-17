import { Clock, CheckCircle2 } from "lucide-react";

interface VerifyPaymentHeaderProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
  filteredPaymentsCount: number;
}

export function VerifyPaymentHeader({ activeTab, setActiveTab, filteredPaymentsCount }: VerifyPaymentHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Verify Payment</h1>
        <p className="text-gray-400 text-sm">Review and authorize pending milestone payment requests from buyers.</p>
      </div>

      {/* Tabs and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => setActiveTab("PENDING")}
          className={`p-4 rounded-lg border transition-colors flex items-center justify-between ${
            activeTab === "PENDING" ? "bg-[#1f1f1f] border-[#00B37E]" : "bg-[#1A1A1A] border-white/5 hover:bg-white/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded ${activeTab === "PENDING" ? "bg-[#00B37E]/20 text-[#00B37E]" : "bg-white/5 text-gray-400"}`}>
              <Clock className="w-5 h-5" />
            </div>
            <span className="font-semibold text-white">Pending Action</span>
          </div>
          <span className="text-xl font-bold text-white">
            {activeTab === "PENDING" ? filteredPaymentsCount : "-"}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab("VERIFIED")}
          className={`p-4 rounded-lg border transition-colors flex items-center justify-between ${
            activeTab === "VERIFIED" ? "bg-[#1f1f1f] border-[#00B37E]" : "bg-[#1A1A1A] border-white/5 hover:bg-white/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded ${activeTab === "VERIFIED" ? "bg-[#00B37E]/20 text-[#00B37E]" : "bg-white/5 text-gray-400"}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="font-semibold text-white">Verified History</span>
          </div>
          <span className="text-xl font-bold text-white">
            {activeTab === "VERIFIED" ? filteredPaymentsCount : "-"}
          </span>
        </button>
      </div>
    </>
  );
}
