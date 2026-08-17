import { PartialType } from '@nestjs/mapped-types';
import { IsUUID, IsOptional } from 'class-validator';
import { CreateBankAccountDto } from './create-bank-account.dto';

export class UpdateBankAccountDto extends PartialType(CreateBankAccountDto) {
  @IsUUID()
  @IsOptional()
  id?: string;
}