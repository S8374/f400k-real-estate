import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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

interface NavbarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: CategoryItem[];
}

export const ATTRACTIVE_COLORS = [
  "#00f0ff", // Electric Cyan
  "#bd00ff", // Cyber Purple
  "#ff00a0", // Neon Pink
  "#ffaa00", // Electric Orange
  "#00ff87", // Emerald Green
  "#0070ff", // Bright Blue
  "#ff5f00", // Vibrant Coral/Red
];

export function isColorTooDarkOrBlack(hex: string | undefined): boolean {
  if (!hex) return true;
  const cleanHex = hex.replace("#", "").trim().toLowerCase();
  
  if (cleanHex === "black" || cleanHex === "null" || cleanHex === "undefined" || cleanHex === "" || cleanHex === "000000") {
    return true;
  }
  
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return (r + g + b) < 60;
  }
  
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return (r + g + b) < 60;
  }
  
  return false;
}

export function getAttractiveColor(name: string | undefined, dbColor: string | undefined): string {
  if (dbColor && !isColorTooDarkOrBlack(dbColor)) {
    return dbColor;
  }
  
  if (!name) return ATTRACTIVE_COLORS[0];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ATTRACTIVE_COLORS.length;
  return ATTRACTIVE_COLORS[index];
}

export const CategoryPills = ({
  selectedCategory,
  setSelectedCategory,
  categories,
}: NavbarProps) => (
  <div className="flex justify-center items-center gap-3 flex-wrap">
    {categories.map((cat) => {
      const isSelected = selectedCategory === cat.value;
      const pillColor = getAttractiveColor(cat.label, cat.color);

      return (
        <Button
          key={cat.value}
          variant="secondary"
          className={cn(
            "px-4 py-2 rounded text-sm md:text-base flex cursor-pointer items-center gap-2 whitespace-nowrap",
            "text-white border transition-all",
            isSelected ? "text-neutral-900 font-semibold border-[#00ff87]" : "bg-transparent border-[#8F9093] hover:bg-zinc-800"
          )}
          style={isSelected ? { backgroundColor: "#00ff87" } : undefined}
          onClick={() => setSelectedCategory(cat.value)}
        >
          {cat.label}
          {typeof cat.count === "number" ? `(${cat.count})` : ""}
        </Button>
      );
    })}
  </div>
);
