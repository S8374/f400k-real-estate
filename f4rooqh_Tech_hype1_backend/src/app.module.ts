import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContextModule } from './common/context/context.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { ResponseStandardizationInterceptor } from './common/interceptors/response-standardization.interceptor';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { PropertyModule } from './modules/property/property.module';
import { PropertyAttributeModule } from './modules/property-attribute/property-attribute.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { UnitModule } from './modules/unit/unit.module';
import { MediaModule } from './modules/media/media.module';
import { PaymentPlanModule } from './modules/paymentplan/paymentplan.module';
import { MilestoneModule } from './modules/milestone/milestone.module';
import { PaymentPlanAcceptanceModule } from './modules/payment-plan-acceptance/payment-plan-acceptance.module';
import { MilestonePaymentModule } from './modules/milestone-payment/milestone-payment.module';
import { BuyerModule } from './modules/buyer/buyer.module';
import { AgentModule } from './modules/agent/agent.module';
import { AdminModule } from './modules/admin/admin.module';
import { SavedListingModule } from './modules/save-property/save-property.module';
import { PropertyViewModule } from './modules/property-view/property-view.module';
import { BankAccountModule } from './modules/bank-account/bank-account.module';
import { PropertyInvisitorModule } from './modules/property-invisitor/property-invisitor.module';
import { KycDocumentModule } from './modules/kyc-document/kyc-document.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { UploadeModule } from './modules/uplode/uplode.module';
import { VerifiedModule } from './modules/verified/verified.module';
import { MessageModule } from './modules/message/message.module';

import { ZoneModule } from './modules/zone/zone.module';
import { SubscriberModule } from './modules/subscriber/subscriber.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ContextModule, ConfigModule.forRoot(), ScheduleModule.forRoot(), VerifiedModule, UploadeModule, KycDocumentModule, SavedListingModule, PropertyInvisitorModule, PropertyViewModule, BankAccountModule, BuyerModule, AgentModule, AdminModule, PaymentPlanAcceptanceModule, MilestonePaymentModule, MailModule, AuthModule, PropertyModule, PropertyAttributeModule, DeveloperModule, UnitModule, MediaModule, PaymentPlanModule, MilestoneModule, MilestonePaymentModule, MessageModule, ZoneModule, SubscriberModule],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Guards — AuthGuard runs first, then RolesGuard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStandardizationInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: false,

        transform: true,
        forbidNonWhitelisted: false,
        transformOptions: {
          enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
          return new BadRequestException(errors);
        },
      }),
    },
    Reflector,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, RequestLoggerMiddleware)
      .forRoutes('*path');
  }
}
