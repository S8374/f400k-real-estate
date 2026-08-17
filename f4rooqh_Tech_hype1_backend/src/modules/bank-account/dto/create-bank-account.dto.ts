import {
  IsString,
  IsUUID,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateBankAccountDto {
  @IsUUID()
  propertyId: string;

  @IsUUID()
  userId: string;

  @IsString()
  @Length(1, 255)
  bankName: string;

  @IsString()
  @Length(1, 50)
  accountNumber: string;

  @IsString()
  iban: string;

  @IsString()
  @Length(1, 255)
  accountHolder: string;

  @IsOptional()
  @IsString()
  swiftCode?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  branchAddress?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  additionalInfo?: string;
}