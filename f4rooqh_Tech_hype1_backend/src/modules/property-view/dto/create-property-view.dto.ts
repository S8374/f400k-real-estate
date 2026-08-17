import { IsUUID, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export enum ViewSource {
  WEBSITE = 'WEBSITE',
  MOBILE_APP = 'MOBILE_APP',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  DIRECT_LINK = 'DIRECT_LINK',
  SEARCH_ENGINE = 'SEARCH_ENGINE',
  REFERRAL = 'REFERRAL',
  ADMIN_PANEL = 'ADMIN_PANEL',
  OTHER = 'OTHER'
}

export class CreatePropertyViewDto {
  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(ViewSource)
  source?: ViewSource;

  @IsOptional()
  @IsDateString()
  viewedAt?: string;
}

export class BulkCreatePropertyViewDto {
  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(ViewSource)
  source?: ViewSource;

  @IsOptional()
  @IsDateString()
  viewedAt?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}