"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopPropertyDto = exports.ListingsByStatusDto = exports.RecentActivityDto = exports.AgentDashboardStatsDto = void 0;
class AgentDashboardStatsDto {
    totalListings;
    activeListings;
    soldListings;
    pendingListings;
    totalLeads;
    totalViews;
    conversionRate;
    recentActivity;
    listingsByStatus;
    topPerformingProperties;
}
exports.AgentDashboardStatsDto = AgentDashboardStatsDto;
class RecentActivityDto {
    id;
    type;
    propertyId;
    propertyTitle;
    propertyImage;
    timestamp;
    details;
}
exports.RecentActivityDto = RecentActivityDto;
class ListingsByStatusDto {
    status;
    count;
}
exports.ListingsByStatusDto = ListingsByStatusDto;
class TopPropertyDto {
    id;
    title;
    price;
    currency;
    views;
    leads;
    image;
}
exports.TopPropertyDto = TopPropertyDto;
//# sourceMappingURL=agent-dashboard.dto.js.map