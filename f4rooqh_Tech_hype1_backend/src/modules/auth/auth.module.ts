import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { MailModule } from '../../mail/mail.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot(), // Add this to make ConfigService available
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,      // Provide AuthGuard
    RolesGuard,     // Provide RolesGuard if needed
  ],
  exports: [
    AuthGuard,      // Export if needed in other modules
    RolesGuard,     // Export if needed in other modules
  ],
})
export class AuthModule {}