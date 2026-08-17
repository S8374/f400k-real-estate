import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadeService {
  private s3: S3;
  private bucket: string;
  private endpoint: string;
  private readonly logger = new Logger(UploadeService.name);

  constructor(private configService: ConfigService) {
    // Get config values with proper error handling
    this.bucket = this.configService.get<string>('RUSTFS_BUCKET') || 'f4rooq';
    
    const endpoint = this.configService.get<string>('RUSTFS_ENDPOINT');
    if (!endpoint) {
      throw new Error('RUSTFS_ENDPOINT environment variable is not defined');
    }
    this.endpoint = endpoint;
    
    const accessKeyId = this.configService.get<string>('RUSTFS_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('RUSTFS_SECRET_KEY');
    
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('RUSTFS_ACCESS_KEY or RUSTFS_SECRET_KEY is not defined');
    }
    
    this.s3 = new S3({
      endpoint: this.endpoint,
      accessKeyId,
      secretAccessKey,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
    
    // Don't set bucket policy automatically - it might fail
    this.logger.log(`S3 client initialized for bucket: ${this.bucket}`);
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Generate unique filename
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}-${Date.now()}.${fileExtension}`;
      const key = `uploads/${fileName}`; // Organized in uploads folder

      try {
        // Upload with public-read ACL
        const uploadResult = await this.s3
          .putObject({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read', // This makes the object publicly readable
          })
          .promise();

        this.logger.log(`Upload successful: ${JSON.stringify(uploadResult)}`);

        // Construct public URL
        const publicUrl = this.getPublicUrl(key);
        
        this.logger.log(`✅ File uploaded: ${publicUrl}`);
        uploadedUrls.push(publicUrl);
        
      } catch (error) {
        this.logger.error(`Failed to upload file ${file.originalname}: ${error.message}`);
        throw new BadRequestException(`Failed to upload file: ${error.message}`);
      }
    }

    return uploadedUrls;
  }

  private getPublicUrl(key: string): string {
    // Remove trailing slash from endpoint if present
    const cleanEndpoint = this.endpoint.endsWith('/') 
      ? this.endpoint.slice(0, -1) 
      : this.endpoint;
    
    // For path-style URL: https://endpoint/bucket/key
    // This is the standard format for most S3-compatible storage
    return `${cleanEndpoint}/${this.bucket}/${key}`;
  }

  // Alternative URL format if the above doesn't work
  private getAlternatePublicUrl(key: string): string {
    const cleanEndpoint = this.endpoint.endsWith('/') 
      ? this.endpoint.slice(0, -1) 
      : this.endpoint;
    
    // Try without bucket in path
    return `${cleanEndpoint}/${key}`;
  }

  // Test which URL format works
  async testUrlFormats(key: string): Promise<void> {
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

  // Method to check if an object exists and is accessible
  async checkObjectAccessibility(key: string): Promise<boolean> {
    try {
      await this.s3.headObject({
        Bucket: this.bucket,
        Key: key
      }).promise();
      return true;
    } catch (error) {
      this.logger.error(`Object not accessible: ${error.message}`);
      return false;
    }
  }

  // Method to generate a signed URL for temporary access (fallback if public doesn't work)
  getSignedUrl(key: string, expiresIn: number = 3600): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn,
    });
  }

  // Method to delete a file
  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3.deleteObject({
        Bucket: this.bucket,
        Key: key
      }).promise();
      
      this.logger.log(`✅ File deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file ${key}: ${error.message}`);
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  // Optional: Try to set bucket policy but don't fail if it doesn't work
  async trySetBucketPolicy(): Promise<void> {
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
    } catch (error) {
      this.logger.warn(`⚠️ Could not set bucket policy: ${error.message}`);
      this.logger.warn('This is normal for some S3-compatible services. Objects with public-read ACL should still be accessible.');
    }
  }
}