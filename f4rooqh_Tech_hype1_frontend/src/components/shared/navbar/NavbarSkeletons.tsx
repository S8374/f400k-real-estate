import { Skeleton } from "../../ui/skeleton";
import { cn } from "@/lib/utils";

export const NavbarUserLoadingSkeleton = () => (
  <div className="flex items-center mx-2">
    <Skeleton className="h-9 w-32 rounded bg-white/10" />
  </div>
);

// Category Pills Loading Skeleton
export const CategoryPillsSkeleton = () => (
  <div className="flex justify-center items-center gap-3 flex-wrap w-full">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          "h-10 rounded bg-[#262626]",
          "w-[calc(50%-0.5rem)] sm:w-24 md:w-28"
        )}
      />
    ))}
  </div>
);
