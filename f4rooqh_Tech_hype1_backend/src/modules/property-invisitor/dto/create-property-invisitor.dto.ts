import {
  IsString,
  IsUUID,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  Length,
  IsEnum,
} from 'class-validator';

export enum IdType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  RESIDENT_ID = 'RESIDENT_ID',
  OTHER = 'OTHER'
}

export enum Relationship {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  FAMILY_MEMBER = 'FAMILY_MEMBER',
  FRIEND = 'FRIEND',
  COLLEAGUE = 'COLLEAGUE',
  LEGAL_REPRESENTATIVE = 'LEGAL_REPRESENTATIVE',
  OTHER = 'OTHER'
}

export class CreatePropertyInvisitorDto {
  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(Relationship)
  relationship?: Relationship;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  idNumber?: string;

  @IsOptional()
  @IsEnum(IdType)
  idType?: IdType;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  additionalInfo?: string;
}