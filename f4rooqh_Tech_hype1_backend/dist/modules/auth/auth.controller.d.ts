import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { LogInAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserProfileDto } from './dto/UpdateUserProfileDto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterAuthDto): Promise<import("./entities/user.entity").UserEntity>;
    verifyOtp(verifyOtpDto: VerifyOtpDto, res: Response): Promise<{
        message: string;
        accessToken: any;
        user: import("./entities/user.entity").UserEntity;
    }>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        message: string;
    }>;
    login(loginDto: LogInAuthDto, res: Response): Promise<{
        accessToken: any;
        refreshToken: any;
        user: import("./entities/user.entity").UserEntity;
    }>;
    adminLogin(loginDto: LogInAuthDto, res: Response): Promise<{
        accessToken: any;
        refreshToken: any;
        user: import("./entities/user.entity").UserEntity;
    }>;
    logout(res: Response): {
        message: string;
    };
    changePassword(changePasswordDto: ChangePasswordDto): Promise<import("./entities/user.entity").UserEntity>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    verifyResetOtp(verifyOtpDto: VerifyOtpDto, res: Response): Promise<{
        message: string;
        exchangeToken: any;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto, req: Request, res: Response): Promise<{
        message: string;
    }>;
    getCurrentUser(user: any): Promise<{
        agentProfile: ({
            properties: ({
                media: {
                    id: string;
                    url: string;
                    type: import("@prisma/client").$Enums.MediaType;
                    isPrimary: boolean;
                    uploadedAt: Date;
                    title: string | null;
                    description: string | null;
                    propertyId: string | null;
                    sortOrder: number;
                    unitId: string | null;
                }[];
            } & {
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.ProjectType;
                isRegaVerified: boolean | null;
                listingAgentId: string;
                listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
                developerId: string | null;
                zoneId: string | null;
                images: string[];
                totalUnits: number | null;
                availableUnits: number | null;
                latitude: number | null;
                longitude: number | null;
                addressLine: string | null;
                mapEmbedUrl: string | null;
                location: string | null;
                title: string;
                description: string | null;
                price: number;
                currency: string;
                areaSqm: number | null;
                areaSqFt: number | null;
                bedrooms: number | null;
                bathrooms: number | null;
                balconies: number | null;
                floorNumber: number | null;
                yearBuilt: number | null;
                parkingSlots: number | null;
                furnished: boolean | null;
                isBooked: boolean | null;
                sakNumber: string | null;
                roiProjectionPercent: number | null;
                estimatedRentalIncome: number | null;
                estimatedRentalCurrency: string | null;
                valueApproximate: number | null;
                valueApproximateCurrency: string | null;
                views: number;
                featuredUntil: Date | null;
            })[];
        } & {
            verifiedAt: Date | null;
            agencyName: string | null;
            bio: string | null;
            yearsExperience: number | null;
            userId: string;
            licenseId: string | null;
            isRegaVerified: boolean;
            isNafathVerified: boolean;
            trustScore: number;
        }) | null;
        buyerProfile: {
            investmentField: string | null;
            investmentBudgetMin: number | null;
            investmentBudgetMax: number | null;
            preferredPropertyTypes: string[];
            userId: string;
            isNafathVerified: boolean;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
        } | null;
        kycDocuments: {
            id: string;
            verifiedAt: Date | null;
            userId: string;
            uploadedAt: Date;
            rejectionReason: string | null;
            documentType: string;
            fileUrl: string;
            verificationStatus: import("@prisma/client").$Enums.KycStatus;
        }[];
        sentMessages: {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            content: string | null;
            attachmentUrl: string | null;
            attachmentType: string | null;
            readAt: Date | null;
        }[];
        conversations: ({
            participants: {
                id: string;
                fullName: string | null;
                avatarUrl: string | null;
                isOnline: boolean;
            }[];
            messages: {
                id: string;
                createdAt: Date;
                conversationId: string;
                senderId: string;
                content: string | null;
                attachmentUrl: string | null;
                attachmentType: string | null;
                readAt: Date | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            propertyId: string | null;
        })[];
        savedListings: ({
            property: {
                media: {
                    id: string;
                    url: string;
                    type: import("@prisma/client").$Enums.MediaType;
                    isPrimary: boolean;
                    uploadedAt: Date;
                    title: string | null;
                    description: string | null;
                    propertyId: string | null;
                    sortOrder: number;
                    unitId: string | null;
                }[];
            } & {
                id: string;
                status: import("@prisma/client").$Enums.PropertyStatus;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.ProjectType;
                isRegaVerified: boolean | null;
                listingAgentId: string;
                listingPurpose: import("@prisma/client").$Enums.ListingPurpose;
                developerId: string | null;
                zoneId: string | null;
                images: string[];
                totalUnits: number | null;
                availableUnits: number | null;
                latitude: number | null;
                longitude: number | null;
                addressLine: string | null;
                mapEmbedUrl: string | null;
                location: string | null;
                title: string;
                description: string | null;
                price: number;
                currency: string;
                areaSqm: number | null;
                areaSqFt: number | null;
                bedrooms: number | null;
                bathrooms: number | null;
                balconies: number | null;
                floorNumber: number | null;
                yearBuilt: number | null;
                parkingSlots: number | null;
                furnished: boolean | null;
                isBooked: boolean | null;
                sakNumber: string | null;
                roiProjectionPercent: number | null;
                estimatedRentalIncome: number | null;
                estimatedRentalCurrency: string | null;
                valueApproximate: number | null;
                valueApproximateCurrency: string | null;
                views: number;
                featuredUntil: Date | null;
            };
        } & {
            userId: string;
            savedAt: Date;
            propertyId: string;
        })[];
        propertyViews: ({
            property: {
                id: string;
                title: string;
                price: number;
            };
        } & {
            id: string;
            userId: string | null;
            viewedAt: Date;
            propertyId: string;
            source: string | null;
        })[];
        bankAccounts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            propertyId: string;
            additionalInfo: string | null;
            bankName: string;
            accountNumber: string;
            iban: string;
            accountHolder: string;
            swiftCode: string | null;
            branchAddress: string | null;
        }[];
        buyerPayments: ({
            milestone: {
                plan: {
                    property: {
                        id: string;
                        title: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    name: string;
                    description: string | null;
                    propertyId: string;
                    totalInstallments: number | null;
                    createdById: string | null;
                };
            } & {
                id: string;
                description: string;
                milestoneOrder: number;
                planId: string;
                tittle: string | null;
                amount: number | null;
                dueDate: Date | null;
                constructionProgress: number | null;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.MilestonePaymentStatus;
            createdAt: Date;
            verifiedAt: Date | null;
            paidAt: Date;
            adminId: string | null;
            buyerId: string;
            milestoneId: string;
            agentId: string | null;
            amountPaid: number;
            proofUrls: string[];
            agentReviewedAt: Date | null;
            rejectedAt: Date | null;
            rejectionReason: string | null;
            notes: string | null;
            isReadByBuyer: boolean;
            isReadByAgent: boolean;
            isReadByAdmin: boolean;
            agentDocumentUrls: string[];
            agentDocumentNote: string | null;
            agentUploadedAt: Date | null;
        })[];
        buyerAcceptances: ({
            property: {
                id: string;
                title: string;
            };
            paymentPlan: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            propertyId: string;
            buyerId: string;
            paymentPlanId: string;
            acceptedAt: Date;
            acceptedById: string | null;
        })[];
        propertyInvisitors: ({
            property: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            email: string | null;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string | null;
            propertyId: string;
            relationship: string | null;
            idNumber: string | null;
            idType: string | null;
            additionalInfo: string | null;
        })[];
        _count: {
            kycDocuments: number;
            sentMessages: number;
            conversations: number;
            savedListings: number;
            propertyViews: number;
            buyerPayments: number;
            buyerAcceptances: number;
        };
        id: string;
        email: string;
        phoneNumber: string | null;
        fullName: string | null;
        avatarUrl: string | null;
        nationality: string | null;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        verifiedAt: Date | null;
        lastLogin: Date | null;
        lastActive: Date | null;
        isOnline: boolean;
    }>;
    updateProfile(user: any, dto: UpdateUserProfileDto): Promise<{
        message: string;
    }>;
}
