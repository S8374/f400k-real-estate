import { Module } from '@nestjs/common';

import { PrismaService } from '../../common/context/prisma.service'; // Assuming path based on existing code
import { ZoneController } from './zone.controller';
import { ZoneService } from './zone.service';

@Module({
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [ZoneService]
})
export class ZoneModule {}
