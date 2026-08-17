import { Controller, Post, Get, UseInterceptors, UploadedFiles, HttpCode, HttpStatus, Query, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadeService } from './uplode.service';

@Controller('upload')
export class UploadeController {
  constructor(private readonly uploadeService: UploadeService) { }

  @Post('images')
  // @UseInterceptors(FilesInterceptor('files', 10))
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: {
    fileSize: 200 * 1024 * 1024 // 200MB
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
      } else {
        cb(new BadRequestException('Only images & videos allowed'), false);
      }
    }
  }))
  @HttpCode(HttpStatus.CREATED)
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      const urls = await this.uploadeService.uploadFiles(files);
      return {
        success: true,
        message: 'Files uploaded successfully',
        data: { urls }
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('test-url')
  async testUrl(@Query('key') key: string) {
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

  @Post('setup-bucket-policy')
  @HttpCode(HttpStatus.OK)
  async setupBucketPolicy() {
    await this.uploadeService.trySetBucketPolicy();
    return {
      success: true,
      message: 'Attempted to set bucket policy (check logs for result)'
    };
  }
}