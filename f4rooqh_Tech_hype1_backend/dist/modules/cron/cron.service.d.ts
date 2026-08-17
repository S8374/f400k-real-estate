import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../common/context/prisma.service';
export declare class CronService {
    private readonly prisma;
    private readonly mailService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService);
    handlePaymentReminders(): Promise<void>;
}
