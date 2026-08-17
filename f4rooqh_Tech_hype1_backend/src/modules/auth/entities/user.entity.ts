import { Exclude } from 'class-transformer';
import { Role, UserStatus } from '@prisma/client';

export class UserEntity {
  id: string;

  fullName: string | null;

  email: string;

  @Exclude()
  password: string | null;

  role: Role;

  status: UserStatus;

  isVerified: boolean;

  createdAt: Date;

  updatedAt: Date;

  // Optional fields that might be needed
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  nationality?: string | null;
  verifiedAt?: Date | null;
  lastLogin?: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  email: string;
  type: string;
  role: Role;
}

