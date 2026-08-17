import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function PropertySkeleton() {
  return (
    <div className="max-w-full mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-6 w-40 rounded-full" />
        </div>
        <Skeleton className="h-10 w-40 rounded" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="bg-stone-900/70 border-stone-800 backdrop-blur-sm"
          >
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property List */}
      <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* List Header */}
          <div className="flex justify-between items-center p-6 border-b border-stone-800/80">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Table Header - Desktop only */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-stone-800/80 bg-stone-950/40">
            <Skeleton className="col-span-4 h-4 w-32 ml-2" />
            <Skeleton className="col-span-2 h-4 w-24" />
            <Skeleton className="col-span-3 h-4 w-32" />
            <Skeleton className="col-span-2 h-4 w-24" />
            <Skeleton className="col-span-1 h-4 w-16 ml-auto mr-4" />
          </div>

          {/* Table Body */}
          <div className="divide-y divide-stone-800/50 bg-stone-900/20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 items-start md:items-center">
                {/* Listing Detail */}
                <div className="md:col-span-4 flex items-center gap-4 pl-0 md:pl-2 w-full">
                  <Skeleton className="h-16 w-24 md:h-14 md:w-20 rounded shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                
                {/* Price & Status */}
                <div className="md:col-span-2 flex flex-col gap-2 w-full mt-2 md:mt-0">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                {/* Analytics & Units */}
                <div className="md:col-span-3 flex flex-col gap-2 w-full mt-2 md:mt-0">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>

                {/* Listed Date */}
                <div className="md:col-span-2 flex flex-col gap-2 w-full mt-2 md:mt-0">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex justify-end w-full mt-2 md:mt-0 pr-0 md:pr-4">
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}