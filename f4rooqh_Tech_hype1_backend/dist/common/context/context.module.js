"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextModule = void 0;
const common_1 = require("@nestjs/common");
const context_service_1 = require("./context.service");
const prisma_service_1 = require("./prisma.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const redis_1 = require("@keyv/redis");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
let ContextModule = class ContextModule {
};
exports.ContextModule = ContextModule;
exports.ContextModule = ContextModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const logger = new common_1.Logger('CacheModule');
                    const redisUrl = configService.get('REDIS_URL', 'redis://localhost:6379');
                    const ttl = configService.get('CACHE_TTL', 60000);
                    const safeUrl = redisUrl.replace(/:\/\/(.*?)@/, '://***@');
                    logger.log(`Initializing Cache Store (Keyv)...`);
                    logger.debug(`Configuration -> URL: ${safeUrl}, TTL: ${ttl}ms`);
                    try {
                        const store = (0, redis_1.createKeyv)(redisUrl, {
                            namespace: 'AppCache',
                        });
                        store.on('error', (err) => {
                            logger.error(`[Keyv] Redis Connection Error: `, err);
                        });
                        const result = await store.set('startup_check', 'ok', 1000);
                        if (!result) {
                            throw new Error('Failed to connect to Redis');
                        }
                        logger.debug(` Cache Store connected successfully.`);
                        return {
                            stores: [store],
                            ttl: ttl,
                        };
                    }
                    catch (error) {
                        logger.error(`❌ Failed to initialize Cache Store: `, error);
                        throw error;
                    }
                },
                isGlobal: true,
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const logger = new common_1.Logger('BullModule');
                    const redisUrl = configService.get('REDIS_URL', 'redis://localhost:6379');
                    try {
                        const url = new URL(redisUrl);
                        logger.debug(`Initializing BullMQ Connection...`);
                        logger.debug(`Configuration -> Host: ${url.hostname}, Port: ${url.port || 6379}`);
                        return {
                            connection: {
                                host: url.hostname,
                                port: Number(url.port) || 6379,
                                username: url.username || undefined,
                                password: url.password || undefined,
                                keepAlive: 10000,
                            },
                        };
                    }
                    catch (error) {
                        logger.error(`❌ Failed to parse Redis URL for BullMQ: `, error);
                        throw error;
                    }
                },
            }),
        ],
        providers: [context_service_1.ContextService, prisma_service_1.PrismaService],
        exports: [context_service_1.ContextService, prisma_service_1.PrismaService],
    })
], ContextModule);
//# sourceMappingURL=context.module.js.map