"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetPropertyByIdQuery } from "@/redux/api/propertyApi";
import { PropertyItem } from "@/components/PropertyItem";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { DashboardHomeSkeleton } from "@/components/modules/Skeleton/DashboardHomeSkeleton";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const { data: propertyResponse, isLoading } = useGetPropertyByIdQuery(propertyId, {
    skip: !propertyId,
  });

  const property = propertyResponse?.data?.data || propertyResponse?.data;

  if (isLoading) {
    return <DashboardHomeSkeleton />;
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <h2 className="text-2xl font-semibold mb-2">Property Not Found</h2>
        <p className="mb-6">The property you are looking for does not exist or has been deleted.</p>
        <Link 
          href="/dashboard/my-properties"
          className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full  mx-auto space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-stone-400 hover:text-emerald-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Properties
        </button>
      </div>

      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Manage Property
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Update details, add units, and manage payment plans for this listing.
          </p>
        </div>
      </div>

      {/* Property Item Full Width */}
      <div className="w-full mt-4">
        <PropertyItem 
          {...property} 
          paymentPlans={property.paymentPlans || []} 
        />
      </div>
    </div>
  );
}
