import { generateToken } from './jwtHelper';
import { config } from '../../config/config.index';
import { User } from '@prisma/client';

export const createUserTokens = (user: Partial<User>) => {
  const jwtPayload = {
    userId: user.id,   // ✅ consistent key used everywhere
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt.jwt_secret,
    config.jwt.expires_in,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt.refresh_token_secret,
    config.jwt.refresh_token_expires_in,
  );

  return { accessToken, refreshToken };
};