"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetAllZonesQuery, useCreateZoneMutation, useUpdateZoneMutation, useUploadImagesMutation } from "@/redux/api/adminApi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import AddressInput from "./AddressInput";
import ImageUploader from "./ImageUploader";
import ZoneDrawingMap from "./ZoneDrawingMap";

export type ZoneFormValues = {
  name: string;
  subtitle: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  parentId: string;
  addressLine: string;
  mapEmbedUrl: string;
  location: string;
  color: string;
  geojson: string;
};

interface ZoneFormProps {
  initialData?: ZoneFormValues & { id?: string };
  isEditMode?: boolean;
}

export default function ZoneForm({ initialData, isEditMode }: ZoneFormProps) {
  const router = useRouter();
  const { data: zonesData } = useGetAllZonesQuery({});
  const [createZone, { isLoading: isCreating }] = useCreateZoneMutation();
  const [updateZone, { isLoading: isUpdating }] = useUpdateZoneMutation();
  const [uploadImages, { isLoading: isUploadingImage }] = useUploadImagesMutation();
  
  const [files, setFiles] = useState<File[]>([]);

  const { register, handleSubmit, setValue, reset, watch } = useForm<ZoneFormValues>({
    defaultValues: initialData || {
      name: "", subtitle: "", imageUrl: "", parentId: "", color: "#10b981", geojson: ""
    }
  });
  
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const lat = watch("latitude");
  const lng = watch("longitude");
  const parentId = watch("parentId");

  const zones = zonesData?.data || [];
  const topLevelZones = zones.filter((z: any) => !z.parentId);

  const onSubmit = async (data: ZoneFormValues) => {
    let finalImageUrl = data.imageUrl;

    try {
      if (files.length > 0) {
        const imageFormData = new FormData();
        files.forEach((file) => {
          imageFormData.append("files", file);
        });

        const uploadResponse = await uploadImages(imageFormData).unwrap();
        if (uploadResponse?.success) {
          const urls = uploadResponse?.data?.data?.urls ?? uploadResponse?.data?.urls ?? [];
          if (urls.length > 0) {
            finalImageUrl = urls[0];
          }
        }
      }

      const payload = {
        name: data.name,
        subtitle: data.subtitle,
        imageUrl: finalImageUrl,
        parentId: data.parentId || undefined,
        latitude: Number(data.latitude) || undefined,
        longitude: Number(data.longitude) || undefined,
        color: data.color || undefined,
        geojson: data.geojson ? (typeof data.geojson === "string" ? JSON.parse(data.geojson) : data.geojson) : undefined,
      };

      if (isEditMode && initialData?.id) {
        await updateZone({ id: initialData.id, data: payload }).unwrap();
        toast.success("Zone updated successfully");
      } else {
        await createZone(payload).unwrap();
        toast.success("Zone created successfully");
      }
      
      router.push("/dashboard/zones");
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} zone`);
    }
  };

  return (
    <div className="bg-zinc-900/50 p-6 md:p-8 rounded w-full border border-zinc-800 shadow-xl backdrop-blur-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">Parent Zone (Optional)</label>
          <select 
            {...register("parentId")} 
            className="w-full bg-zinc-900 text-white p-3 rounded border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-sm"
          >
            <option value="">-- None (Main Zone) --</option>
            {topLevelZones.map((z: any) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
          <p className="text-xs text-zinc-500">Select a main zone to make this a sub-zone (e.g. District inside a City).</p>
        </div>

        <div className="bg-[#1A1A1A] p-4 rounded border border-white/5 text-white shadow-inner">
          <AddressInput
            register={register}
            setValue={setValue}
            addressLineFieldName="addressLine"
            latitudeFieldName="latitude"
            longitudeFieldName="longitude"
            locationFieldName="location"
            geojsonFieldName="geojson"
            mapEmbedUrlFieldName="mapEmbedUrl"
            nameFieldName="name"
            subtitleFieldName="subtitle"
            placeholder="Search Location for Lat/Lng..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Name</label>
            <input required type="text" {...register("name")} className="w-full bg-zinc-900 text-white p-3 rounded border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Subtitle / Description</label>
            <input type="text" {...register("subtitle")} className="w-full bg-zinc-900 text-white p-3 rounded border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Markout Color</label>
          <div className="flex items-center gap-3 bg-zinc-900 p-2 rounded border border-zinc-700 shadow-sm w-max">
             <input type="color" {...register("color")} className="w-10 h-10 bg-transparent rounded cursor-pointer border-0 p-0" />
             <span className="text-zinc-400 font-mono text-sm pr-2">{watch("color") || "#10b981"}</span>
          </div>
        </div>

        <div className={parentId ? "hidden" : "block"}>
          <ImageUploader 
            onChange={(selectedFiles) => setFiles(selectedFiles)} 
            maxFiles={1} 
            label="Upload Zone Image"
          />
          {isEditMode && initialData?.imageUrl && files.length === 0 && (
             <div className="mt-3 p-3 bg-zinc-900/50 rounded border border-zinc-800 flex items-center gap-4">
               <div className="flex-1">
                 <span className="text-xs font-medium text-zinc-400">Current Image:</span>
                 <p className="text-xs text-zinc-500 truncate mt-0.5">{initialData.imageUrl.split('/').pop()}</p>
               </div>
               <img src={initialData.imageUrl} alt="Current" className="w-16 h-16 object-cover rounded shadow-md border border-zinc-700" />
             </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Latitude</label>
            <input type="number" step="any" {...register("latitude")} className="w-full bg-zinc-900 text-white p-3 rounded border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm transition-all font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Longitude</label>
            <input type="number" step="any" {...register("longitude")} className="w-full bg-zinc-900 text-white p-3 rounded border border-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm transition-all font-mono text-sm" />
          </div>
        </div>
        
        <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800">
          <ZoneDrawingMap 
            latitude={lat}
            longitude={lng}
            initialGeoJSON={watch("geojson") ? (typeof watch("geojson") === "string" ? watch("geojson") : JSON.stringify(watch("geojson"))) : ""}
            onChange={(geojsonStr) => setValue("geojson", geojsonStr, { shouldValidate: true })}
          />
          <input type="hidden" {...register("geojson")} />
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-8 mt-4 border-t border-white/5">
          <button 
            type="button" 
            onClick={() => router.push("/dashboard/zones")} 
            className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 rounded transition-colors border border-transparent"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isCreating || isUpdating || isUploadingImage} 
            className="bg-[#00B37E] hover:bg-[#00B37E]/90 text-white px-8 py-2.5 rounded transition-all font-bold text-sm"
          >
            {isCreating || isUpdating || isUploadingImage ? "Saving..." : (isEditMode ? "Update Zone" : "Create Zone")}
          </button>
        </div>
      </form>
    </div>
  );
}
