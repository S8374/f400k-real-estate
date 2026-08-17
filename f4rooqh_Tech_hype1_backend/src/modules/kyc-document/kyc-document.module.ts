import { Module } from '@nestjs/common';
import { KycDocumentService } from './kyc-document.service';
import { KycDocumentController } from './kyc-document.controller';
import { PrismaService } from '../../common/context/prisma.service';

@Module({
  controllers: [KycDocumentController],
  providers: [KycDocumentService],
  exports: [KycDocumentService],
})
export class KycDocumentModule {}