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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadeController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const uplode_service_1 = require("./uplode.service");
let UploadeController = class UploadeController {
    uploadeService;
    constructor(uploadeService) {
        this.uploadeService = uploadeService;
    }
    async uploadImages(files) {
        try {
            const urls = await this.uploadeService.uploadFiles(files);
            return {
                success: true,
                message: 'Files uploaded successfully',
                data: { urls }
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async testUrl(key) {
        if (!key) {
            return { error: 'Please provide a key parameter' };
        }
        await this.uploadeService.testUrlFormats(key);
        return {
            success: true,
            message: 'Check server logs for URL formats',
            urls: {
                standard: this.uploadeService['getPublicUrl'](key),
                alternate: this.uploadeService['getAlternatePublicUrl'](key),
                signed: this.uploadeService.getSignedUrl(key, 3600)
            }
        };
    }
    async setupBucketPolicy() {
        await this.uploadeService.trySetBucketPolicy();
        return {
            success: true,
            message: 'Attempted to set bucket policy (check logs for result)'
        };
    }
};
exports.UploadeController = UploadeController;
__decorate([
    (0, common_1.Post)('images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        limits: {
            fileSize: 200 * 1024 * 1024
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'video/mp4',
                'video/webm',
                'video/ogg',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain'
            ];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Only images & videos allowed'), false);
            }
        }
    })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadeController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Get)('test-url'),
    __param(0, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadeController.prototype, "testUrl", null);
__decorate([
    (0, common_1.Post)('setup-bucket-policy'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UploadeController.prototype, "setupBucketPolicy", null);
exports.UploadeController = UploadeController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [uplode_service_1.UploadeService])
], UploadeController);
//# sourceMappingURL=uplode.controller.js.map