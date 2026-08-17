import { MapPin, TrendingUp, DollarSign } from "lucide-react";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";

export interface HomeSearchFilters {
  location: string;
  search: string;
  minPrice: string;
  maxPrice: string;
  listingPurpose: "" | "SELL" | "RENT";
  timeFilter: "" | "today" | "this_week" | "this_month" | "this_year";
}

interface SearchBarProps {
  isMobile?: boolean;
  filters: HomeSearchFilters;
  onFiltersChange: (filters: Partial<HomeSearchFilters>) => void;
  onSearchSubmit: () => void;
}

export const SearchBar = ({ isMobile = false, filters, onFiltersChange, onSearchSubmit }: SearchBarProps) => {
  const handleLocationChange = (value: string) => onFiltersChange({ location: value });
  const handleSearchChange = (value: string) => onFiltersChange({ search: value });
  const handleMinPriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    onFiltersChange({ minPrice: numericValue });
  };
  const handleMaxPriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    onFiltersChange({ maxPrice: numericValue });
  };
  const handleListingPurposeChange = (value: "" | "SELL" | "RENT") =>
    onFiltersChange({ listingPurpose: value });
  const handleTimeFilterChange = (value: "" | "today" | "this_week" | "this_month" | "this_year") =>
    onFiltersChange({ timeFilter: value });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearchSubmit();
  };

  return (
    <div
      className={cn(
        "bg-[#151515] transition-all",
        isMobile
          ? "w-full rounded grid grid-cols-2 gap-2.5 p-3 border border-zinc-800 shadow-sm"
          : "w-full max-w-280 rounded h-14 flex items-center px-2 border border-zinc-800 shadow-sm hover:border-zinc-700"
      )}
    >
      {/* Location */}
      <div className={cn(
        "flex items-center gap-2 min-w-0",
        isMobile
          ? "w-full h-11 rounded border border-zinc-800 bg-[#1c1c1c] px-3"
          : "flex-1 h-10 border-r border-zinc-800 px-3"
      )}>
        <MapPin className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2.2} />
        <Input
          type="text"
          placeholder="City, District, or Mega Project"
          value={filters.location}
          onChange={(e) => handleLocationChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-9 border-0 bg-transparent text-zinc-100 placeholder-zinc-500 focus-visible:ring-0 focus-visible:outline-none w-full",
            isMobile ? "text-sm" : "text-[14px]"
          )}
        />
      </div>

      {/* Search */}
      <div className={cn(
        "flex items-center gap-2 min-w-0",
        isMobile
          ? "w-full h-11 rounded border border-zinc-800 bg-[#1c1c1c] px-3"
          : "flex-1 h-10 border-r border-zinc-800 px-3"
      )}>
        <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2.2} />
        <Input
          type="text"
          placeholder="Search your dream property"
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-9 border-0 bg-transparent text-[14px] text-zinc-100 placeholder-zinc-500 focus-visible:ring-0 focus-visible:outline-none w-full"
        />
      </div>

      {/* Price Range */}
      <div className={cn(
        "flex items-center gap-2",
        isMobile
          ? "w-full h-11 rounded border border-zinc-800 bg-[#1c1c1c] px-3 col-span-2"
          : "shrink-0 h-10 px-3 border-r border-zinc-800"
      )}>
        {!isMobile ? (
          <>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 border-0 bg-transparent text-[14px] text-zinc-100 placeholder-zinc-500 focus-visible:ring-0 focus-visible:outline-none w-full sm:w-16"
            />
            <DollarSign className="w-4 h-4 text-emerald-500 shrink-0 opacity-80" strokeWidth={2.2} />
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 border-0 bg-transparent text-[14px] text-zinc-100 placeholder-zinc-500 focus-visible:ring-0 focus-visible:outline-none w-full sm:w-16"
            />
          </>
        ) : (
          <div className="flex items-center gap-2 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 min-w-[70px] flex-1 border border-zinc-800 rounded bg-[#1c1c1c] px-2 text-xs text-zinc-100 placeholder-zinc-500 focus-visible:ring-0 focus-visible:outline-none"
            />
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 min-w-[70px] flex-1 border border-zinc-800 rounded bg-[#1c1c1c] px-2 text-xs text-zinc-100 placeholder-zinc-500 focus-visible:ring-0 focus-visible:outline-none"
            />
            <select
              value={filters.listingPurpose}
              onChange={(e) => handleListingPurposeChange(e.target.value as any)}
              className="h-8 min-w-[85px] bg-[#1c1c1c] text-xs text-zinc-300 px-2 rounded border border-zinc-800 focus:outline-none cursor-pointer shrink-0"
            >
              <option value="">Purpose</option>
              <option value="SELL">Sell</option>
              <option value="RENT">Rent</option>
            </select>
            <select
              value={filters.timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value as any)}
              className="h-8 min-w-[90px] bg-[#1c1c1c] text-xs text-zinc-300 px-2 rounded border border-zinc-800 focus:outline-none cursor-pointer shrink-0"
            >
              <option value="">Any time</option>
              <option value="today">Today</option>
              <option value="this_week">This week</option>
              <option value="this_month">This month</option>
              <option value="this_year">This year</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
