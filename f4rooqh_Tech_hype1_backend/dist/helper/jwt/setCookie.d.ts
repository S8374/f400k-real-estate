import { Response } from 'express';
export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}
export declare const setAuthCookie: (res: Response, tokenInfo: AuthTokens) => void;
export declare const removeAuthCookie: (res: Response) => void;
export declare const setAdminAuthCookie: (res: Response, tokenInfo: AuthTokens) => void;
export declare const removeAdminAuthCookie: (res: Response) => void;
export declare const setResetPassCookie: (res: Response, token: string) => void;
