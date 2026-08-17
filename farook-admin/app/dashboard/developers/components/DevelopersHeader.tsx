import { Building2 } from "lucide-react";
import { AddDeveloperModal } from "./modals/AddDeveloperModal";
import { DeveloperFormState } from "../hooks/useDevelopers";

interface DevelopersHeaderProps {
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

export function DevelopersHeader({
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
}: DevelopersHeaderProps) {
  return (
    <div className="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Building2 className="w-8 h-8 text-[#00B37E]" />
          Developer Network
        </h1>
        <p className="text-gray-400 text-sm">Curate and manage your premier real estate developer partnerships.</p>
      </div>
      <div className="mt-4 sm:mt-0">
        <AddDeveloperModal
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          form={form}
          setForm={setForm}
          logoPreview={logoPreview}
          handleLogoSelect={handleLogoSelect}
          removeSelectedLogo={removeSelectedLogo}
          handleSubmit={handleSubmit}
          isSaving={isSaving}
          initialFormState={initialFormState}
        />
      </div>
    </div>
  );
}
