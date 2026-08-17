import { PrismaService } from '../../common/context/prisma.service';
import { MailService } from '../../mail/mail.service';
export declare class SubscriberService {
    private readonly prisma;
    private readonly mailService;
    constructor(prisma: PrismaService, mailService: MailService);
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
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
