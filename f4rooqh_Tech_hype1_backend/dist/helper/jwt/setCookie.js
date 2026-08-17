"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setResetPassCookie = exports.removeAdminAuthCookie = exports.setAdminAuthCookie = exports.removeAuthCookie = exports.setAuthCookie = void 0;
const setAuthCookie = (res, tokenInfo) => {
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
exports.setAuthCookie = setAuthCookie;
const removeAuthCookie = (res) => {
    const domain = process.env.NODE_ENV === 'production' ? '.sakruya.com' : undefined;
    const options = { path: '/', ...(domain && { domain }), secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' };
    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);
};
exports.removeAuthCookie = removeAuthCookie;
const setAdminAuthCookie = (res, tokenInfo) => {
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
exports.setAdminAuthCookie = setAdminAuthCookie;
const removeAdminAuthCookie = (res) => {
    const domain = process.env.NODE_ENV === 'production' ? '.sakruya.com' : undefined;
    const options = { path: '/', ...(domain && { domain }), secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' };
    res.clearCookie('adminAccessToken', options);
    res.clearCookie('adminRefreshToken', options);
};
exports.removeAdminAuthCookie = removeAdminAuthCookie;
const setResetPassCookie = (res, token) => {
    res.cookie('exchangeToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    });
};
exports.setResetPassCookie = setResetPassCookie;
//# sourceMappingURL=setCookie.js.map