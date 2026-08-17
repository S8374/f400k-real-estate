"use client";

import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Upload, X, ImagePlus, CircleCheckBig, ArrowLeft, Edit } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import { useEditPropertyMutation, useGetPropertyByIdQuery } from "@/redux/api/propertyApi";
import { useGetDeveloperQuery } from "@/redux/api/developer.api";
import AddressInput from "@/components/modules/dashboard/modal/AddressInput";
import { useUploadImagesMutation } from "@/redux/api/uploade.api";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetAllZonesQuery } from "@/redux/api/zoneApi";
import Link from "next/link";
import { FaSpinner } from "react-icons/fa6";

const formSchema = z.object({
  title: z.string().optional(),
  sakNumber: z.string().optional(),
  description: z.string().optional(),
  listingPurpose: z.enum(["SELL", "RENT"]),
  type: z.string().optional(),
  addressLine: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mapEmbedUrl: z.string().optional(),
  location: z.string().optional(),
  developerId: z.string().optional(),
  zoneId: z.string().optional(),
  totalUnits: z.number().optional(),
  availableUnits: z.number().optional(),
  price: z.number().optional(),
  areaSqm: z.number().optional(),
  areaSqFt: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  balconies: z.number().optional(),
  floorNumber: z.number().optional(),
  yearBuilt: z.number().optional(),
  parkingSlots: z.number().optional(),
  roiProjectionPercent: z.number().optional(),
  estimatedRentalIncome: z.number().optional(),
  valueApproximate: z.number().optional(),
  featuredUntil: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const { data: propertyDataById, isLoading: propertyLoading } = useGetPropertyByIdQuery(propertyId, {
    skip: !propertyId,
  });
  const property = propertyDataById?.data;

  const [editProperty, { isLoading: editPropertyLoading }] = useEditPropertyMutation();
  const [uploadImages] = useUploadImagesMutation();
  
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
    defaultValues: {
      listingPurpose: "SELL",
      developerId: "",
    },
  });

  useEffect(() => {
    if (property) {
      reset({
        title: property.title ?? "",
        sakNumber: property.sakNumber ?? "",
        description: property.description ?? "",
        listingPurpose: property.listingPurpose as "SELL" | "RENT",
        type: property.type || undefined,
        addressLine: property.addressLine || "",
        latitude: property.latitude ?? undefined,
        longitude: property.longitude ?? undefined,
        mapEmbedUrl: property.mapEmbedUrl || "",
        location: property.location || "",
        developerId: property.developerId || undefined,
        zoneId: property.zoneId ?? undefined,
        totalUnits: property.totalUnits ?? undefined,
        availableUnits: property.availableUnits ?? undefined,
        price: property.price ?? undefined,
        areaSqm: property.areaSqm ?? undefined,
        areaSqFt: property.areaSqFt ?? undefined,
        bedrooms: property.bedrooms ?? undefined,
        bathrooms: property.bathrooms ?? undefined,
        balconies: property.balconies ?? undefined,
        floorNumber: property.floorNumber ?? undefined,
        yearBuilt: property.yearBuilt ?? undefined,
        parkingSlots: property.parkingSlots ?? undefined,
        roiProjectionPercent: property.roiProjectionPercent ?? undefined,
        estimatedRentalIncome: property.estimatedRentalIncome ?? undefined,
        valueApproximate: property.valueApproximate ?? undefined,
      });
      if (property.images && property.images.length > 0) {
        setExistingImages(property.images);
      }
    }
  }, [property, reset]);

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

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData: FormData) => {
    if (!formData) return;
    try {
      let imageUrls: string[] = [];

      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((file) => {
          imageFormData.append("files", file);
        });
        const uploadResponse = await uploadImages(imageFormData).unwrap();
        if (uploadResponse?.success) {
          imageUrls = uploadResponse?.data?.data?.urls ?? [];
        }
      }
      const allImages = [...existingImages, ...imageUrls];

      const payload: any = {
        ...formData,
        images: allImages,
        currency: "SAR",
        estimatedRentalCurrency: "SAR",
        valueApproximateCurrency: "SAR",
        listingAgentId: userId,
      };

      if (!payload.type) delete payload.type;
      if (!payload.developerId) delete payload.developerId;
      if (!payload.zoneId) delete payload.zoneId;

      const response = await editProperty({
        formData: payload,
        propertyId,
      }).unwrap();
      if (response?.success) {
        toast.success("Property updated successfully!");
      }
      
      router.refresh();
      router.push("/dashboard/my-properties");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update property");
    }
  };

  if (propertyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <FaSpinner className="animate-spin h-8 w-8 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/my-properties">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-white rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Property Listing</h1>
            <p className="text-gray-400 mt-1">Update details for your listing.</p>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit, (errs) => {
          console.error("Form Validation Errors:", errs);
          toast.error("Please fill in all required fields correctly.");
        })} className="space-y-6">
          
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-emerald-400 border-b border-stone-800 pb-2">General Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Property Title</Label>
                <Input
                  {...register("title")}
                  placeholder="Luxury Villa in Al Malqa"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Sak Number</Label>
                <Input
                  {...register("sakNumber")}
                  placeholder="Enter Sak Number"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Listing Purpose</Label>
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
                <Label className="text-white">Developer</Label>
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
                <Label className="text-white">Select Zone</Label>
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

                return (
                  <AddressInput
                    register={register}
                    setValue={setValue}
                    addressLineFieldName="addressLine"
                    latitudeFieldName="latitude"
                    longitudeFieldName="longitude"
                    mapEmbedUrlFieldName="mapEmbedUrl"
                    locationFieldName="location"
                    placeholder="Search your address"
                    zoneName={zoneName}
                  />
                );
              })()}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-semibold text-emerald-400 border-b border-stone-800 pb-2">Property Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-white">Price (SAR)</Label>
                <Input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="4200000"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Total Units</Label>
                <Input
                  type="number"
                  {...register("totalUnits", { valueAsNumber: true })}
                  placeholder="Total Units"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Available Units</Label>
                <Input
                  type="number"
                  {...register("availableUnits", { valueAsNumber: true })}
                  placeholder="Available Units"
                  className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 focus-visible:ring-emerald-500"
                />
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
            <Label className="text-white">Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Property Description"
              className="bg-stone-950 border-stone-800 text-white placeholder:text-gray-600 min-h-[120px] focus-visible:ring-emerald-500"
            />
          </div>

          {/* Upload Photos */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-semibold text-emerald-400 border-b border-stone-800 pb-2">Media</h3>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <Label className="text-white">Current Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {existingImages.map((url, index) => {
                    const isVideo = url.match(/\.(mp4|webm|ogg)$/i) !== null;
                    const videoSrc = url.startsWith("blob:") ? url : `/api/video-proxy?url=${encodeURIComponent(url)}`;
                    return (
                      <div key={index} className="relative group rounded overflow-hidden border border-stone-700">
                        {isVideo ? (
                          <video
                            src={videoSrc}
                            className="object-cover w-full h-32 bg-black"
                            controls
                            muted
                          />
                        ) : (
                          <Image
                            src={url}
                            alt={`Existing ${index + 1}`}
                            width={200}
                            height={150}
                            className="object-cover w-full h-32"
                          />
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeExistingImage(index);
                          }}
                          className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white">Upload New Media</Label>
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
                          e.preventDefault();
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
              disabled={editPropertyLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            >
              {editPropertyLoading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin h-4 w-4" />
                  Updating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Update Property
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
