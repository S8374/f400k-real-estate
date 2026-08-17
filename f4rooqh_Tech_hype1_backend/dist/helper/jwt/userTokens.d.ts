import { User } from '@prisma/client';
export declare const createUserTokens: (user: Partial<User>) => {
    accessToken: any;
    refreshToken: any;
};
