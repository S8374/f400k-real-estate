import { User } from '@prisma/client';
// updated
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
