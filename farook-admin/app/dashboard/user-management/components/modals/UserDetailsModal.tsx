import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface UserDetailsModalProps {
  detailOpen: boolean;
  setDetailOpen: (open: boolean) => void;
  detailLoading: boolean;
  userDetail: any;
  handleDelete: (userId: string) => void;
}

export function UserDetailsModal({
  detailOpen,
  setDetailOpen,
  detailLoading,
  userDetail,
  handleDelete
}: UserDetailsModalProps) {
  return (
    <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
      <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:max-w-2xl rounded-lg p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-white/10 bg-black/20">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-[#00B37E]" />
            User Profile Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Detailed information about this user's account and activities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          {detailLoading ? (
            <div className="py-12 flex justify-center items-center text-gray-400">
              Loading profile data...
            </div>
          ) : userDetail ? (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-[#00B37E]/20 flex items-center justify-center text-[#00B37E] font-bold text-4xl border border-[#00B37E]/30 uppercase shadow-lg">
                  {userDetail.firstName ? userDetail.firstName.charAt(0) : (userDetail.email ? userDetail.email.charAt(0) : '?')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {userDetail.firstName} {userDetail.lastName}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                      {userDetail.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                      userDetail.status === 'ACTIVE' ? 'bg-[#00B37E]/20 text-[#00B37E]' : 
                      userDetail.status === 'BANNED' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {userDetail.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-lg border border-white/5 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Contact Info</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {userDetail.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {userDetail.phoneNumber || 'No phone number'}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Joined {new Date(userDetail.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg border border-white/5 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Activity Stats</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{userDetail._count?.savedListings || 0}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Saved Properties</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{userDetail._count?.sentMessages || 0}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Messages Sent</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  onClick={() => setDetailOpen(false)}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-semibold"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleDelete(userDetail.id)}
                  className="px-4 py-2 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 transition-colors text-sm font-semibold"
                >
                  Delete User
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 flex justify-center items-center text-gray-400">
              User details not found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
