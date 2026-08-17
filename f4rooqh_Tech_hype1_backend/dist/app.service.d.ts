import { OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from './common/context/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AppService implements OnApplicationBootstrap {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    onApplicationBootstrap(): Promise<void>;
    private seedAdminUser;
    getHello(): string;
    postTest(): string;
}
