import { IsUUID } from 'class-validator';

export class CreateSavedListingDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  propertyId: string;
}