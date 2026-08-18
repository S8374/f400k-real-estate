"use client";

import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface CategoryItem {
  label: string;
  value: string;
  count?: number;
  icon?: string;
  subtitle?: string;
  latitude?: number;
  longitude?: number;
  color?: string;
  geojson?: any;
  isMainZone?: boolean;
  hasSubzones?: boolean;
}

export const CategoryPills = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  activeSubCategories = [],
  activeMainCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: CategoryItem[];
  activeSubCategories?: CategoryItem[];
  activeMainCategory?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  return (
    <motion.div 
      className="flex justify-center items-center gap-2 md:gap-3 flex-wrap pb-1 px-4 md:px-0"
    >
      {categories.map((cat) => {
        const isMainActive = cat.value === activeMainCategory;
        const isSelected = selectedCategory === cat.value;
        const isOpen = openDropdownId === cat.value;

        // Use the backend flag or fallback
        const hasSubCategories = cat.hasSubzones || (isMainActive && activeSubCategories.length > 0);

        // Render subcategories if active, or empty while loading
        const subCategoriesToRender = isMainActive ? activeSubCategories : [];

        const filteredSubCategories = subCategoriesToRender.filter(sub => 
          sub.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const pillButtonContent = (
          <>
            {cat.label}
            {hasSubCategories && (
              <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", isOpen && "rotate-180")} />
            )}
          </>
        );

        const buttonClassName = cn(
          "rounded flex cursor-pointer items-center justify-center gap-2 transition-all shadow-none outline-none focus-visible:ring-0",
          "text-sm px-5 py-2.5 whitespace-normal max-w-full h-auto text-center leading-snug",
          isSelected || isMainActive
            ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-medium hover:from-emerald-600 hover:to-emerald-800 border-transparent" 
            : "bg-[#1c1c1c] text-zinc-300 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-800 font-normal"
        );

        if (hasSubCategories) {
          return (
            <DropdownMenu 
              key={cat.value} 
              open={isOpen} 
              onOpenChange={(open) => {
                if (open) {
                  setSelectedCategory(cat.value);
                  setOpenDropdownId(cat.value);
                  setSearchQuery("");
                } else {
                  setOpenDropdownId(null);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className={buttonClassName}>
                  {pillButtonContent}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-[calc(100vw-32px)] md:w-72 bg-[#1c1c1c] border-zinc-700 max-h-[350px] overflow-hidden flex flex-col p-0"
                align="center"
                collisionPadding={16}
              >
                <div className="p-2 border-b border-zinc-800 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search your zone..."
                      className="w-full bg-[#2a2a2a] text-sm text-zinc-200 rounded py-2 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-shadow"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto p-1 flex-1">
                  {filteredSubCategories.length > 0 ? (
                    filteredSubCategories.map((sub) => (
                      <DropdownMenuItem
                        key={sub.value}
                        onClick={() => {
                          setSelectedCategory(sub.value);
                          setOpenDropdownId(null);
                        }}
                        className={cn(
                          "cursor-pointer py-2.5 px-3 text-sm rounded-sm mb-1 transition-colors",
                          selectedCategory === sub.value 
                            ? "bg-emerald-600/20 text-emerald-400 font-semibold"
                            : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        )}
                      >
                        {sub.label}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-zinc-500">
                      {isMainActive ? "No subzones found" : "Loading subzones..."}
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <motion.div key={cat.value}>
            <Button 
              variant="secondary" 
              className={buttonClassName}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {pillButtonContent}
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
