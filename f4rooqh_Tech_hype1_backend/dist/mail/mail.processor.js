"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const otp_1 = require("./templates/otp");
const reset_password_1 = require("./templates/reset-password");
const welcome_1 = require("./templates/welcome");
const newsletter_1 = require("./templates/newsletter");
let MailProcessor = MailProcessor_1 = class MailProcessor extends bullmq_1.WorkerHost {
    mailerService;
    logger = new common_1.Logger(MailProcessor_1.name);
    constructor(mailerService) {
        super();
        this.mailerService = mailerService;
    }
    onFailed(job, error) {
        this.logger.error(`❌ Job ${job.name} (ID: ${job.id}) failed with error: ${error.message}`, error.stack);
    }
    async process(job) {
        this.logger.log(`Processing job ${job.name} with ID ${job.id}`);
        switch (job.name) {
            case 'send-welcome-email':
                await this.handleWelcomeEmail(job.data);
                break;
            case 'send-otp-email':
                await this.handleOtpEmail(job.data);
                break;
            case 'send-reset-password':
                await this.handleResetPassword(job.data);
                break;
            case 'send-newsletter-notification':
                await this.handleNewsletterNotification(job.data);
                break;
            case 'send-payment-reminder-email':
                await this.handlePaymentReminderEmail(job.data);
                break;
            default:
                this.logger.warn(`Unknown job name: ${job.name}`);
        }
    }
    async handlePaymentReminderEmail(data) {
        const subject = data.isLate
            ? `OVERDUE: Payment Required for ${data.milestoneName}`
            : `Reminder: Payment Due Today for ${data.milestoneName}`;
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: ${data.isLate ? '#ef4444' : '#f59e0b'};">
          ${data.isLate ? 'Payment Overdue Notice' : 'Payment Due Reminder'}
        </h2>
        <p>Hello,</p>
        <p>This is a notification regarding the milestone <strong>${data.milestoneName}</strong>.</p>
        <p>The payment for this milestone ${data.isLate ? 'was due on' : 'is due today,'} <strong>${new Date(data.dueDate).toLocaleDateString()}</strong>.</p>
        <p>Please log in to the dashboard to proceed with the payment receipt upload as soon as possible.</p>
        <br>
        <p>Best regards,<br>Farooq Investment Platform</p>
      </div>
    `;
        if (data.buyerEmail) {
            await this.mailerService.sendMail({
                to: data.buyerEmail,
                subject,
                html: htmlContent,
            });
            this.logger.log(`Reminder email sent to Buyer: ${data.buyerEmail}`);
        }
        if (data.agentEmail) {
            await this.mailerService.sendMail({
                to: data.agentEmail,
                subject: `Agent Copy - ${subject}`,
                html: htmlContent,
            });
            this.logger.log(`Reminder email sent to Agent: ${data.agentEmail}`);
        }
    }
    async handleWelcomeEmail(data) {
        await this.mailerService.sendMail({
            to: data.email,
            subject: 'Welcome to our App! 🎉',
            html: (0, welcome_1.getWelcomeEmail)(data.fullName),
        });
        this.logger.log(`Email sent to ${data.email}`);
    }
    async handleOtpEmail(data) {
        await this.mailerService.sendMail({
            to: data.email,
            subject: 'Your Login OTP',
            html: (0, otp_1.getOtpEmail)(data.otp),
        });
    }
    async handleResetPassword(data) {
        await this.mailerService.sendMail({
            to: data.email,
            subject: 'Reset Password',
            html: (0, reset_password_1.getResetPasswordEmail)(data.token),
        });
    }
    async handleNewsletterNotification(data) {
        await this.mailerService.sendMail({
            to: data.subscriberEmail,
            subject: 'Thank You for Subscribing!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00B37E;">Welcome to our Newsletter!</h2>
          <p>Hi there,</p>
          <p>Thank you for subscribing to the Farooq Investment newsletter!</p>
          <p>You'll now receive the latest updates, news, and exclusive offers directly in your inbox.</p>
          <br>
          <p>Best regards,<br>The Farooq Investment Team</p>
        </div>
      `,
        });
        await this.mailerService.sendMail({
            to: process.env.EMAIL_SEND_INBOX || 'sabbirmridha880@gmail.com',
            subject: 'New Newsletter Subscriber!',
            html: (0, newsletter_1.getNewsletterAdminEmail)(data.subscriberEmail),
        });
    }
};
exports.MailProcessor = MailProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], MailProcessor.prototype, "onFailed", null);
exports.MailProcessor = MailProcessor = MailProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('mail'),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailProcessor);
//# sourceMappingURL=mail.processor.js.map