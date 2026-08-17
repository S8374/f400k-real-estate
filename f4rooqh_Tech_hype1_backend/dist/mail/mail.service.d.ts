import { Queue } from 'bullmq';
export declare class MailService {
    private mailQueue;
    constructor(mailQueue: Queue);
    sendUserOtp(user: {
        email: string;
        name: string;
    }, otp: string): Promise<void>;
    sendNewsletterNotification(subscriberEmail: string): Promise<void>;
    sendPaymentReminderEmail(buyerEmail: string, agentEmail: string, milestoneName: string, dueDate: Date, isLate: boolean): Promise<void>;
}
