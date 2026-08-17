interface EditVerificationModalProps {
  editingAgent: any;
  setEditingAgent: (agent: any) => void;
  editForm: { isRega: boolean; isNafath: boolean };
  setEditForm: (form: any | ((prev: any) => any)) => void;
  handleSaveEdit: () => void;
}

export function EditVerificationModal({
  editingAgent,
  setEditingAgent,
  editForm,
  setEditForm,
  handleSaveEdit
}: EditVerificationModalProps) {
  if (!editingAgent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Edit Verification</h2>
        <p className="text-sm text-gray-400 mb-6">
          Manually set the verification status for {(editingAgent?.user || editingAgent)?.fullName}.
        </p>
        
        <div className="space-y-4 mb-8">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white font-medium">REGA Verified</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={editForm.isRega}
                onChange={(e) => setEditForm((prev: any) => ({ ...prev, isRega: e.target.checked }))}
              />
              <div className={`block w-14 h-8 rounded-full transition-colors ${editForm.isRega ? 'bg-[#00B37E]' : 'bg-white/10'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${editForm.isRega ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-white font-medium">Nafath Verified</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={editForm.isNafath}
                onChange={(e) => setEditForm((prev: any) => ({ ...prev, isNafath: e.target.checked }))}
              />
              <div className={`block w-14 h-8 rounded-full transition-colors ${editForm.isNafath ? 'bg-[#00B37E]' : 'bg-white/10'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${editForm.isNafath ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setEditingAgent(null)}
            className="px-4 py-2 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveEdit}
            className="px-4 py-2 rounded bg-[#00B37E] text-white font-medium hover:bg-[#009b6c] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
