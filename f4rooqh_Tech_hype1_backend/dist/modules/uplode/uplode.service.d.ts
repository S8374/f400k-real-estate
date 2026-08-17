import { ConfigService } from '@nestjs/config';
export declare class UploadeService {
    private configService;
    private s3;
    private bucket;
    private endpoint;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadFiles(files: Express.Multer.File[]): Promise<string[]>;
    private getPublicUrl;
    private getAlternatePublicUrl;
    testUrlFormats(key: string): Promise<void>;
    checkObjectAccessibility(key: string): Promise<boolean>;
    getSignedUrl(key: string, expiresIn?: number): string;
    deleteFile(key: string): Promise<void>;
    trySetBucketPolicy(): Promise<void>;
}
