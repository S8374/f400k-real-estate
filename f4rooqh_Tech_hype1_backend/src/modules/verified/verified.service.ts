import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { VerifyAgentDto, VerifyPropertyDto, VerificationFilterDto } from './dto/create-verified.dto';
import { UpdateVerifiedDto } from './dto/update-verified.dto';
import { Role } from '@prisma/client';

@Injectable()
export class VerifiedService {
  constructor(private readonly prisma: PrismaService) { }

  // ============ Agent Verification ============

  async getPendingAgents() {
    const agents = await this.prisma.agentProfile.findMany({
      where: {
        OR: [
          { isRegaVerified: false },
          { isNafathVerified: false },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            createdAt: true,
          },
        },
        properties: {
          select: {
            id: true,
            title: true,
            status: true,
            isRegaVerified: true
          },
        },
      },
      orderBy: {
        user: {
          createdAt: 'asc',
        },
      },
    });

    return {
      success: true,
      data: agents.map(agent => ({
        ...agent,
        verificationStatus: {
          regaVerified: agent.isRegaVerified,
          nafathVerified: agent.isNafathVerified,
          isFullyVerified: agent.isRegaVerified && agent.isNafathVerified,
          pendingVerifications: [
            !agent.isRegaVerified && 'REGA',
            !agent.isNafathVerified && 'NAFATH',
          ].filter(Boolean),
        },
      })),
      count: agents.length,
    };
  }

  async getVerifiedAgents() {
    const agents = await this.prisma.agentProfile.findMany({
      where: {
        isRegaVerified: true,
        isNafathVerified: true,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            avatarUrl: true,
          },
        },
        properties: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: {
        verifiedAt: 'desc',
      },
    });

    return {
      success: true,
      data: agents,
      count: agents.length,
    };
  }

  async getAgentVerificationStatus(agentId: string) {
    const agent = await this.prisma.agentProfile.findUnique({
      where: { userId: agentId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        properties: {
          select: {
            id: true,
            title: true,
            isRegaVerified: true,
            sakNumber: true,
          },
        },
      },
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    return {
      success: true,
      data: {
        agent: {
          id: agent.userId,
          name: agent.user.fullName,
          email: agent.user.email,
          phone: agent.user.phoneNumber,
        },
        verification: {
          regaVerified: agent.isRegaVerified,
          nafathVerified: agent.isNafathVerified,
          isFullyVerified: agent.isRegaVerified && agent.isNafathVerified,
          verifiedAt: agent.verifiedAt,
        },
        properties: agent.properties.map(p => ({
          id: p.id,
          title: p.title,
          isRegaVerified: p.isRegaVerified,
          sakNumber: p.sakNumber,
        })),
      },
    };
  }

  async verifyAgent(verifyAgentDto: VerifyAgentDto) {
    const { agentId, adminId, isRegaVerified, isNafathVerified, notes } = verifyAgentDto;

    // Validate admin exists
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: Role.ADMIN },
    });

    if (!admin) {
      throw new BadRequestException('Invalid admin ID');
    }

    // Validate agent exists
    const agent = await this.prisma.agentProfile.findUnique({
      where: { userId: agentId },
      include: {
        user: true,
      },
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    // Update agent verification
    const updatedAgent = await this.prisma.agentProfile.update({
      where: { userId: agentId },
      data: {
        isRegaVerified,
        isNafathVerified,
        verifiedAt: (isRegaVerified && isNafathVerified) ? new Date() : null,
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Log verification activity (optional)
    if (notes) {
      // You could store this in an audit log table
      console.log(`Agent ${agentId} verified by admin ${adminId}: ${notes}`);
    }

    return {
      success: true,
      message: 'Agent verification updated successfully',
      data: {
        agentId: updatedAgent.userId,
        name: updatedAgent.user.fullName,
        isRegaVerified: updatedAgent.isRegaVerified,
        isNafathVerified: updatedAgent.isNafathVerified,
        isFullyVerified: updatedAgent.isRegaVerified && updatedAgent.isNafathVerified,
        verifiedAt: updatedAgent.verifiedAt,
      },
    };
  }

  // ============ Property Verification ============

  async getPendingProperties() {
    const properties = await this.prisma.property.findMany({
      where: {
        OR: [
          { isRegaVerified: false },
          { isRegaVerified: null },
        ],
      },
      include: {
        agent: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
        developer: true,
        media: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      success: true,
      data: properties,
      count: properties.length,
    };
  }

  async getVerifiedProperties() {
    const properties = await this.prisma.property.findMany({
      where: {
        isRegaVerified: true,
        sakNumber: { not: null },
      },
      include: {
        agent: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
        developer: true,
        media: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      success: true,
      data: properties,
      count: properties.length,
    };
  }

  async getPropertyVerificationStatus(propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
        developer: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return {
      success: true,
      data: {
        property: {
          id: property.id,
          title: property.title,
          price: property.price,
          currency: property.currency,
        },
        verification: {
          isRegaVerified: property.isRegaVerified || false,
          sakNumber: property.sakNumber,
          isVerified: !!(property.isRegaVerified && property.sakNumber),
        },
        agent: {
          id: property.agent.userId,
          name: property.agent.user.fullName,
          isRegaVerified: property.agent.isRegaVerified,
          isNafathVerified: property.agent.isNafathVerified,
        },
        developer: property.developer,
      },
    };
  }

  async verifyProperty(verifyPropertyDto: VerifyPropertyDto) {
    const { propertyId, adminId, isRegaVerified, sakNumber, notes } = verifyPropertyDto;

    // Validate admin exists
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: Role.ADMIN },
    });

    if (!admin) {
      throw new BadRequestException('Invalid admin ID');
    }

    // Validate property exists
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // If marking as verified, ensure sakNumber is provided
    if (isRegaVerified && !sakNumber) {
      throw new BadRequestException('SAK number is required for verified properties');
    }

    // Determine new status
    let newStatus = property.status;
    if (isRegaVerified) {
      // If verifying, change status from PENDING to ACTIVE
      newStatus = 'ACTIVE';
    } else if (!isRegaVerified && property.status === 'ACTIVE') {
      // If un-verifying an active property, you might want to set it back to PENDING
      // Uncomment the line below if this is the desired behavior
      // newStatus = 'PENDING';
    }

    // Update property verification and status
    const updatedProperty = await this.prisma.property.update({
      where: { id: propertyId },
      data: {
        isRegaVerified,
        sakNumber: isRegaVerified ? sakNumber : null,
        status: newStatus, // Update status if needed
      },
      include: {
        agent: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Log verification activity
    if (notes) {
      console.log(`Property ${propertyId} verified by admin ${adminId}: ${notes}`);
    }

    // Prepare status change message
    const statusMessage = property.status !== newStatus
      ? ` and status changed from ${property.status} to ${newStatus}`
      : '';

    return {
      success: true,
      message: isRegaVerified
        ? `Property verified successfully${statusMessage}`
        : 'Property verification removed',
      data: {
        propertyId: updatedProperty.id,
        title: updatedProperty.title,
        status: updatedProperty.status,
        isRegaVerified: updatedProperty.isRegaVerified,
        sakNumber: updatedProperty.sakNumber,
        agent: {
          id: updatedProperty.agent.userId,
          name: updatedProperty.agent.user.fullName,
        },
      },
    };
  }

  // ============ Combined Methods ============

  async getAllVerificationStatus(filterDto: VerificationFilterDto) {
    const { type = 'all', pendingOnly = false, agentId } = filterDto;

    const result: any = {};

    if (type === 'all' || type === 'agent') {
      const where: any = {};
      if (pendingOnly) {
        where.OR = [
          { isRegaVerified: false },
          { isNafathVerified: false },
        ];
      }

      result.agents = await this.prisma.agentProfile.findMany({
        where,
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
          _count: {
            select: {
              properties: true,
            },
          },
        },
      });
    }

    if (type === 'all' || type === 'property') {
      const where: any = {};
      if (pendingOnly) {
        where.OR = [
          { isRegaVerified: false },
          { isRegaVerified: null },
        ];
      }
      if (agentId) {
        where.listingAgentId = agentId;
      }

      result.properties = await this.prisma.property.findMany({
        where,
        include: {
          agent: {
            include: {
              user: {
                select: {
                  fullName: true,
                },
              },
            },
          },
          media: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      });
    }

    return {
      success: true,
      data: result,
    };
  }

  async getAgentPropertiesVerification(agentId: string) {
    // Verify agent exists
    const agent = await this.prisma.agentProfile.findUnique({
      where: { userId: agentId },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${agentId} not found`);
    }

    const properties = await this.prisma.property.findMany({
      where: { listingAgentId: agentId },
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        isRegaVerified: true,
        sakNumber: true,
        status: true,
        media: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const verifiedCount = properties.filter(p => p.isRegaVerified).length;
    const pendingCount = properties.filter(p => !p.isRegaVerified).length;

    return {
      success: true,
      data: {
        properties,
      },
    };
  }

  async getVerificationStats() {
    const [
      totalAgents,
      fullyVerifiedAgents,
      regaVerifiedOnly,
      nafathVerifiedOnly,
      totalProperties,
      verifiedProperties,
      pendingProperties,
    ] = await Promise.all([
      // Agent stats
      this.prisma.agentProfile.count(),
      this.prisma.agentProfile.count({
        where: {
          isRegaVerified: true,
          isNafathVerified: true,
        },
      }),
      this.prisma.agentProfile.count({
        where: {
          isRegaVerified: true,
          isNafathVerified: false,
        },
      }),
      this.prisma.agentProfile.count({
        where: {
          isRegaVerified: false,
          isNafathVerified: true,
        },
      }),
      // Property stats
      this.prisma.property.count(),
      this.prisma.property.count({
        where: {
          isRegaVerified: true,
          sakNumber: { not: null },
        },
      }),
      this.prisma.property.count({
        where: {
          OR: [
            { isRegaVerified: false },
            { isRegaVerified: null },
          ],
        },
      }),
    ]);

    return {
      success: true,
      data: {
        agents: {
          total: totalAgents,
          fullyVerified: fullyVerifiedAgents,
          regaVerifiedOnly,
          nafathVerifiedOnly,
          pending: totalAgents - fullyVerifiedAgents,
          verificationRate: totalAgents > 0
            ? Math.round((fullyVerifiedAgents / totalAgents) * 100)
            : 0,
        },
        properties: {
          total: totalProperties,
          verified: verifiedProperties,
          pending: pendingProperties,
          verificationRate: totalProperties > 0
            ? Math.round((verifiedProperties / totalProperties) * 100)
            : 0,
        },
      },
    };
  }

  // Legacy methods (keep for compatibility)
  async create(createVerifiedDto: any) {
    return {
      success: true,
      message: 'Use specific verification endpoints instead',
    };
  }


  async findOne(id: string) {
    // Try to find as agent first, then as property
    try {
      return await this.getAgentVerificationStatus(id);
    } catch {
      try {
        return await this.getPropertyVerificationStatus(id);
      } catch {
        throw new NotFoundException(`No agent or property found with ID ${id}`);
      }
    }
  }

  async update(id: string, updateVerifiedDto: UpdateVerifiedDto) {
    return {
      success: true,
      message: 'Use specific verification endpoints instead',
    };
  }

}