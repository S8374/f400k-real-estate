import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  useCreateDeveloperMutation,
  useUpdateDeveloperMutation,
  useGetDeveloperQuery,
  useDeleteDeveloperMutation,
  useUploadImagesMutation,
} from "@/redux/api/adminApi";

export type DeveloperFormState = {
  name: string;
  description: string;
  websiteUrl: string;
};

export const initialFormState: DeveloperFormState = {
  name: "",
  description: "",
  websiteUrl: "",
};

export function useDevelopers() {
  const [form, setForm] = useState<DeveloperFormState>(initialFormState);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<any>(null);
  const [editForm, setEditForm] = useState<DeveloperFormState>(initialFormState);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const [createDeveloper, { isLoading: isCreating }] = useCreateDeveloperMutation();
  const [updateDeveloper, { isLoading: isUpdating }] = useUpdateDeveloperMutation();
  const [deleteDeveloper, { isLoading: isDeleting }] = useDeleteDeveloperMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();

  const { data: developerResponse, isLoading: isLoadingDevelopers } =
    useGetDeveloperQuery({});

  const developers = developerResponse?.data?.data || developerResponse?.data || [];

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo image must be 5MB or less");
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeSelectedLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview("");
    setLogoFile(null);
  };

  const openEditModal = (developer: any) => {
    setEditingDeveloper(developer);
    setEditForm({
      name: developer.name,
      description: developer.description,
      websiteUrl: developer.websiteUrl || "",
    });
    setEditLogoPreview(developer.logoUrl);
    setEditLogoFile(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingDeveloper(null);
    setEditForm(initialFormState);
    if (editLogoPreview && !editLogoPreview.startsWith("http")) {
      URL.revokeObjectURL(editLogoPreview);
    }
    setEditLogoPreview("");
    setEditLogoFile(null);
  };

  const handleEditLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo image must be 5MB or less");
      return;
    }

    if (editLogoPreview && !editLogoPreview.startsWith("http")) {
      URL.revokeObjectURL(editLogoPreview);
    }

    setEditLogoFile(file);
    setEditLogoPreview(URL.createObjectURL(file));
  };

  const removeEditLogo = () => {
    if (editLogoPreview && !editLogoPreview.startsWith("http")) {
      URL.revokeObjectURL(editLogoPreview);
    }
    setEditLogoPreview("");
    setEditLogoFile(null);
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editForm.name.trim() || !editForm.description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    try {
      let logoUrl = editLogoPreview;

      if (editLogoFile) {
        const imageFormData = new FormData();
        imageFormData.append("files", editLogoFile);

        const uploadResponse = await uploadImages(imageFormData).unwrap();
        logoUrl = uploadResponse?.data?.urls?.[0] || uploadResponse?.data?.data?.urls?.[0];

        if (!logoUrl) {
          toast.error("Failed to upload logo image");
          return;
        }
      }

      const payload = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        logoUrl: logoUrl,
        websiteUrl: editForm.websiteUrl.trim() || undefined,
      };

      const response = await updateDeveloper({
        id: editingDeveloper?.id,
        payload,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Developer updated successfully");
      } else {
        toast.success("Developer updated successfully");
      }

      closeEditModal();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update developer");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    if (!logoFile) {
      toast.error("Developer logo is required");
      return;
    }

    try {
      const imageFormData = new FormData();
      imageFormData.append("files", logoFile);

      const uploadResponse = await uploadImages(imageFormData).unwrap();
      const uploadedLogoUrl =
        uploadResponse?.data?.urls?.[0] || uploadResponse?.data?.data?.urls?.[0];

      if (!uploadedLogoUrl) {
        toast.error("Failed to upload logo image");
        return;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        logoUrl: uploadedLogoUrl,
        websiteUrl: form.websiteUrl.trim() || undefined,
      };

      const response = await createDeveloper(payload).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Developer created successfully");
      } else {
        toast.success("Developer created successfully");
      }

      setForm(initialFormState);
      removeSelectedLogo();
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create developer");
    }
  };

  const handleDeleteDeveloper = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this developer? This will remove all associated project links.")) return;
    try {
      await deleteDeveloper(id).unwrap();
      toast.success("Developer removed successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete developer");
    }
  };

  const filteredDevelopers = developers.filter((dev: any) =>
    dev?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = useMemo(() => {
    return {
      total: developers.length,
      activeProjects: developers.reduce((acc: number, dev: any) => acc + (dev.projectsCount || 0), 0)
    };
  }, [developers]);

  const isSaving = isCreating || isUploading;
  const isUpdatingState = isUpdating || isUploading;

  return {
    form,
    setForm,
    logoPreview,
    handleLogoSelect,
    removeSelectedLogo,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    editForm,
    setEditForm,
    editLogoPreview,
    handleEditLogoSelect,
    removeEditLogo,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    isLoadingDevelopers,
    filteredDevelopers,
    stats,
    isSaving,
    isUpdating: isUpdatingState,
    handleSubmit,
    handleEditSubmit,
    handleDeleteDeveloper,
    openEditModal,
    closeEditModal,
  };
}
