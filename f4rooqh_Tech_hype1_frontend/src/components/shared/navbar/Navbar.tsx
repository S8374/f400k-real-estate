"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../ui/button";
import { Search, UserCircle } from "lucide-react";
import UserProfileDropdown from "../UserProfileDropdown";
import { useGetMeQuery } from "@/redux/api/authApi";
import { NavbarUserLoadingSkeleton, CategoryPillsSkeleton } from "./NavbarSkeletons";
import { CategoryItem, CategoryPills } from "./CategoryPills";
import { HomeSearchFilters, SearchBar } from "./SearchBar";

export type { HomeSearchFilters, CategoryItem };

export interface NavbarProps {
  selectedCategory: string;
  activeMainCategory?: string;
  setSelectedCategory: (category: string) => void;
  categories: CategoryItem[];
  subCategories?: CategoryItem[];
  isCategoriesLoading?: boolean;
  filters: HomeSearchFilters;
  onFiltersChange: (filters: Partial<HomeSearchFilters>) => void;
  onSearchSubmit: () => void;
  onClearFilters: () => void;
}

const Navbar = ({
  selectedCategory,
  activeMainCategory,
  setSelectedCategory,
  categories,
  subCategories = [],
  isCategoriesLoading = false,
  filters,
  onFiltersChange,
  onSearchSubmit,
  onClearFilters,
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: userData, isLoading, isFetching, isError } = useGetMeQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const isUserLoading = isLoading || isFetching;
  const user = isError ? null : (userData?.data?.data || userData?.data);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleListingPurposeChange = (value: "" | "SELL" | "RENT") =>
    onFiltersChange({ listingPurpose: value });
  const handleTimeFilterChange = (value: "" | "today" | "this_week" | "this_month" | "this_year") =>
    onFiltersChange({ timeFilter: value });

  return (
    <nav
      className={cn(
        "relative z-50 bg-[#0b0d12] border-b border-zinc-800 flex flex-col items-center py-4 md:py-5 transition-all",
        { "backdrop-blur-md shadow-sm bg-[#0b0d12]/95 sticky top-0": isScrolled }
      )}
    >
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-20 flex flex-col gap-4 items-center">
        <div className="flex w-full items-center justify-between gap-3 xl:grid xl:grid-cols-[300px_minmax(0,1fr)_300px] xl:items-center xl:gap-3">
          {/* Logo */}
          <div className="flex items-center xl:justify-start">
            <Link href="/" className="shrink-0 relative w-48 h-16 sm:w-56 sm:h-20 xl:w-64 xl:h-24 block hover:opacity-90 transition-opacity">
              <Image
                alt="SakRuya"
                src="/logo/logo.png"
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden xl:flex flex-1 w-full max-w-[1000px] mx-auto justify-center items-center bg-[#151515] border border-zinc-800 rounded-lg h-14 pl-2 pr-1 shadow-sm hover:border-zinc-700 transition-all">
            <SearchBar
              filters={filters}
              onFiltersChange={onFiltersChange}
              onSearchSubmit={onSearchSubmit}
            />

            {/* Desktop Filters */}
            <select
              value={filters.listingPurpose}
              onChange={(e) => handleListingPurposeChange(e.target.value as any)}
              className="bg-transparent h-10 text-[14px] text-zinc-300 font-medium px-3 border-r border-zinc-800 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#1c1c1c] text-zinc-100">Purpose</option>
              <option value="SELL" className="bg-[#1c1c1c] text-zinc-100">Sell</option>
              <option value="RENT" className="bg-[#1c1c1c] text-zinc-100">Rent</option>
            </select>

            <select
              value={filters.timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value as any)}
              className="bg-transparent h-10 text-[14px] text-zinc-300 font-medium px-3 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#1c1c1c] text-zinc-100">Any time</option>
              <option value="today" className="bg-[#1c1c1c] text-zinc-100">Today</option>
              <option value="this_week" className="bg-[#1c1c1c] text-zinc-100">This week</option>
              <option value="this_month" className="bg-[#1c1c1c] text-zinc-100">This month</option>
              <option value="this_year" className="bg-[#1c1c1c] text-zinc-100">This year</option>
            </select>

            <Button
              type="button"
              onClick={onSearchSubmit}
              className="w-10 h-10 rounded shrink-0 ml-2 p-0 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white transition-all shadow-none"
            >
              <Search className="w-4 h-4 stroke-2" />
            </Button>
            <Button
              type="button"
              onClick={onClearFilters}
              variant="ghost"
              className="h-10 px-3 rounded ml-1 text-[13px] font-medium text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              Clear
            </Button>
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center justify-end">
            {isUserLoading ? (
              <NavbarUserLoadingSkeleton />
            ) : !user ? (
              <div className="flex items-center gap-1 sm:gap-2 mx-1 sm:mx-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 py-2 px-5 text-center rounded bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white transition-colors text-sm font-semibold shadow-sm whitespace-nowrap"
                >
                  <UserCircle className="w-5 h-5" />
                  <span>Get Started</span>
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <UserProfileDropdown user={user} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="xl:hidden w-full px-2 flex flex-col gap-2">
          <SearchBar
            isMobile
            filters={filters}
            onFiltersChange={onFiltersChange}
            onSearchSubmit={onSearchSubmit}
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={onSearchSubmit}
              className="flex-1 h-10 rounded text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white transition-all shadow-none"
            >
              <Search className="w-4 h-4 stroke-2" />
              <span className="sm:hidden">Search</span>
              <span className="hidden sm:inline">Search Properties</span>
            </Button>

            <Button
              type="button"
              onClick={onClearFilters}
              variant="ghost"
              className="w-full h-10 rounded text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100 transition-colors flex-1"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
      
      {/* Category Pills with Loading Skeleton */}
      <div className="w-full max-w-280 mt-4">
        {isCategoriesLoading ? (
          <CategoryPillsSkeleton />
        ) : (
          <div className="flex flex-col gap-3">
            <CategoryPills
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              activeSubCategories={subCategories}
              activeMainCategory={activeMainCategory || selectedCategory}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
