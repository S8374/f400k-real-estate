import { PartialType } from '@nestjs/mapped-types';
import { IsUUID, IsOptional } from 'class-validator';
import { CreatePropertyInvisitorDto } from './create-property-invisitor.dto';

export class UpdatePropertyInvisitorDto extends PartialType(CreatePropertyInvisitorDto) {
  @IsUUID()
  @IsOptional()
  id?: string;
}