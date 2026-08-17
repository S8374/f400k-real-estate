import { SubscriberService } from './subscriber.service';
export declare class SubscriberController {
    private readonly subscriberService;
    constructor(subscriberService: SubscriberService);
    subscribe(email: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
        };
    }>;
    getSubscribers(): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }[]>;
    removeSubscriber(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
