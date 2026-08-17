import { Module } from '@nestjs/common';
import { PropertyInvisitorService } from './property-invisitor.service';
import { PropertyInvisitorController } from './property-invisitor.controller';
import { PrismaService } from '../../common/context/prisma.service';

@Module({
  controllers: [PropertyInvisitorController],
  providers: [PropertyInvisitorService],
  exports: [PropertyInvisitorService],
})
export class PropertyInvisitorModule {}