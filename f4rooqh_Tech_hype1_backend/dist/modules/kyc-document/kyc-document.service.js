"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycDocumentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
const create_kyc_document_dto_1 = require("./dto/create-kyc-document.dto");
const client_1 = require("@prisma/client");
let KycDocumentService = class KycDocumentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upload(createDto) {
        const { userId, documentType, fileUrl, notes } = createDto;
        await this.validateUser(userId);
        const existingPending = await this.prisma.kycDocument.findFirst({
            where: {
                userId,
                documentType,
                verificationStatus: {
                    in: [client_1.KycStatus.PENDING],
                },
            },
        });
        if (existingPending) {
            throw new common_1.ConflictException(`You already have a pending ${documentType} document. Please wait for verification.`);
        }
        try {
            const document = await this.prisma.kycDocument.create({
                data: {
                    userId,
                    documentType,
                    fileUrl,
                    verificationStatus: client_1.KycStatus.PENDING,
                    uploadedAt: new Date(),
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: 'KYC document uploaded successfully',
                data: document,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new common_1.NotFoundException('User not found');
                }
            }
            throw error;
        }
    }
    async verify(verifyDto) {
        const { documentId, adminId, status, rejectionReason } = verifyDto;
        await this.validateAdmin(adminId);
        const document = await this.prisma.kycDocument.findUnique({
            where: { id: documentId },
            include: {
                user: true,
            },
        });
        if (!document) {
            throw new common_1.NotFoundException(`KYC document with ID ${documentId} not found`);
        }
        if (status === client_1.KycStatus.REJECTED && !rejectionReason) {
            throw new common_1.BadRequestException('Rejection reason is required when rejecting a document');
        }
        const updatedDocument = await this.prisma.kycDocument.update({
            where: { id: documentId },
            data: {
                verificationStatus: status,
                rejectionReason: status === client_1.KycStatus.REJECTED ? rejectionReason : null,
                verifiedAt: status === client_1.KycStatus.VERIFIED ? new Date() : null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });
        await this.checkUserKycCompletion(document.userId);
        return {
            success: true,
            message: `Document ${status.toLowerCase()} successfully`,
            data: updatedDocument,
        };
    }
    async findAll(filterDto) {
        const { userId, documentType, verificationStatus, fromDate, toDate, search, page = 1, limit = 20, } = filterDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (userId)
            where.userId = userId;
        if (documentType)
            where.documentType = documentType;
        if (verificationStatus)
            where.verificationStatus = verificationStatus;
        if (fromDate || toDate) {
            where.uploadedAt = {};
            if (fromDate)
                where.uploadedAt.gte = new Date(fromDate);
            if (toDate)
                where.uploadedAt.lte = new Date(toDate);
        }
        if (search) {
            where.OR = [
                { documentType: { contains: search, mode: 'insensitive' } },
                { user: { fullName: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [documents, total] = await Promise.all([
            this.prisma.kycDocument.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            phoneNumber: true,
                            role: true,
                            avatarUrl: true,
                            status: true,
                        },
                    },
                },
                orderBy: {
                    uploadedAt: 'desc',
                },
            }),
            this.prisma.kycDocument.count({ where }),
        ]);
        const userGroups = new Map();
        documents.forEach((doc) => {
            const userId = doc.userId;
            if (!userGroups.has(userId)) {
                userGroups.set(userId, {
                    ...doc.user,
                    documents: [],
                });
            }
            const { user, ...documentData } = doc;
            userGroups.get(userId).documents.push(documentData);
        });
        const groupedData = Array.from(userGroups.values());
        const paginatedData = groupedData.slice(skip, skip + limit);
        return {
            success: true,
            data: paginatedData,
            meta: {
                total: groupedData.length,
                page,
                limit,
                totalPages: Math.ceil(groupedData.length / limit),
            },
        };
    }
    async findOne(id) {
        const document = await this.prisma.kycDocument.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true,
                    },
                },
            },
        });
        if (!document) {
            throw new common_1.NotFoundException(`KYC document with ID ${id} not found`);
        }
        return {
            success: true,
            data: document,
        };
    }
    async findByUser(userId, filterDto) {
        await this.validateUser(userId);
        const { documentType, verificationStatus } = filterDto;
        const where = { userId };
        if (documentType)
            where.documentType = documentType;
        if (verificationStatus)
            where.verificationStatus = verificationStatus;
        const documents = await this.prisma.kycDocument.findMany({
            where,
            orderBy: {
                uploadedAt: 'desc',
            },
        });
        return {
            success: true,
            data: documents,
        };
    }
    async getUserKycStatus(userId) {
        await this.validateUser(userId);
        const documents = await this.prisma.kycDocument.findMany({
            where: { userId },
            orderBy: { uploadedAt: 'desc' },
        });
        const requiredDocs = [create_kyc_document_dto_1.DocumentType.PASSPORT, create_kyc_document_dto_1.DocumentType.PROOF_OF_ADDRESS];
        const verifiedDocs = documents.filter(doc => doc.verificationStatus === client_1.KycStatus.VERIFIED);
        const pendingDocs = documents.filter(doc => doc.verificationStatus === client_1.KycStatus.PENDING);
        const rejectedDocs = documents.filter(doc => doc.verificationStatus === client_1.KycStatus.REJECTED);
        let overallStatus = client_1.KycStatus.PENDING;
        if (verifiedDocs.length >= requiredDocs.length) {
            overallStatus = client_1.KycStatus.VERIFIED;
        }
        else if (rejectedDocs.length > 0) {
            overallStatus = client_1.KycStatus.REJECTED;
        }
        return {
            success: true,
            data: {
                userId,
                overallStatus,
                documents: {
                    total: documents.length,
                    verified: verifiedDocs.length,
                    pending: pendingDocs.length,
                    rejected: rejectedDocs.length,
                },
                requiredDocuments: requiredDocs,
                missingDocuments: requiredDocs.filter(type => !verifiedDocs.some(doc => doc.documentType === type)),
                recentActivity: documents.slice(0, 3),
            },
        };
    }
    async update(id, updateDto) {
        await this.findOne(id);
        const { userId, ...updateData } = updateDto;
        if (userId) {
            await this.validateUser(userId);
        }
        if (updateData.verificationStatus) {
            throw new common_1.BadRequestException('Use the verify endpoint to update document status');
        }
        const updated = await this.prisma.kycDocument.update({
            where: { id },
            data: {
                ...updateData,
                ...(userId && { userId }),
                verificationStatus: client_1.KycStatus.PENDING,
                rejectionReason: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
        return {
            success: true,
            message: 'KYC document updated successfully',
            data: updated,
        };
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.kycDocument.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'KYC document deleted successfully',
        };
    }
    async getUserStats(userId) {
        await this.validateUser(userId);
        const documents = await this.prisma.kycDocument.findMany({
            where: { userId },
            orderBy: { uploadedAt: 'desc' },
        });
        const timeline = documents.map(doc => ({
            documentType: doc.documentType,
            status: doc.verificationStatus,
            uploadedAt: doc.uploadedAt,
            verifiedAt: doc.verifiedAt,
            rejectionReason: doc.rejectionReason,
        }));
        return {
            success: true,
            data: {
                userId,
                totalUploads: documents.length,
                timeline,
            },
        };
    }
    async checkUserKycCompletion(userId) {
        const documents = await this.prisma.kycDocument.findMany({
            where: { userId },
        });
        const requiredDocs = [create_kyc_document_dto_1.DocumentType.PASSPORT, create_kyc_document_dto_1.DocumentType.PROOF_OF_ADDRESS];
        const verifiedDocs = documents.filter(doc => doc.verificationStatus === client_1.KycStatus.VERIFIED);
        const verifiedTypes = verifiedDocs.map(doc => doc.documentType);
        const allRequiredVerified = requiredDocs.every(type => verifiedTypes.includes(type));
        if (allRequiredVerified) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                    verifiedAt: new Date(),
                },
            });
            await this.prisma.buyerProfile.updateMany({
                where: { userId },
                data: { kycStatus: client_1.KycStatus.VERIFIED },
            });
            await this.prisma.agentProfile.updateMany({
                where: { userId },
                data: { verifiedAt: new Date() },
            });
        }
        else {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: false,
                    verifiedAt: null,
                },
            });
            await this.prisma.buyerProfile.updateMany({
                where: { userId },
                data: { kycStatus: client_1.KycStatus.PENDING },
            });
            await this.prisma.agentProfile.updateMany({
                where: { userId },
                data: { verifiedAt: null },
            });
        }
    }
    async validateUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
    async validateAdmin(adminId) {
        const admin = await this.prisma.user.findUnique({
            where: { id: adminId, role: 'ADMIN' },
        });
        if (!admin) {
            throw new common_1.NotFoundException(`Admin with ID ${adminId} not found`);
        }
        return admin;
    }
};
exports.KycDocumentService = KycDocumentService;
exports.KycDocumentService = KycDocumentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KycDocumentService);
//# sourceMappingURL=kyc-document.service.js.map