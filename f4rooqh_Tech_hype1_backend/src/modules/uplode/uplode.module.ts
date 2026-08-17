import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadeService } from './uplode.service';
import { UploadeController } from './uplode.controller';

@Module({
  imports: [ConfigModule],
  providers: [UploadeService],
  controllers: [UploadeController],
})
export class UploadeModule {}