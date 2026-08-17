"use client";

import { useSearchParams } from "next/navigation";
import { useGetAllPropertiesQuery } from "@/redux/api/propertyApi";
import { useGetAllZonesQuery } from "@/redux/api/zoneApi";
import { useMemo, useState, useEffect } from "react";
import Banner from "@/components/modules/home/Banner";
import { HomeSearchFilters } from "@/components/shared/navbar/Navbar";
import { CategoryItem } from "@/components/shared/NavCategory";
import { PropertySearchParams } from "@/redux/api/propertyApi";

const DEFAULT_FILTERS: HomeSearchFilters = {
  location: "",
  search: "",
  minPrice: "",
  maxPrice: "",
  listingPurpose: "",
  timeFilter: "",
};
const DEFAULT_CATEGORY = "allproperties";

const parseNumber = (value: string) => {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const areFiltersEqual = (a: HomeSearchFilters, b: HomeSearchFilters) =>
  a.location === b.location &&
  a.search === b.search &&
  a.minPrice === b.minPrice &&
  a.maxPrice === b.maxPrice &&
  a.listingPurpose === b.listingPurpose &&
  a.timeFilter === b.timeFilter;

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const zoneIdParam = searchParams.get("zoneId");

  const [selectedCategory, setSelectedCategory] = useState(zoneIdParam || DEFAULT_CATEGORY);
  const [filters, setFilters] = useState<HomeSearchFilters>(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState<HomeSearchFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    if (zoneIdParam) {
      setSelectedCategory(zoneIdParam);
    }
  }, [zoneIdParam]);

  const queryParams = useMemo<PropertySearchParams>(() => {
    return {
      zoneId: selectedCategory !== DEFAULT_CATEGORY ? selectedCategory : undefined,
      location: activeFilters.location,
      search: activeFilters.search,
      listingPurpose: activeFilters.listingPurpose || undefined,
      minPrice: parseNumber(activeFilters.minPrice),
      maxPrice: parseNumber(activeFilters.maxPrice),
      timeFilter: activeFilters.timeFilter || undefined,
    };
  }, [activeFilters, selectedCategory]);

  const { data: allPropertiesResponse, refetch, isLoading: isPropertiesLoading, isFetching: isPropertiesFetching } = useGetAllPropertiesQuery(queryParams);
  const { data: zonesResponse, isLoading: isCategoriesLoading, isFetching: isCategoriesFetching } = useGetAllZonesQuery(undefined);

  const apiProperties = useMemo(() => {
    const rawData = allPropertiesResponse?.data?.data || allPropertiesResponse?.data;
    if (Array.isArray(rawData)) return rawData;
    return [];
  }, [allPropertiesResponse]);

  const filteredProperties = useMemo(() => {
    return apiProperties.map((property: any) => ({
      id: property.id,
      createdAt: property.createdAt,
      title: property.title,
      price: `${property.currency || "SAR"} ${Number(property.price || 0).toLocaleString()}`,
      subtitle: [property.location || property.addressLine, property.listingPurpose]
        .filter(Boolean)
        .join(" • "),
      roi: property.roiProjectionPercent ? `${property.roiProjectionPercent}% ROI` : "",
      area: property.areaSqm ? `${property.areaSqm} m2` : "",
      badge: property.isRegaVerified ? "REGA VERIFIED" : undefined,
      verified: Boolean(property.isRegaVerified),
      trophy: false,
      images: property.images?.length 
        ? property.images 
        : (property.media?.map((item: any) => item.url).filter(Boolean) ?? []),
      latitude: property.latitude,
      longitude: property.longitude,
    }));
  }, [apiProperties]);

  const categoryItems = useMemo<CategoryItem[]>(() => {
    const rawPayload = zonesResponse?.data;
    const backendZones = Array.isArray(rawPayload) ? rawPayload : [];
    const mainZones = backendZones.filter((z: any) => !z.parentId);

    const dynamicCategories = mainZones.map((zone: any) => ({
      label: zone.name,
      value: zone.id,
      count: 0,
      icon: undefined,
      subtitle: zone.subtitle,
      latitude: zone.latitude,
      longitude: zone.longitude,
      color: zone.color,
      geojson: zone.geojson,
      isMainZone: true,
    }));

    return [{ label: "All Properties", value: "allproperties", count: 0 }, ...dynamicCategories];
  }, [zonesResponse]);

  const subCategoryItems = useMemo<{ subZones: CategoryItem[]; activeMainZoneId: string | undefined }>(() => {
    const rawPayload = zonesResponse?.data;
    const backendZones = Array.isArray(rawPayload) ? rawPayload : [];

    let activeMainZoneId = selectedCategory;
    const selectedZoneObj = backendZones.find((z: any) => z.id === selectedCategory);
    
    if (selectedZoneObj && selectedZoneObj.parentId) {
      activeMainZoneId = selectedZoneObj.parentId;
    }

    if (activeMainZoneId === "allproperties" || !activeMainZoneId) {
      return { subZones: [], activeMainZoneId: undefined };
    }

    const subZones = backendZones.filter((z: any) => z.parentId === activeMainZoneId);
    const subCategories = subZones.map((zone: any) => ({
      label: zone.name,
      value: zone.id,
      count: 0,
      icon: undefined,
      subtitle: zone.subtitle,
      latitude: zone.latitude,
      longitude: zone.longitude,
      color: zone.color,
      geojson: zone.geojson,
      isMainZone: false,
    }));
    
    return { subZones: subCategories, activeMainZoneId };
  }, [zonesResponse, selectedCategory]);

  const handleFilterChange = (nextFilters: Partial<HomeSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }));
  };

  const handleSearchSubmit = () => {
    if (areFiltersEqual(filters, activeFilters)) {
      refetch();
      return;
    }
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setSelectedCategory(DEFAULT_CATEGORY);
    if (areFiltersEqual(activeFilters, DEFAULT_FILTERS)) {
      setFilters({ ...DEFAULT_FILTERS });
      refetch();
      return;
    }
    setFilters({ ...DEFAULT_FILTERS });
    setActiveFilters({ ...DEFAULT_FILTERS });
  };

  return (
    <div className="bg-black w-full min-h-screen">
      <Banner
        selectedCategory={selectedCategory}
        activeMainCategory={subCategoryItems.activeMainZoneId}
        properties={filteredProperties}
        setSelectedCategory={setSelectedCategory}
        categories={categoryItems}
        subCategories={subCategoryItems.subZones}
        isCategoriesLoading={isCategoriesLoading || isCategoriesFetching}
        filters={filters}
        onFiltersChange={handleFilterChange}
        onSearchSubmit={handleSearchSubmit}
        onClearFilters={handleClearFilters}
        isLoading={isPropertiesLoading || isPropertiesFetching}
      />
    </div>
  );
}
