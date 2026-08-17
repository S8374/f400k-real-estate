import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
export declare class MailProcessor extends WorkerHost {
    private readonly mailerService;
    private readonly logger;
    constructor(mailerService: MailerService);
    onFailed(job: Job, error: Error): void;
    process(job: Job<any, any, string>): Promise<any>;
    private handlePaymentReminderEmail;
    private handleWelcomeEmail;
    private handleOtpEmail;
    private handleResetPassword;
    private handleNewsletterNotification;
}
