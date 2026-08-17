import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

import { getOtpEmail } from './templates/otp';
import { getResetPasswordEmail } from './templates/reset-password';
import { getWelcomeEmail } from './templates/welcome';
import { getNewsletterAdminEmail } from './templates/newsletter';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`❌ Job ${job.name} (ID: ${job.id}) failed with error: ${error.message}`, error.stack);
  }
  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.name} with ID ${job.id}`);

    switch (job.name) {
      case 'send-welcome-email':
        await this.handleWelcomeEmail(
          job.data as { email: string; fullName: string },
        );
        break;
      case 'send-otp-email':
        await this.handleOtpEmail(job.data as { email: string; otp: string });
        break;
      case 'send-reset-password':
        await this.handleResetPassword(
          job.data as { email: string; token: string },
        );
        break;
      case 'send-newsletter-notification':
        await this.handleNewsletterNotification(
          job.data as { subscriberEmail: string }
        );
        break;
      case 'send-payment-reminder-email':
        await this.handlePaymentReminderEmail(
          job.data as { buyerEmail: string; agentEmail: string; milestoneName: string; dueDate: Date; isLate: boolean }
        );
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handlePaymentReminderEmail(data: { buyerEmail: string; agentEmail: string; milestoneName: string; dueDate: Date; isLate: boolean }) {
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

    // Send to buyer
    if (data.buyerEmail) {
      await this.mailerService.sendMail({
        to: data.buyerEmail,
        subject,
        html: htmlContent,
      });
      this.logger.log(`Reminder email sent to Buyer: ${data.buyerEmail}`);
    }

    // Send to agent
    if (data.agentEmail) {
      await this.mailerService.sendMail({
        to: data.agentEmail,
        subject: `Agent Copy - ${subject}`,
        html: htmlContent,
      });
      this.logger.log(`Reminder email sent to Agent: ${data.agentEmail}`);
    }
  }

  private async handleWelcomeEmail(data: { email: string; fullName: string }) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Welcome to our App! 🎉',
      html: getWelcomeEmail(data.fullName),
    });
    this.logger.log(`Email sent to ${data.email}`);
  }

  private async handleOtpEmail(data: { email: string; otp: string }) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Your Login OTP',
      html: getOtpEmail(data.otp),
    });
  }

  private async handleResetPassword(data: { email: string; token: string }) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Reset Password',
      html: getResetPasswordEmail(data.token),
    });
  }

  private async handleNewsletterNotification(data: { subscriberEmail: string }) {
    // Send email to the subscriber
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
    
    // Also notify the admin
    await this.mailerService.sendMail({
      to: process.env.EMAIL_SEND_INBOX || 'sabbirmridha880@gmail.com',
      subject: 'New Newsletter Subscriber!',
      html: getNewsletterAdminEmail(data.subscriberEmail),
    });
  }
}
