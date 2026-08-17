import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { VerifyAgentDto, VerifyPropertyDto } from './create-verified.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class CombinedVerifyDto extends IntersectionType(
  VerifyAgentDto,
  VerifyPropertyDto,
) {}

export class UpdateVerifiedDto extends PartialType(CombinedVerifyDto) {
  @IsUUID()
  @IsOptional()
  id?: string;
}