"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const context_module_1 = require("./common/context/context.module");
const request_id_middleware_1 = require("./common/middleware/request-id.middleware");
const core_1 = require("@nestjs/core");
const response_standardization_interceptor_1 = require("./common/interceptors/response-standardization.interceptor");
const request_logger_middleware_1 = require("./common/middleware/request-logger.middleware");
const config_1 = require("@nestjs/config");
const mail_module_1 = require("./mail/mail.module");
const auth_module_1 = require("./modules/auth/auth.module");
const property_module_1 = require("./modules/property/property.module");
const property_attribute_module_1 = require("./modules/property-attribute/property-attribute.module");
const developer_module_1 = require("./modules/developer/developer.module");
const unit_module_1 = require("./modules/unit/unit.module");
const media_module_1 = require("./modules/media/media.module");
const paymentplan_module_1 = require("./modules/paymentplan/paymentplan.module");
const milestone_module_1 = require("./modules/milestone/milestone.module");
const payment_plan_acceptance_module_1 = require("./modules/payment-plan-acceptance/payment-plan-acceptance.module");
const milestone_payment_module_1 = require("./modules/milestone-payment/milestone-payment.module");
const buyer_module_1 = require("./modules/buyer/buyer.module");
const agent_module_1 = require("./modules/agent/agent.module");
const admin_module_1 = require("./modules/admin/admin.module");
const save_property_module_1 = require("./modules/save-property/save-property.module");
const property_view_module_1 = require("./modules/property-view/property-view.module");
const bank_account_module_1 = require("./modules/bank-account/bank-account.module");
const property_invisitor_module_1 = require("./modules/property-invisitor/property-invisitor.module");
const kyc_document_module_1 = require("./modules/kyc-document/kyc-document.module");
const auth_guard_1 = require("./modules/auth/guards/auth.guard");
const roles_guard_1 = require("./modules/auth/guards/roles.guard");
const uplode_module_1 = require("./modules/uplode/uplode.module");
const verified_module_1 = require("./modules/verified/verified.module");
const message_module_1 = require("./modules/message/message.module");
const zone_module_1 = require("./modules/zone/zone.module");
const subscriber_module_1 = require("./modules/subscriber/subscriber.module");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_id_middleware_1.RequestIdMiddleware, request_logger_middleware_1.RequestLoggerMiddleware)
            .forRoutes('*path');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [context_module_1.ContextModule, config_1.ConfigModule.forRoot(), schedule_1.ScheduleModule.forRoot(), verified_module_1.VerifiedModule, uplode_module_1.UploadeModule, kyc_document_module_1.KycDocumentModule, save_property_module_1.SavedListingModule, property_invisitor_module_1.PropertyInvisitorModule, property_view_module_1.PropertyViewModule, bank_account_module_1.BankAccountModule, buyer_module_1.BuyerModule, agent_module_1.AgentModule, admin_module_1.AdminModule, payment_plan_acceptance_module_1.PaymentPlanAcceptanceModule, milestone_payment_module_1.MilestonePaymentModule, mail_module_1.MailModule, auth_module_1.AuthModule, property_module_1.PropertyModule, property_attribute_module_1.PropertyAttributeModule, developer_module_1.DeveloperModule, unit_module_1.UnitModule, media_module_1.MediaModule, paymentplan_module_1.PaymentPlanModule, milestone_module_1.MilestoneModule, milestone_payment_module_1.MilestonePaymentModule, message_module_1.MessageModule, zone_module_1.ZoneModule, subscriber_module_1.SubscriberModule],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_standardization_interceptor_1.ResponseStandardizationInterceptor,
            },
            {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({
                    whitelist: false,
                    transform: true,
                    forbidNonWhitelisted: false,
                    transformOptions: {
                        enableImplicitConversion: true,
                    },
                    exceptionFactory: (errors) => {
                        return new common_1.BadRequestException(errors);
                    },
                }),
            },
            core_1.Reflector,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map