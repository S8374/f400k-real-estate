import { Response } from 'express';

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  const domain = process.env.NODE_ENV === 'production' ? '.sakruya.com' : undefined;

  if (tokenInfo.accessToken) {
    res.cookie('accessToken', tokenInfo.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      ...(domain && { domain }),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',

    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie('refreshToken', tokenInfo.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      ...(domain && { domain }),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',

    });
  }
};

export const removeAuthCookie = (res: Response) => {
  const domain = process.env.NODE_ENV === 'production' ? '.sakruya.com' : undefined;
  const options: any = { path: '/', ...(domain && { domain }), secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' as const };
  res.clearCookie('accessToken', options);
  res.clearCookie('refreshToken', options);
};

export const setAdminAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  const domain = process.env.NODE_ENV === 'production' ? '.sakruya.com' : undefined;

  if (tokenInfo.accessToken) {
    res.cookie('adminAccessToken', tokenInfo.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      ...(domain && { domain }),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie('adminRefreshToken', tokenInfo.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      ...(domain && { domain }),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
};

export const removeAdminAuthCookie = (res: Response) => {
  const domain = process.env.NODE_ENV === 'production' ? '.sakruya.com' : undefined;
  const options: any = { path: '/', ...(domain && { domain }), secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' as const };
  res.clearCookie('adminAccessToken', options);
  res.clearCookie('adminRefreshToken', options);
};

export const setResetPassCookie = (res: Response, token: string) => {
  res.cookie('exchangeToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
};
