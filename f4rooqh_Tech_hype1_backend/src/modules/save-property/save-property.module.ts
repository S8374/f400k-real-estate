import { Module } from '@nestjs/common';

import { PrismaService } from '../../common/context/prisma.service';
import { SavedListingController } from './save-property.controller';
import { SavedListingService } from './save-property.service';

@Module({
  controllers: [SavedListingController],
  providers: [SavedListingService],
  exports: [SavedListingService],
})
export class SavedListingModule {}