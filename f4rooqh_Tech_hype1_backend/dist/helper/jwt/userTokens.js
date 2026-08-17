"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTokens = void 0;
const jwtHelper_1 = require("./jwtHelper");
const config_index_1 = require("../../config/config.index");
const createUserTokens = (user) => {
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwtHelper_1.generateToken)(jwtPayload, config_index_1.config.jwt.jwt_secret, config_index_1.config.jwt.expires_in);
    const refreshToken = (0, jwtHelper_1.generateToken)(jwtPayload, config_index_1.config.jwt.refresh_token_secret, config_index_1.config.jwt.refresh_token_expires_in);
    return { accessToken, refreshToken };
};
exports.createUserTokens = createUserTokens;
//# sourceMappingURL=userTokens.js.map