import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class SubscriberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async subscribe(email: string) {
    // Check if the user is already subscribed
    const existingSubscriber = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      throw new HttpException('You are already subscribed.', HttpStatus.CONFLICT);
    }

    // Create a new subscriber
    const newSubscriber = await this.prisma.newsletterSubscriber.create({
      data: { email },
    });

    // Dispatch the email notification
    await this.mailService.sendNewsletterNotification(email);

    return {
      success: true,
      message: 'Successfully subscribed to the newsletter!',
      data: newSubscriber,
    };
  }

  async getSubscribers() {
    return await this.prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    await this.prisma.newsletterSubscriber.delete({
      where: { id },
    });
    return { success: true, message: 'Subscriber removed successfully' };
  }
}
