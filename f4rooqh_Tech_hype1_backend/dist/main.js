"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const context_service_1 = require("./common/context/context.service");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
    app.enableCors({
        origin: [
            'http://localhost:3004',
            'http://localhost:3003',
            'http://localhost:3002',
            'http://localhost:3001',
            'http://localhost:3000',
            'https://real-estate-investor-eight.vercel.app',
            'https://realestate-investor-murex.vercel.app',
            "https://realestate-investor-pearl.vercel.app",
            "https://sakruya.com",
            "https://www.sakruya.com",
            "https://admin.sakruya.com"
        ],
        credentials: true
    });
    const httpAdapterHost = app.get(core_1.HttpAdapterHost);
    const contextService = app.get(context_service_1.ContextService);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(httpAdapterHost, contextService));
    app.use((0, cookie_parser_1.default)());
    app.use(passport_1.default.initialize());
    app.setGlobalPrefix('api/v1');
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.enableShutdownHooks();
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map