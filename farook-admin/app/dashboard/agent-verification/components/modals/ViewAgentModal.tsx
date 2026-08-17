import { XSquare } from 'lucide-react';

interface ViewAgentModalProps {
  viewingAgent: any;
  setViewingAgent: (agent: any) => void;
}

export function ViewAgentModal({ viewingAgent, setViewingAgent }: ViewAgentModalProps) {
  if (!viewingAgent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6 w-full max-w-lg shadow-2xl relative">
        <button 
          onClick={() => setViewingAgent(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <XSquare className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6">Agent Details</h2>
        
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-3 border-b border-white/10 pb-3">
            <span className="text-gray-500 font-medium col-span-1">Full Name</span>
            <span className="text-white col-span-2">{(viewingAgent?.user || viewingAgent)?.fullName || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 border-b border-white/10 pb-3">
            <span className="text-gray-500 font-medium col-span-1">Email Address</span>
            <span className="text-white col-span-2">{(viewingAgent?.user || viewingAgent)?.email || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 border-b border-white/10 pb-3">
            <span className="text-gray-500 font-medium col-span-1">License ID</span>
            <span className="text-white col-span-2">{(viewingAgent?.agentProfile || viewingAgent)?.licenseId || "N/A"}</span>
          </div>
          <div className="grid grid-cols-3 border-b border-white/10 pb-3">
            <span className="text-gray-500 font-medium col-span-1">REGA Status</span>
            <span className={`col-span-2 font-medium ${(viewingAgent?.agentProfile || viewingAgent)?.isRegaVerified ? 'text-[#00B37E]' : 'text-yellow-500'}`}>
              {(viewingAgent?.agentProfile || viewingAgent)?.isRegaVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="grid grid-cols-3 border-b border-white/10 pb-3">
            <span className="text-gray-500 font-medium col-span-1">Nafath Status</span>
            <span className={`col-span-2 font-medium ${(viewingAgent?.agentProfile || viewingAgent)?.isNafathVerified ? 'text-[#00B37E]' : 'text-yellow-500'}`}>
              {(viewingAgent?.agentProfile || viewingAgent)?.isNafathVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          <div className="grid grid-cols-3 pb-3 border-b border-white/10">
            <span className="text-gray-500 font-medium col-span-1">Joined Date</span>
            <span className="text-gray-300 col-span-2">{new Date((viewingAgent?.user || viewingAgent)?.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-3 border-b border-white/10 pb-3 mt-3">
            <span className="text-gray-500 font-medium col-span-1">Added Properties</span>
            <span className="text-white col-span-2">
              <span className="font-semibold text-[#00B37E]">{viewingAgent?.user?._count?.Property || viewingAgent?.user?._count?.properties || (viewingAgent?.properties || []).length || 0}</span> Properties Listed
            </span>
          </div>
          <div className="grid grid-cols-3 pt-3">
            <span className="text-gray-500 font-medium col-span-1">Communications</span>
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-gray-300">Active Chats: <span className="text-white font-medium">{viewingAgent?.user?._count?.chats || viewingAgent?.user?._count?.messages || (viewingAgent?.chats || []).length || 0}</span></span>
              <button className="text-blue-400 hover:text-blue-300 transition-colors text-left text-sm font-medium w-fit mt-1">
                View Chat History & User Details &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => setViewingAgent(null)}
            className="px-6 py-2 rounded bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
