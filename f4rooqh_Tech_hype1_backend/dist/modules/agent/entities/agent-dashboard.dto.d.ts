export declare class AgentDashboardStatsDto {
    totalListings: number;
    activeListings: number;
    soldListings: number;
    pendingListings: number;
    totalLeads: number;
    totalViews: number;
    conversionRate: string;
    recentActivity: RecentActivityDto[];
    listingsByStatus: ListingsByStatusDto[];
    topPerformingProperties: TopPropertyDto[];
}
export declare class RecentActivityDto {
    id: string;
    type: 'VIEW' | 'LEAD' | 'SAVE' | 'PAYMENT';
    propertyId: string;
    propertyTitle: string;
    propertyImage?: string;
    timestamp: Date;
    details?: string;
}
export declare class ListingsByStatusDto {
    status: string;
    count: number;
}
export declare class TopPropertyDto {
    id: string;
    title: string;
    price: number;
    currency: string;
    views: number;
    leads: number;
    image?: string;
}
