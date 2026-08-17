"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Upload, X, ImagePlus, CircleCheckBig, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCreatePropertyMutation } from "@/redux/api/propertyApi";
import { useGetDeveloperQuery } from "@/redux/api/developer.api";
import AddressInput from "@/components/modules/dashboard/modal/AddressInput";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetAllZonesQuery } from "@/redux/api/zoneApi";
import Link from "next/link";

const formSchema = z.object({
  title: z.string().min(3, "Property title is required"),
  sakNumber: z.string().min(3, "Sak number is required"),
  description: z.string().min(1, "Description is required!"),
  listingPurpose: z.enum(["SELL", "RENT"]),
  type: z
    .enum([
      "GOLDEN_VISA",
      "HIGH_YIELD",
      "GIGA_PROJECT",
      "OFF_PLAN",
      "LUXURY",
      "COMMERCIAL",
      "RESIDENTIAL",
      "KAFD_ELITE",
      "MADINAH",
      "MAKKAH",
    ])
    .optional(),

  addressLine: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  mapEmbedUrl: z.string(),
  location: z.string().optional(),

  developerId: z.string(),
  zoneId: z.string(),
  totalUnits: z.number().optional(),
  availableUnits: z.number().optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  areaSqm: z.number().optional(),
  areaSqFt: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  floorNumber: z.number().optional(),
  yearBuilt: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 1800, {
      message: "Year must be 1800 or later",
    }),
  parkingSlots: z.number().optional(),
  roiProjectionPercent: z.number().optional(),
  estimatedRentalIncome: z.number().optional(),
  valueApproximate: z.number().optional(),
  featuredUntil: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreatePropertyPage() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const router = useRouter();
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();
  const isLoading = isCreating || isUploading;

  const { data: developerData } = useGetDeveloperQuery({});
  const developersRaw =
    developerData?.data?.data?.data ||
    developerData?.data?.data ||
    developerData?.data ||
    [];
  const developers = Array.isArray(developersRaw) ? developersRaw : [];
  
  const { data: zonesRes } = useGetAllZonesQuery({});
  const zones = zonesRes?.data || [];
  
  const { data: userData } = useGetMeQuery({});
  const currentUser = userData?.data?.data || userData?.data || userData;
  const userId =
    currentUser?.id ||
    currentUser?._id ||
    currentUser?.uid ||
    currentUser?.userId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handlePublish = async () => {
    if (!formData) return;

    if (!userId) {
      toast.error("User session not ready. Please refresh and try again.");
      return;
    }

    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((file) => {
          imageFormData.append("files", file);
        });

        const uploadResponse = await uploadImages(imageFormData).unwrap();
        imageUrls =
          uploadResponse?.data?.urls ||
          uploadResponse?.data?.data?.urls ||
          [];

        if (images.length > 0 && imageUrls.length === 0) {
          toast.error("Failed to upload property images");
          return;
        }
      }

      const payload = {
        ...formData,
        images: imageUrls,
        currency: "SAR",
        estimatedRentalCurrency: "SAR",
        valueApproximateCurrency: "SAR",
        listingAgentId: userId,
        status: "PENDING",
      };
      
      const response = await createProperty(payload).unwrap();
      if (response?.success) {
        toast.success("Property created successfully!");
      } else {
        toast.success("Property created successfully!");
      }

      reset();
      setImages([]);
      setPreviews([]);
      setShowConfirmModal(false);
      
      router.refresh();
      router.push("/dashboard/my-properties");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create property");
    }
  };

  return (
    <div className=" mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/my-properties">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-white rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Property</h1>
            <p className="text-gray-400 mt-1">Fill in the details below to list a new property.</p>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400 border-b border-stone-800 pb-2">General Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Property Title *</Label>
                <Input
                  {...register("title")}
                  placeholder="Luxury Villa in Al Malqa"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-white">Sak Number *</Label>
                <Input
                  {...register("sakNumber")}
                  placeholder="Enter Sak Number"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
                {errors.sakNumber && <p className="text-red-500 text-sm">{errors.sakNumber.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Listing Purpose *</Label>
                <Controller
                  name="listingPurpose"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-stone-950 border-stone-800 text-white focus:ring-emerald-500">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SELL">Sale</SelectItem>
                        <SelectItem value="RENT">Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Developer *</Label>
                <Controller
                  name="developerId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-stone-950 border-stone-800 text-white focus:ring-emerald-500">
                        <SelectValue placeholder="Select developer" />
                      </SelectTrigger>
                      <SelectContent>
                        {developers?.map((dev: any) => (
                          <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Property Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-stone-950 border-stone-800 text-white focus:ring-emerald-500">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GOLDEN_VISA">Golden Visa</SelectItem>
                        <SelectItem value="HIGH_YIELD">High Yield</SelectItem>
                        <SelectItem value="GIGA_PROJECT">Giga-Project</SelectItem>
                        <SelectItem value="LUXURY">Luxury</SelectItem>
                        <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                        <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                        <SelectItem value="KAFD_ELITE">KAFD Elite</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-semibold text-emerald-400 border-b border-stone-800 pb-2">Location</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Select Zone *</Label>
                <Controller
                  name="zoneId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-stone-950 border-stone-800 text-white w-full focus:ring-emerald-500">
                        <SelectValue placeholder="Select property zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones?.filter((z: any) => !z.parentId).map((parent: any) => (
                          <SelectGroup key={parent.id}>
                            <SelectLabel className="text-emerald-500 font-bold">{parent.name}</SelectLabel>
                            <SelectItem value={parent.id}>{parent.name} (Main)</SelectItem>
                            {parent.children?.map((child: any) => (
                              <SelectItem key={child.id} value={child.id} className="pl-6">
                                ↳ {child.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {(() => {
                const selectedZoneId = watch("zoneId");
                const selectedZone = zones.find((z: any) => z.id === selectedZoneId);
                const zoneName = selectedZone?.name;
                
                let parentZoneName = "";
                if (selectedZone?.parentId) {
                  const parentZone = zones.find((z: any) => z.id === selectedZone.parentId);
                  parentZoneName = parentZone?.name || "";
                }

                return (
                  <AddressInput
                    register={register}
                    setValue={setValue}
                    addressLineFieldName="addressLine"
                    latitudeFieldName="latitude"
                    longitudeFieldName="longitude"
                    mapEmbedUrlFieldName="mapEmbedUrl"
                    locationFieldName="location"
                    placeholder={zoneName ? `Type building, street, or house in ${zoneName}...` : "Search your address..."}
                    zoneName={zoneName}
                    parentZoneName={parentZoneName}
                    zoneLat={selectedZone?.latitude}
                    zoneLng={selectedZone?.longitude}
                  />
                );
              })()}
              
              {errors.addressLine && <p className="text-red-500 text-sm">{errors.addressLine.message}</p>}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-semibold text-emerald-400 border-b border-stone-800 pb-2">Property Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Price (SAR) *</Label>
                <Input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="4200000"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-white">Total Units</Label>
                <Input
                  type="number"
                  {...register("totalUnits", { valueAsNumber: true })}
                  placeholder="Total Units"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
                {errors.totalUnits && <p className="text-red-500 text-sm">{errors.totalUnits.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-white">Available Units</Label>
                <Input
                  type="number"
                  {...register("availableUnits", { valueAsNumber: true })}
                  placeholder="Available Units"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
                {errors.availableUnits && <p className="text-red-500 text-sm">{errors.availableUnits.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Area (Sqm)</Label>
                <Input
                  type="number"
                  {...register("areaSqm", { valueAsNumber: true })}
                  placeholder="35"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Area (Sqft)</Label>
                <Input
                  type="number"
                  {...register("areaSqFt", { valueAsNumber: true })}
                  placeholder="350"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Bedrooms</Label>
                <Input
                  type="number"
                  {...register("bedrooms", { valueAsNumber: true })}
                  placeholder="4"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Bathrooms</Label>
                <Input
                  type="number"
                  {...register("bathrooms", { valueAsNumber: true })}
                  placeholder="4"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Balconies</Label>
                <Input
                  type="number"
                  {...register("balconies", { valueAsNumber: true })}
                  placeholder="2"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Floor</Label>
                <Input
                  type="number"
                  {...register("floorNumber", { valueAsNumber: true })}
                  placeholder="1"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Year Built</Label>
                <Input
                  type="number"
                  {...register("yearBuilt", { valueAsNumber: true })}
                  placeholder="2024"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Parking</Label>
                <Input
                  type="number"
                  {...register("parkingSlots", { valueAsNumber: true })}
                  placeholder="2"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">ROI (%)</Label>
                <Input
                  type="number"
                  {...register("roiProjectionPercent", { valueAsNumber: true })}
                  placeholder="8"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Est. Rental</Label>
                <Input
                  type="number"
                  {...register("estimatedRentalIncome", { valueAsNumber: true })}
                  placeholder="120000"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Description *</Label>
            <Textarea
              {...register("description")}
              placeholder="Property Description"
              className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 min-h-[120px] focus-visible:ring-emerald-500"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          {/* Upload Media */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-semibold text-emerald-400 border-b border-stone-800 pb-2">Media</h3>
            <div
              className="border-2 border-dashed border-stone-700 bg-stone-950/50 rounded p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-colors"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <input
                id="image-upload"
                type="file"
                accept="image/png,image/jpeg,video/mp4,video/webm"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              <ImagePlus className="mx-auto h-8 w-8 text-emerald-500/70 mb-3" />
              <p className="text-gray-300 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Images (PNG, JPG) and Videos (MP4) up to 10MB
              </p>
            </div>

            {/* Media Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {previews.map((preview, index) => {
                  const isVideo = images[index]?.type.startsWith("video/");
                  return (
                    <div key={index} className="relative group rounded overflow-hidden border border-stone-700">
                      {isVideo ? (
                        <video
                          src={preview}
                          className="object-cover w-full h-32 bg-black"
                          controls
                          muted
                        />
                      ) : (
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={150}
                          className="object-cover w-full h-32"
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-stone-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/my-properties")}
              className="flex-1 border-stone-700 text-gray-300 hover:bg-stone-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              <Upload className="h-4 w-4 mr-2" />
              Submit Listing
            </Button>
          </div>
        </form>
      </div>

      {formData && (
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="bg-stone-900 border border-stone-700 rounded w-full max-w-md p-0 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center">
                  <Image
                    src={"/turbo.svg"}
                    alt="turbo"
                    height={20}
                    width={20}
                  />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Publish Property Listing?
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="bg-stone-800/50 p-4 rounded">
                <p className="text-sm text-gray-400 mb-1">Property:</p>
                <p className="text-white font-medium">
                  {formData.title || "Untitled Property"}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-300">
                  Once published, this property will:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                    Visible to all buyers on the interactive map
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                    Searchable through filters and categories
                  </li>
                  <li className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4 text-emerald-500" />
                    Open for direct buyer inquiries
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-700 flex gap-4">
              <Button
                variant="outline"
                className="flex-1 border-stone-600 text-gray-300 hover:bg-stone-800"
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                onClick={handlePublish}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Publishing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Image src="/turbo.svg" alt="turbo" height={16} width={16} />
                    Publish Now
                  </span>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
