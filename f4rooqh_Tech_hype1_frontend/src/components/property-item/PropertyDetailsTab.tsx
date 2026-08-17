"use client";

import { TabsContent } from "@/components/ui/tabs";
import { DetailItem } from "./DetailItem";

interface PropertyDetailsTabProps {
  yearBuilt?: number;
  floorNumber?: number;
  balconies?: number;
  furnished?: boolean;
  roiProjectionPercent?: number;
  estimatedRentalIncome?: number;
  developer?: any;
  createdAt?: string;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString?: string) => string;
}

export function PropertyDetailsTab({
  yearBuilt,
  floorNumber,
  balconies,
  furnished,
  roiProjectionPercent,
  estimatedRentalIncome,
  developer,
  createdAt,
  formatCurrency,
  formatDate,
}: PropertyDetailsTabProps) {
  return (
    <TabsContent value="details" className="mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DetailItem label="Year Built" value={yearBuilt || "N/A"} />
        <DetailItem label="Floor" value={floorNumber || "N/A"} />
        <DetailItem label="Balconies" value={balconies || 0} />
        <DetailItem label="Furnished" value={furnished ? "Yes" : "No"} />
        <DetailItem
          label="ROI Projection"
          value={`${roiProjectionPercent || 0}%`}
        />
        <DetailItem
          label="Est. Rental"
          value={formatCurrency(estimatedRentalIncome || 0)}
        />
        <DetailItem label="Developer" value={developer?.name || "N/A"} />
        <DetailItem label="Listed" value={formatDate(createdAt)} />
      </div>
    </TabsContent>
  );
}
