import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { CreateKycDocumentDto, AdminVerifyKycDto, DocumentType } from './dto/create-kyc-document.dto';
import { UpdateKycDocumentDto } from './dto/update-kyc-document.dto';
import { FilterKycDocumentDto } from './dto/filter-kyc-document.dto';
import { KycStatus, Prisma } from '@prisma/client';

@Injectable()
export class KycDocumentService {
  constructor(private readonly prisma: PrismaService) { }

  // User uploads KYC document
  async upload(createDto: CreateKycDocumentDto) {
    const { userId, documentType, fileUrl, notes } = createDto;

    // Validate user exists
    await this.validateUser(userId);

    // Check if user already has a pending document of this type
    const existingPending = await this.prisma.kycDocument.findFirst({
      where: {
        userId,
        documentType,
        verificationStatus: {
          in: [KycStatus.PENDING],
        },
      },
    });

    if (existingPending) {
      throw new ConflictException(
        `You already have a pending ${documentType} document. Please wait for verification.`,
      );
    }

    try {
      const document = await this.prisma.kycDocument.create({
        data: {
          userId,
          documentType,
          fileUrl,
          verificationStatus: KycStatus.PENDING,
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('User not found');
        }
      }
      throw error;
    }
  }

  // Admin verifies or rejects document
  async verify(verifyDto: AdminVerifyKycDto) {
    const { documentId, adminId, status, rejectionReason } = verifyDto;

    // Validate admin exists
    await this.validateAdmin(adminId);

    // Get document
    const document = await this.prisma.kycDocument.findUnique({
      where: { id: documentId },
      include: {
        user: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`KYC document with ID ${documentId} not found`);
    }

    if (status === KycStatus.REJECTED && !rejectionReason) {
      throw new BadRequestException('Rejection reason is required when rejecting a document');
    }

    // Update document
    const updatedDocument = await this.prisma.kycDocument.update({
      where: { id: documentId },
      data: {
        verificationStatus: status,
        rejectionReason: status === KycStatus.REJECTED ? rejectionReason : null,
        verifiedAt: status === KycStatus.VERIFIED ? new Date() : null,
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

    // Always re-check the user's overall KYC completion to handle both approvals and revocations
    await this.checkUserKycCompletion(document.userId);

    return {
      success: true,
      message: `Document ${status.toLowerCase()} successfully`,
      data: updatedDocument,
    };
  }

  async findAll(filterDto: FilterKycDocumentDto) {
    const {
      userId,
      documentType,
      verificationStatus,
      fromDate,
      toDate,
      search,
      page = 1,
      limit = 20,
    } = filterDto;

    const skip = (page - 1) * limit;
    const where: Prisma.KycDocumentWhereInput = {};

    if (userId) where.userId = userId;
    if (documentType) where.documentType = documentType;
    if (verificationStatus) where.verificationStatus = verificationStatus;

    if (fromDate || toDate) {
      where.uploadedAt = {};
      if (fromDate) where.uploadedAt.gte = new Date(fromDate);
      if (toDate) where.uploadedAt.lte = new Date(toDate);
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

    // Group documents by user
    const userGroups = new Map<string, any>();

    documents.forEach((doc) => {
      const userId = doc.userId;
      if (!userGroups.has(userId)) {
        userGroups.set(userId, {
          ...doc.user,
          documents: [],
        });
      }

      // Remove the user object from the document to avoid redundancy
      const { user, ...documentData } = doc as any;
      userGroups.get(userId).documents.push(documentData);
    });

    const groupedData = Array.from(userGroups.values());

    // Apply manual pagination on grouped data
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

  async findOne(id: string) {
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
      throw new NotFoundException(`KYC document with ID ${id} not found`);
    }

    return {
      success: true,
      data: document,
    };
  }



  async findByUser(userId: string, filterDto: FilterKycDocumentDto) {
    await this.validateUser(userId);
    const { documentType, verificationStatus } = filterDto;

    const where: Prisma.KycDocumentWhereInput = { userId };
    if (documentType) where.documentType = documentType;
    if (verificationStatus) where.verificationStatus = verificationStatus;

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



  async getUserKycStatus(userId: string) {
    await this.validateUser(userId);

    const documents = await this.prisma.kycDocument.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });

    const requiredDocs = [DocumentType.PASSPORT, DocumentType.PROOF_OF_ADDRESS];
    const verifiedDocs = documents.filter(doc => doc.verificationStatus === KycStatus.VERIFIED);
    const pendingDocs = documents.filter(doc => doc.verificationStatus === KycStatus.PENDING);
    const rejectedDocs = documents.filter(doc => doc.verificationStatus === KycStatus.REJECTED);

    // ✅ Explicit type
    let overallStatus: KycStatus = KycStatus.PENDING;

    if (verifiedDocs.length >= requiredDocs.length) {
      overallStatus = KycStatus.VERIFIED;
    } else if (rejectedDocs.length > 0) {
      overallStatus = KycStatus.REJECTED;
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
        missingDocuments: requiredDocs.filter(
          type => !verifiedDocs.some(doc => doc.documentType === type),
        ),
        recentActivity: documents.slice(0, 3),
      },
    };
  }
  async update(id: string, updateDto: UpdateKycDocumentDto) {
    await this.findOne(id);

    const { userId, ...updateData } = updateDto;

    if (userId) {
      await this.validateUser(userId);
    }

    // Don't allow status update through this method (use verify endpoint)
    if (updateData.verificationStatus) {
      throw new BadRequestException('Use the verify endpoint to update document status');
    }

    const updated = await this.prisma.kycDocument.update({
      where: { id },
      data: {
        ...updateData,
        ...(userId && { userId }),
        verificationStatus: KycStatus.PENDING,
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

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.kycDocument.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'KYC document deleted successfully',
    };
  }



  async getUserStats(userId: string) {
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

  private async checkUserKycCompletion(userId: string) {
    const documents = await this.prisma.kycDocument.findMany({
      where: { userId },
    });

    const requiredDocs = [DocumentType.PASSPORT, DocumentType.PROOF_OF_ADDRESS];
    const verifiedDocs = documents.filter(doc => doc.verificationStatus === KycStatus.VERIFIED);
    const verifiedTypes = verifiedDocs.map(doc => doc.documentType);

    const allRequiredVerified = requiredDocs.every(type => verifiedTypes.includes(type));

    if (allRequiredVerified) {
      // Update user's KYC status to verified
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
        },
      });

      // Also update buyer/agent profile if needed
      await this.prisma.buyerProfile.updateMany({
        where: { userId },
        data: { kycStatus: KycStatus.VERIFIED },
      });

      await this.prisma.agentProfile.updateMany({
        where: { userId },
        data: { verifiedAt: new Date() },
      });
    } else {
      // If the admin revoked a required document, we should revoke the user's overall verification
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isVerified: false,
          verifiedAt: null,
        },
      });

      await this.prisma.buyerProfile.updateMany({
        where: { userId },
        data: { kycStatus: KycStatus.PENDING },
      });

      await this.prisma.agentProfile.updateMany({
        where: { userId },
        data: { verifiedAt: null },
      });
    }
  }

  private async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  private async validateAdmin(adminId: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    return admin;
  }
}