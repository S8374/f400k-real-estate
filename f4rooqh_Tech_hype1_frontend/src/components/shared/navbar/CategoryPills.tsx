"use client";

import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";

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
}

export const CategoryPills = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  isSubCategory = false,
}: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: CategoryItem[];
  isSubCategory?: boolean;
}) => {
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="flex md:justify-center items-center gap-2 md:gap-3 overflow-x-auto flex-nowrap md:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1"
      variants={isSubCategory ? container : {}}
      initial={isSubCategory ? "hidden" : false}
      animate={isSubCategory ? "show" : false}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.value;

        return (
          <motion.div key={cat.value} variants={isSubCategory ? item : {}}>
            <Button
              variant="secondary"
              className={cn(
                "rounded flex cursor-pointer items-center gap-2 whitespace-nowrap transition-all shadow-none outline-none focus-visible:ring-0",
                isSubCategory 
                  ? "text-xs px-4 py-1.5"
                  : "text-sm px-5 py-2",
                isSelected 
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-medium hover:from-emerald-600 hover:to-emerald-800" 
                  : "bg-transparent border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800 font-normal"
              )}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
