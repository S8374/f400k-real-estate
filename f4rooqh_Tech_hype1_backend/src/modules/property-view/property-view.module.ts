import { Module } from '@nestjs/common';
import { PropertyViewService } from './property-view.service';
import { PropertyViewController } from './property-view.controller';
import { PrismaService } from '../../common/context/prisma.service';

@Module({
  controllers: [PropertyViewController],
  providers: [PropertyViewService],
  exports: [PropertyViewService],
})
export class PropertyViewModule {}