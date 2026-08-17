import { MilestonePaymentService } from '../milestone-payment/milestone-payment.service';
import { PrismaService } from '../../common/context/prisma.service';
import { AgentUploadDto, AgentReviewDto } from '../milestone-payment/dto/agent-action.dto';
import { MarkAsReadDto } from '../milestone-payment/dto/mark-as-read.dto';
import { FilterMilestonePaymentDto } from '../milestone-payment/dto/filter-milestone-payment.dto';
export declare class AgentMilestonePaymentService {
    private readonly prisma;
    private readonly milestonePaymentService;
    constructor(prisma: PrismaService, milestonePaymentService: MilestonePaymentService);
    getPendingPayments(agentId: string, filterDto: FilterMilestonePaymentDto): Promise<{
        success: boolean;
        data: ({
            milestone: {
                id: string;
                description: string;
                milestoneOrder: number;
                planId: string;
                tittle: string | null;
                amount: number | null;
                dueDate: Date | null;
                constructionProgress: number | null;
            };
            agent: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
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
            } | null;
            admin: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
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
            } | null;
            buyer: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    uploadDocument(dto: AgentUploadDto): Promise<{
        success: boolean;
        message: string;
        data: {
            buyer: {
                id: string;
                email: string;
                fullName: string | null;
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
        };
    }>;
    reviewPayment(dto: AgentReviewDto): Promise<{
        success: boolean;
        message: string;
        data: {
            buyer: {
                id: string;
                email: string;
                fullName: string | null;
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
        };
    }>;
    markAsRead(dto: MarkAsReadDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getAgentPerformance(agentId: string): Promise<{
        totalListings: number;
        activeListings: number;
        dealsCompleted: number;
    }>;
    getPaymentDetails(id: string, agentId: string): Promise<{
        success: boolean;
        data: {
            milestone: {
                plan: {
                    property: {
                        id: string;
                        listingAgentId: string;
                        title: string;
                    };
                    milestones: ({
                        payments: {
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
                        }[];
                    } & {
                        id: string;
                        description: string;
                        milestoneOrder: number;
                        planId: string;
                        tittle: string | null;
                        amount: number | null;
                        dueDate: Date | null;
                        constructionProgress: number | null;
                    })[];
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
            agent: {
                id: string;
                email: string;
                fullName: string | null;
            } | null;
            admin: {
                id: string;
                email: string;
                fullName: string | null;
            } | null;
            buyer: {
                id: string;
                email: string;
                phoneNumber: string | null;
                fullName: string | null;
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
        };
    }>;
    findByAgent(agentId: string): Promise<({
        developer: {
            id: string;
            name: string;
            logoUrl: string | null;
        } | null;
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
        propertyViews: {
            id: string;
            userId: string | null;
            viewedAt: Date;
            propertyId: string;
            source: string | null;
        }[];
        paymentPlans: ({
            milestones: {
                id: string;
                description: string;
                milestoneOrder: number;
                planId: string;
                tittle: string | null;
                amount: number | null;
                dueDate: Date | null;
                constructionProgress: number | null;
            }[];
            acceptances: ({
                buyer: {
                    id: string;
                    email: string;
                    fullName: string | null;
                };
            } & {
                id: string;
                propertyId: string;
                buyerId: string;
                paymentPlanId: string;
                acceptedAt: Date;
                acceptedById: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            propertyId: string;
            totalInstallments: number | null;
            createdById: string | null;
        })[];
        savedBy: ({
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
        } & {
            userId: string;
            savedAt: Date;
            propertyId: string;
        })[];
        invisitor: {
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
        } | null;
        units: ({
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
            status: import("@prisma/client").$Enums.UnitStatus | null;
            images: string[];
            title: string | null;
            description: string | null;
            price: number;
            currency: string;
            areaSqm: number;
            areaSqFt: number | null;
            bedrooms: number | null;
            bathrooms: number | null;
            balconies: number | null;
            floorNumber: number | null;
            parkingSlots: number | null;
            propertyId: string;
            unitNumber: string;
            isFeatured: boolean;
            isPricedOnRequest: boolean;
        })[];
        bankAccount: {
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
        } | null;
        nearbyProjects: {
            id: string;
            name: string;
            latitude: number | null;
            longitude: number | null;
            description: string | null;
            propertyId: string;
            isActive: boolean;
            distanceKm: number | null;
            category: string | null;
            icon: string | null;
        }[];
        attributes: {
            id: string;
            propertyId: string;
            key: string;
            value: string;
        }[];
        paymentPlanAcceptances: ({
            paymentPlan: {
                id: string;
                name: string;
            };
            buyer: {
                id: string;
                email: string;
                fullName: string | null;
            };
        } & {
            id: string;
            propertyId: string;
            buyerId: string;
            paymentPlanId: string;
            acceptedAt: Date;
            acceptedById: string | null;
        })[];
        _count: {
            propertyViews: number;
            paymentPlans: number;
            savedBy: number;
            units: number;
        };
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
    })[]>;
    getAgentDashboardStats(agentId: string): Promise<{
        success: boolean;
        data: {
            totalListings: number;
            activeListings: number;
            soldListings: number;
            pendingListings: number;
            totalLeads: number;
            conversionRate: string;
        };
    }>;
    private getTopPerformingProperties;
    private calculateEngagementScore;
    getUnreadCount(agentId: string): Promise<{
        unreadCount: number;
    }>;
}
