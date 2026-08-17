import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { ContextModule } from '../../common/context/context.module';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [ContextModule, MailModule],
  controllers: [SubscriberController],
  providers: [SubscriberService],
})
export class SubscriberModule {}
