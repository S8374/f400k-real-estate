import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { PrismaService } from '../../common/context/prisma.service';

@Module({
  controllers: [BankAccountController],
  providers: [BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule {}