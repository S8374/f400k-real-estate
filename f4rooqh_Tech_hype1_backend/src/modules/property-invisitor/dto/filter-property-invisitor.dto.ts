import { IsOptional, IsUUID, IsString, IsEmail, IsPhoneNumber, IsEnum, IsInt, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Relationship, IdType } from './create-property-invisitor.dto';

export class FilterPropertyInvisitorDto {
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  name?: string;

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
  @IsEnum(IdType)
  idType?: IdType;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasIdDocument?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRegistered?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}