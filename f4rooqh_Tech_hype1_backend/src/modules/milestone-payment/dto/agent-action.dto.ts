import { IsUUID, IsString, IsOptional, IsUrl, IsArray } from 'class-validator';
import { MilestonePaymentStatus } from '@prisma/client';

export class AgentUploadDto {
  @IsUUID()
  paymentId: string;

  @IsUUID()
  agentId: string;

  @IsArray()
  @IsUrl({}, { each: true })
  agentDocumentUrls: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AgentReviewDto {
  @IsUUID()
  paymentId: string;

  @IsUUID()
  agentId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  status: MilestonePaymentStatus;
}