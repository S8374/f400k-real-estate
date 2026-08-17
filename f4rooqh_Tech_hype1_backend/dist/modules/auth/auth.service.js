"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const jwtHelper_1 = require("../../helper/jwt/jwtHelper");
const config_index_1 = require("../../config/config.index");
const setCookie_1 = require("../../helper/jwt/setCookie");
const mail_service_1 = require("../../mail/mail.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const user_entity_1 = require("./entities/user.entity");
const crypto = __importStar(require("crypto"));
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    mailService;
    cacheManager;
    constructor(prisma, mailService, cacheManager) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.cacheManager = cacheManager;
    }
    async register(dto) {
        const { fullName, email, password, role = client_1.Role.BUYER, nationality, avatarUrl, licenseNumber, agencyName, investmentField, investmentBudgetMin, investmentBudgetMax, termsAndCondition, } = dto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            if (existingUser.isVerified) {
                throw new common_1.BadRequestException('User already exists');
            }
            throw new common_1.BadRequestException('User already exists. Please login or verify your account.');
        }
        if (!termsAndCondition) {
            throw new common_1.BadRequestException('You must accept the terms and conditions');
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    fullName,
                    email,
                    password: hashPassword,
                    nationality,
                    avatarUrl,
                    role,
                    status: client_1.UserStatus.PENDING_VERIFICATION,
                    isVerified: false,
                },
            });
            if (role === client_1.Role.AGENT) {
                await tx.agentProfile.create({
                    data: {
                        userId: newUser.id,
                        licenseId: licenseNumber?.toString(),
                        agencyName: agencyName || null,
                        trustScore: 0,
                    },
                });
            }
            else if (role === client_1.Role.BUYER) {
                await tx.buyerProfile.create({
                    data: {
                        userId: newUser.id,
                        investmentField: investmentField || null,
                        investmentBudgetMin: investmentBudgetMin || null,
                        investmentBudgetMax: investmentBudgetMax || null,
                        kycStatus: client_1.KycStatus.PENDING,
                        preferredPropertyTypes: [],
                    },
                });
            }
            return newUser;
        });
        await this.sendOtp(user.email, user.fullName || 'User', 'register_otp');
        return new user_entity_1.UserEntity(user);
    }
    async verifyOtp(dto, res) {
        const { email, otp } = dto;
        const cacheKey = `register_otp:${email}`;
        await this.validateOtp(cacheKey, otp);
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                status: client_1.UserStatus.ACTIVE,
                isVerified: true,
                verifiedAt: new Date(),
            },
        });
        await this.cacheManager.del(cacheKey);
        const payload = { userId: updatedUser.id, role: updatedUser.role };
        const accessToken = (0, jwtHelper_1.generateToken)(payload, config_index_1.config.jwt.jwt_secret, config_index_1.config.jwt.expires_in);
        const refreshToken = (0, jwtHelper_1.generateToken)(payload, config_index_1.config.jwt.refresh_token_secret, config_index_1.config.jwt.refresh_token_expires_in);
        const tokenInfo = { accessToken, refreshToken };
        (0, setCookie_1.setAuthCookie)(res, tokenInfo);
        return {
            message: 'Account verified successfully.',
            accessToken,
            user: new user_entity_1.UserEntity(updatedUser),
        };
    }
    async resendOtp(dto) {
        const { email } = dto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('User not found.');
        if (user.isVerified) {
            throw new common_1.BadRequestException('Account is already verified.');
        }
        await this.sendOtp(user.email, user.fullName || 'User', 'register_otp');
        return { message: 'OTP sent successfully.' };
    }
    async forgotPassword(dto) {
        const { email } = dto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('User not found.');
        await this.sendOtp(user.email, user.fullName || 'User', 'reset_otp');
        return {
            message: 'If an account exists, an OTP has been sent to your email.',
        };
    }
    async verifyResetOtp(dto, res) {
        const { email, otp } = dto;
        const cacheKey = `reset_otp:${email}`;
        await this.validateOtp(cacheKey, otp);
        await this.cacheManager.del(cacheKey);
        const exchangePayload = { email, type: 'password_exchange' };
        const exchangeToken = (0, jwtHelper_1.generateToken)(exchangePayload, config_index_1.config.jwt.reset_pass_secret, '5m');
        (0, setCookie_1.setResetPassCookie)(res, exchangeToken);
        return {
            message: 'OTP verified. Use this token to reset your password.',
            exchangeToken,
        };
    }
    async resetPassword(dto, req, res) {
        const { newPassword } = dto;
        const exchangeToken = dto.exchangeToken || req.cookies?.['exchangeToken'];
        if (!exchangeToken) {
            throw new common_1.UnauthorizedException('You are not authorized to reset your password.');
        }
        let decoded;
        try {
            decoded = (0, jwtHelper_1.verifyToken)(exchangeToken, config_index_1.config.jwt.reset_pass_secret);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired exchange token.');
        }
        if (decoded.type !== 'password_exchange' || !decoded.email) {
            throw new common_1.UnauthorizedException('Invalid token type.');
        }
        const user = await this.prisma.user.findUnique({
            where: { email: decoded.email },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found.');
        const hashPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashPassword },
        });
        res.clearCookie('exchangeToken');
        return { message: 'Password has been reset successfully. Please login.' };
    }
    async login(dto, res) {
        const { email, password } = dto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.BadRequestException('Invalid credentials');
        if (!user.isVerified || user.status === client_1.UserStatus.PENDING_VERIFICATION) {
            throw new common_1.UnauthorizedException('Account not verified. Please verify your email.');
        }
        if (user.status === client_1.UserStatus.BANNED ||
            user.status === client_1.UserStatus.DELETED ||
            user.status === client_1.UserStatus.INACTIVE) {
            throw new common_1.UnauthorizedException('Account is not active.');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Account has no password set. Please use social login or reset your password.');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new common_1.BadRequestException('Invalid credentials');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const payload = { userId: user.id, role: user.role };
        const accessToken = (0, jwtHelper_1.generateToken)(payload, config_index_1.config.jwt.jwt_secret, config_index_1.config.jwt.expires_in);
        const refreshToken = (0, jwtHelper_1.generateToken)(payload, config_index_1.config.jwt.refresh_token_secret, config_index_1.config.jwt.refresh_token_expires_in);
        const tokenInfo = { accessToken, refreshToken };
        (0, setCookie_1.setAuthCookie)(res, tokenInfo);
        return {
            accessToken,
            refreshToken,
            user: new user_entity_1.UserEntity(user),
        };
    }
    async adminLogin(dto, res) {
        const { email, password } = dto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.BadRequestException('Invalid credentials');
        if (user.role !== client_1.Role.ADMIN) {
            throw new common_1.UnauthorizedException('Access restricted to administrators only.');
        }
        if (!user.isVerified || user.status === client_1.UserStatus.PENDING_VERIFICATION) {
            throw new common_1.UnauthorizedException('Account not verified. Please verify your email.');
        }
        if (user.status === client_1.UserStatus.BANNED ||
            user.status === client_1.UserStatus.DELETED ||
            user.status === client_1.UserStatus.INACTIVE) {
            throw new common_1.UnauthorizedException('Account is not active.');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Account has no password set. Please use social login or reset your password.');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new common_1.BadRequestException('Invalid credentials');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const payload = { userId: user.id, role: user.role };
        const accessToken = (0, jwtHelper_1.generateToken)(payload, config_index_1.config.jwt.jwt_secret, config_index_1.config.jwt.expires_in);
        const refreshToken = (0, jwtHelper_1.generateToken)(payload, config_index_1.config.jwt.refresh_token_secret, config_index_1.config.jwt.refresh_token_expires_in);
        const tokenInfo = { accessToken, refreshToken };
        (0, setCookie_1.setAdminAuthCookie)(res, tokenInfo);
        return {
            accessToken,
            refreshToken,
            user: new user_entity_1.UserEntity(user),
        };
    }
    logout(res) {
        const domain = process.env.NODE_ENV === 'production' ? '.sakruya.com' : undefined;
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            ...(domain && { domain }),
        };
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
        res.clearCookie('adminAccessToken', cookieOptions);
        res.clearCookie('adminRefreshToken', cookieOptions);
        return { message: 'Logout successful.' };
    }
    async changePassword(dto) {
        const { email, oldPassword, newPassword } = dto;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('User not found.');
        if (!user.password) {
            throw new common_1.BadRequestException('Account has no password set. Please use social login or reset your password.');
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
            throw new common_1.BadRequestException('Invalid old password.');
        const hashPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashPassword },
        });
        return new user_entity_1.UserEntity(updatedUser);
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                fullName: dto.fullName,
                phoneNumber: dto.phoneNumber,
                avatarUrl: dto.avatarUrl,
                nationality: dto.nationality,
            },
        });
        if (user.role === 'AGENT') {
            await this.prisma.agentProfile.update({
                where: { userId },
                data: {
                    agencyName: dto.agencyName,
                    bio: dto.bio,
                    yearsExperience: dto.yearsExperience,
                },
            });
        }
        if (user.role === 'BUYER') {
            await this.prisma.buyerProfile.update({
                where: { userId },
                data: {
                    investmentBudgetMin: dto.investmentBudgetMin,
                    investmentBudgetMax: dto.investmentBudgetMax,
                    investmentField: dto.investmentField,
                    preferredPropertyTypes: dto.preferredPropertyTypes,
                },
            });
        }
        return { message: 'Profile updated successfully' };
    }
    async sendOtp(email, name, prefix) {
        const otp = crypto.randomInt(100000, 999999).toString();
        const ttl = 5 * 60 * 1000;
        const hashedOtp = await bcrypt.hash(otp, 10);
        const payload = {
            email,
            otp: hashedOtp,
            maxAttempts: 3,
            attempts: 0,
        };
        await this.cacheManager.set(`${prefix}:${email}`, payload, ttl);
        await this.mailService.sendUserOtp({ email, name }, otp);
    }
    async validateOtp(key, inputOtp) {
        const payload = await this.cacheManager.get(key);
        if (!payload) {
            throw new common_1.BadRequestException('OTP has expired or is invalid.');
        }
        if (payload.attempts >= payload.maxAttempts) {
            await this.cacheManager.del(key);
            throw new common_1.BadRequestException('Too many failed attempts. Please request a new OTP.');
        }
        const isMatch = await bcrypt.compare(inputOtp, payload.otp);
        if (!isMatch) {
            payload.attempts += 1;
            const ttl = await this.cacheManager.ttl(key);
            await this.cacheManager.set(key, payload, ttl);
            throw new common_1.BadRequestException(`Invalid OTP. Attempts remaining: ${payload.maxAttempts - payload.attempts}`);
        }
        return payload;
    }
    async getCurrentUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                agentProfile: {
                    include: {
                        properties: {
                            take: 5,
                            orderBy: { createdAt: 'desc' },
                            include: {
                                media: {
                                    where: { isPrimary: true },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
                buyerProfile: true,
                kycDocuments: {
                    orderBy: { uploadedAt: 'desc' },
                },
                savedListings: {
                    take: 5,
                    orderBy: { savedAt: 'desc' },
                    include: {
                        property: {
                            include: {
                                media: {
                                    where: { isPrimary: true },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
                propertyViews: {
                    take: 10,
                    orderBy: { viewedAt: 'desc' },
                    include: {
                        property: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                            },
                        },
                    },
                },
                sentMessages: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
                conversations: {
                    take: 5,
                    orderBy: { updatedAt: 'desc' },
                    include: {
                        participants: {
                            select: {
                                id: true,
                                fullName: true,
                                avatarUrl: true,
                                isOnline: true,
                            },
                        },
                        messages: {
                            take: 1,
                            orderBy: { createdAt: 'desc' },
                        },
                    },
                },
                bankAccounts: true,
                propertyInvisitors: {
                    include: {
                        property: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                buyerPayments: {
                    take: 5,
                    orderBy: { paidAt: 'desc' },
                    include: {
                        milestone: {
                            include: {
                                plan: {
                                    include: {
                                        property: {
                                            select: {
                                                id: true,
                                                title: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                buyerAcceptances: {
                    include: {
                        property: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                        paymentPlan: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        savedListings: true,
                        propertyViews: true,
                        sentMessages: true,
                        conversations: true,
                        buyerPayments: true,
                        buyerAcceptances: true,
                        kycDocuments: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        cache_manager_1.Cache])
], AuthService);
//# sourceMappingURL=auth.service.js.map