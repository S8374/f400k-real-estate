"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadeService = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
let UploadeService = UploadeService_1 = class UploadeService {
    configService;
    s3;
    bucket;
    endpoint;
    logger = new common_1.Logger(UploadeService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.bucket = this.configService.get('RUSTFS_BUCKET') || 'f4rooq';
        const endpoint = this.configService.get('RUSTFS_ENDPOINT');
        if (!endpoint) {
            throw new Error('RUSTFS_ENDPOINT environment variable is not defined');
        }
        this.endpoint = endpoint;
        const accessKeyId = this.configService.get('RUSTFS_ACCESS_KEY');
        const secretAccessKey = this.configService.get('RUSTFS_SECRET_KEY');
        if (!accessKeyId || !secretAccessKey) {
            throw new Error('RUSTFS_ACCESS_KEY or RUSTFS_SECRET_KEY is not defined');
        }
        this.s3 = new aws_sdk_1.S3({
            endpoint: this.endpoint,
            accessKeyId,
            secretAccessKey,
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
        });
        this.logger.log(`S3 client initialized for bucket: ${this.bucket}`);
    }
    async uploadFiles(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadedUrls = [];
        for (const file of files) {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${(0, uuid_1.v4)()}-${Date.now()}.${fileExtension}`;
            const key = `uploads/${fileName}`;
            try {
                const uploadResult = await this.s3
                    .putObject({
                    Bucket: this.bucket,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'public-read',
                })
                    .promise();
                this.logger.log(`Upload successful: ${JSON.stringify(uploadResult)}`);
                const publicUrl = this.getPublicUrl(key);
                this.logger.log(`✅ File uploaded: ${publicUrl}`);
                uploadedUrls.push(publicUrl);
            }
            catch (error) {
                this.logger.error(`Failed to upload file ${file.originalname}: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to upload file: ${error.message}`);
            }
        }
        return uploadedUrls;
    }
    getPublicUrl(key) {
        const cleanEndpoint = this.endpoint.endsWith('/')
            ? this.endpoint.slice(0, -1)
            : this.endpoint;
        return `${cleanEndpoint}/${this.bucket}/${key}`;
    }
    getAlternatePublicUrl(key) {
        const cleanEndpoint = this.endpoint.endsWith('/')
            ? this.endpoint.slice(0, -1)
            : this.endpoint;
        return `${cleanEndpoint}/${key}`;
    }
    async testUrlFormats(key) {
        const formats = [
            this.getPublicUrl(key),
            this.getAlternatePublicUrl(key),
            `${this.endpoint}/${key}`,
            `${this.endpoint}/${this.bucket}/${key}`,
        ];
        this.logger.log('Testing URL formats:');
        for (const url of formats) {
            this.logger.log(`- ${url}`);
        }
    }
    async checkObjectAccessibility(key) {
        try {
            await this.s3.headObject({
                Bucket: this.bucket,
                Key: key
            }).promise();
            return true;
        }
        catch (error) {
            this.logger.error(`Object not accessible: ${error.message}`);
            return false;
        }
    }
    getSignedUrl(key, expiresIn = 3600) {
        return this.s3.getSignedUrl('getObject', {
            Bucket: this.bucket,
            Key: key,
            Expires: expiresIn,
        });
    }
    async deleteFile(key) {
        try {
            await this.s3.deleteObject({
                Bucket: this.bucket,
                Key: key
            }).promise();
            this.logger.log(`✅ File deleted: ${key}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete file ${key}: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to delete file: ${error.message}`);
        }
    }
    async trySetBucketPolicy() {
        try {
            const bucketArn = `arn:aws:s3:::${this.bucket}`;
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: "*",
                        Action: ["s3:GetObject"],
                        Resource: [`${bucketArn}/*`]
                    }
                ]
            };
            await this.s3.putBucketPolicy({
                Bucket: this.bucket,
                Policy: JSON.stringify(policy)
            }).promise();
            this.logger.log(`✅ Bucket policy set successfully`);
        }
        catch (error) {
            this.logger.warn(`⚠️ Could not set bucket policy: ${error.message}`);
            this.logger.warn('This is normal for some S3-compatible services. Objects with public-read ACL should still be accessible.');
        }
    }
};
exports.UploadeService = UploadeService;
exports.UploadeService = UploadeService = UploadeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadeService);
//# sourceMappingURL=uplode.service.js.map