import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { PrismaService } from './common/context/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role, UserStatus } from '@prisma/client';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPass = this.configService.get<string>('ADMIN_PASS');

    if (!adminEmail || !adminPass) {
      this.logger.warn('ADMIN_EMAIL or ADMIN_PASS is not set in environment variables. Admin seeder skipped.');
      return;
    }

    try {
      const existingAdmin = await this.prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPass, 10);
        
        await this.prisma.user.create({
          data: {
            email: adminEmail,
            password: hashedPassword,
            fullName: 'System Admin',
            role: Role.ADMIN,
            status: UserStatus.ACTIVE,
            isVerified: true,
            verifiedAt: new Date(),
          },
        });
        this.logger.log(`Admin user created with email: ${adminEmail}`);
      } else {
        // Upgrade existing user to admin if they are not already
        if (existingAdmin.role !== Role.ADMIN) {
          await this.prisma.user.update({
            where: { email: adminEmail },
            data: { role: Role.ADMIN, status: UserStatus.ACTIVE, isVerified: true },
          });
          this.logger.log(`Existing user ${adminEmail} upgraded to ADMIN role.`);
        } else {
          this.logger.log('Admin user already exists and has correct role.');
        }
      }
    } catch (error) {
      this.logger.error('Failed to seed admin user', error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  postTest() {
    return 'Hello World!';
  }
}
