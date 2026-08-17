/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Banner from "@/components/modules/home/Banner";
import ContactBanner from "@/components/modules/home/ContactBanner";
import DeveloperProjects from "@/components/modules/home/DeveloperProjects";
import FeaturedProperties from "@/components/modules/home/FeaturedProperties";
import Footer from "@/components/modules/home/Footer";
import GeographicZones from "@/components/modules/home/GeographicZones";
import Subscribe from "@/components/modules/home/Subscribe";
import Verify from "@/components/modules/home/Verify";
import WhoWeAre from "@/components/modules/home/WhoWeAre";
import WhyInvest from "@/components/modules/home/WhyInvest";
import { CategoryItem } from "@/components/shared/NavCategory";
import { HomeSearchFilters } from "@/components/shared/navbar/Navbar";
import {
  PropertySearchParams,
  useGetAllPropertiesQuery,
} from "@/redux/api/propertyApi";
import { useGetAllZonesQuery } from "@/redux/api/zoneApi";
import { useMemo, useState } from "react";

interface ApiProperty {
  id: string;
  title: string;
  price: number;
  createdAt?: string;
  currency?: string;
  location?: string;
  addressLine?: string;
  listingPurpose?: "SELL" | "RENT";
  areaSqm?: number;
  roiProjectionPercent?: number;
  isRegaVerified?: boolean;
  images?: string[];
  media?: Array<{ url?: string }>;
  latitude?: number;
  longitude?: number;
}


const DEFAULT_FILTERS: HomeSearchFilters = {
  location: "",
  search: "",
  minPrice: "",
  maxPrice: "",
  listingPurpose: "",
  timeFilter: "",
};
const DEFAULT_CATEGORY = "allproperties";

const toCategoryLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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

const extractApiProperties = (response: any): ApiProperty[] => {
  const rawPropertyPayload = response?.data?.data;

  if (Array.isArray(rawPropertyPayload)) {
    return rawPropertyPayload;
  }

  if (Array.isArray(rawPropertyPayload?.data)) {
    return rawPropertyPayload.data;
  }

  return [];
};

const mapPropertyToCard = (property: ApiProperty) => {
  const images: string[] = property.images?.length
    ? property.images
    : (property.media
        ?.map((item) => item.url)
        .filter((url): url is string => typeof url === "string" && url.length > 0) ?? []);

  return {
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
    images,
    latitude: property.latitude,
    longitude: property.longitude,
  };
};

import FAQ from "@/components/modules/home/FAQ";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
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
  const {
    data: zonesResponse,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
  } = useGetAllZonesQuery(undefined);

  const apiProperties = useMemo<ApiProperty[]>(
    () => extractApiProperties(allPropertiesResponse),
    [allPropertiesResponse],
  );

  const filteredProperties = useMemo(
    () => apiProperties.map(mapPropertyToCard),
    [apiProperties],
  );

  const categoryItems = useMemo<CategoryItem[]>(() => {
    const rawPayload = zonesResponse?.data;
    const backendZones = Array.isArray(rawPayload) ? rawPayload : [];

    const mainZones = backendZones.filter((z: any) => !z.parentId && z.isActive !== false);

    const dynamicCategories: CategoryItem[] = mainZones.map((zone: any) => ({
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

    return [
      {
        label: "All Properties",
        value: "allproperties",
        count: 0,
      },
      ...dynamicCategories,
    ];
  }, [zonesResponse]);

  // Compute sub-categories based on selected category
  const subCategoryItems = useMemo<{ subZones: CategoryItem[]; activeMainZoneId: string | undefined }>(() => {
    const rawPayload = zonesResponse?.data;
    const backendZones = Array.isArray(rawPayload) ? rawPayload : [];

    // Find the active main zone
    let activeMainZoneId = selectedCategory;
    const selectedZoneObj = backendZones.find((z: any) => z.id === selectedCategory);
    
    if (selectedZoneObj && selectedZoneObj.parentId) {
      // The selected category is a sub-zone, so its parent is the active main zone
      activeMainZoneId = selectedZoneObj.parentId;
    }

    if (activeMainZoneId === "allproperties" || !activeMainZoneId) {
      return { subZones: [], activeMainZoneId: undefined };
    }

    const subZones = backendZones.filter((z: any) => z.parentId === activeMainZoneId && z.isActive !== false);

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

  // New add somting

  const handleClearFilters = () => {
    const resetFilters: HomeSearchFilters = { ...DEFAULT_FILTERS };

    setSelectedCategory(DEFAULT_CATEGORY);

    if (areFiltersEqual(activeFilters, DEFAULT_FILTERS)) {
      setFilters(resetFilters);
      refetch();
      return;
    }

    setFilters(resetFilters);
    setActiveFilters({ ...DEFAULT_FILTERS });
  };

  return (
    <div className="">
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
      <div className="">
        <WhoWeAre />
        <FeaturedProperties />
        <WhyInvest />
        <GeographicZones />
        <DeveloperProjects />
        <Verify />
        <ContactBanner />
        <FAQ />
        <Subscribe />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;