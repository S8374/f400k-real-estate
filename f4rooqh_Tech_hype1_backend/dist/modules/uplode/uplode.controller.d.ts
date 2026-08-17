import { UploadeService } from './uplode.service';
export declare class UploadeController {
    private readonly uploadeService;
    constructor(uploadeService: UploadeService);
    uploadImages(files: Express.Multer.File[]): Promise<{
        success: boolean;
        message: string;
        data: {
            urls: string[];
        };
    }>;
    testUrl(key: string): Promise<{
        error: string;
        success?: undefined;
        message?: undefined;
        urls?: undefined;
    } | {
        success: boolean;
        message: string;
        urls: {
            standard: string;
            alternate: string;
            signed: string;
        };
        error?: undefined;
    }>;
    setupBucketPolicy(): Promise<{
        success: boolean;
        message: string;
    }>;
}
