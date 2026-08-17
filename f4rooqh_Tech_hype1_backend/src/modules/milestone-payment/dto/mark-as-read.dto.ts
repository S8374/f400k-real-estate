import { IsUUID, IsEnum } from 'class-validator';

export enum UserRole {
  BUYER = 'BUYER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}

export class MarkAsReadDto {
  @IsUUID()
  paymentId: string;

  @IsUUID()
  userId: string;

  @IsEnum(UserRole)
  userRole: UserRole;
}