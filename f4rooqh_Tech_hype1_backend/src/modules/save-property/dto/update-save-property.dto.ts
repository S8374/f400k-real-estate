import { IsUUID } from 'class-validator';

export class UnsavePropertyDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  propertyId: string;
}