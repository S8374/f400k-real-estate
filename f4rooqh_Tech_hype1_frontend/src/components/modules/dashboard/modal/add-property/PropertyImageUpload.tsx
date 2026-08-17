"use client";

import { Label } from "@/components/ui/label";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface PropertyImageUploadProps {
  images: File[];
  previews: string[];
  existingImages?: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  removeExistingImage?: (index: number) => void;
}

export function PropertyImageUpload({
  images,
  previews,
  existingImages = [],
  handleImageChange,
  removeImage,
  removeExistingImage,
}: PropertyImageUploadProps) {
  return (
    <div className="space-y-2">
      <Label className="text-white">Upload Photos</Label>
      <div
        className="border-2 border-dashed border-stone-700 rounded p-8 text-center cursor-pointer hover:border-emerald-600 transition-colors"
        onClick={() => document.getElementById("image-upload")?.click()}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/png,image/jpeg"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
        <ImagePlus className="mx-auto h-6 w-10 text-gray-400 mb-3" />
        <p className="text-gray-400">
          Drop your files here or{" "}
          <span className="text-emerald-500">browse</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">Maximum size: 5MB</p>
      </div>

      {(previews.length > 0 || existingImages.length > 0) && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {existingImages.map((img, index) => (
            <div key={`existing-${index}`} className="relative group">
              <div className="aspect-square relative rounded overflow-hidden">
                <Image
                  src={img}
                  alt={`Existing ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              {removeExistingImage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExistingImage(index);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 rounded p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {previews.map((preview, index) => (
            <div key={`preview-${index}`} className="relative group">
              <div className="aspect-square relative rounded overflow-hidden">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 rounded p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
