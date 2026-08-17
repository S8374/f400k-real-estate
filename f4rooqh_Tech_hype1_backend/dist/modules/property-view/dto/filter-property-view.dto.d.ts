import { ViewSource } from './create-property-view.dto';
export declare class FilterPropertyViewDto {
    propertyId?: string;
    userId?: string;
    source?: ViewSource;
    fromDate?: string;
    toDate?: string;
    uniqueUsers?: boolean;
    page?: number;
    limit?: number;
}
export declare class PropertyViewAnalyticsDto {
    fromDate?: string;
    toDate?: string;
    source?: ViewSource;
    propertyId?: string;
    userId?: string;
    groupBy?: 'day' | 'week' | 'month' | 'source' | 'property';
}
