import { Module } from '@nestjs/common';
import { VerifiedService } from './verified.service';
import { VerifiedController } from './verified.controller';
import { ConfigModule } from '@nestjs/config'; // <-- Import ConfigModule

@Module({
  imports: [ConfigModule], // <-- Add this
  controllers: [VerifiedController],
  providers: [VerifiedService],
})
export class VerifiedModule {}