import { Building2, Globe, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DeveloperFormState } from "../../hooks/useDevelopers";

interface AddDeveloperModalProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  form: DeveloperFormState;
  setForm: (form: any | ((prev: any) => any)) => void;
  logoPreview: string;
  handleLogoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSelectedLogo: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  initialFormState: DeveloperFormState;
}

export function AddDeveloperModal({
  isAddModalOpen,
  setIsAddModalOpen,
  form,
  setForm,
  logoPreview,
  handleLogoSelect,
  removeSelectedLogo,
  handleSubmit,
  isSaving,
  initialFormState
}: AddDeveloperModalProps) {
  return (
    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 rounded bg-[#00B37E] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#00B37E]/90 transition-colors uppercase tracking-widest">
          <Plus className="h-4 w-4" />
          Add Developer
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1A1A1A] border-white/5 text-white max-w-2xl w-[calc(100vw-1rem)] sm:w-full rounded p-0 overflow-hidden shadow-2xl max-h-[90vh]">
        <div className="border-b border-white/5 bg-white/5 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#00B37E]/20 p-2 rounded text-[#00B37E]">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">Add Developer</DialogTitle>
              <p className="mt-1 text-xs text-gray-400">Create a verified developer profile with brand details and website link.</p>
            </div>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Developer Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev: any) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Aldar Properties"
                  className="w-full bg-white/5 border-0 h-11 rounded text-white px-3 focus:bg-white/10 focus:ring-1 focus:ring-[#00B37E] transition-colors text-sm outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Official Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={form.websiteUrl}
                    onChange={(e) => setForm((prev: any) => ({ ...prev, websiteUrl: e.target.value }))}
                    placeholder="https://www.aldar.com"
                    className="w-full bg-white/5 border-0 h-11 rounded text-white pl-9 pr-3 focus:bg-white/10 focus:ring-1 focus:ring-[#00B37E] transition-colors text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev: any) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full bg-white/5 border-0 rounded text-white p-3 focus:bg-white/10 focus:ring-1 focus:ring-[#00B37E] transition-colors text-sm outline-none resize-y"
                placeholder="Describe the developer's market presence..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brand Logo</label>
              <div className="flex flex-col md:flex-row md:items-center gap-4 rounded bg-white/5 border border-white/5 p-4">
                <label
                  htmlFor="developer-logo"
                  className="flex-1 cursor-pointer flex min-h-32 flex-col items-center justify-center gap-2 rounded border border-dashed border-gray-600 bg-white/5 p-4 text-sm text-gray-400 hover:border-[#00B37E] hover:bg-[#00B37E]/10 transition-all group"
                >
                  <div className="bg-black/50 p-2 rounded-full group-hover:bg-[#00B37E]/20 transition-all">
                    <ImagePlus className="h-5 w-5 text-gray-400 group-hover:text-[#00B37E]" />
                  </div>
                  <span className="font-bold text-gray-300">Upload logo</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">PNG, JPG, SVG up to 5MB</span>
                </label>
                <input id="developer-logo" type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />

                {logoPreview && (
                  <div className="relative group shrink-0 self-center">
                    <img src={logoPreview} alt="Preview" className="h-28 w-28 rounded object-cover border border-white/10 bg-black/50" />
                    <button
                      type="button"
                      onClick={removeSelectedLogo}
                      className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white z-20 shadow-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setForm(initialFormState);
                  removeSelectedLogo();
                }}
                className="px-4 py-2 rounded text-sm font-bold text-gray-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 rounded bg-[#00B37E] hover:bg-[#00B37E]/90 text-white text-sm font-bold shadow transition-colors flex items-center"
              >
                {isSaving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : "Add Developer"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
