import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Prisma, ProjectType } from '@prisma/client';
import { SearchPropertyDto } from './dto/search-property.dto';

@Injectable()
export class PropertyService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePropertyDto) {
    const {
      featuredUntil,
      attributes = [],
      listingAgentId,
      developerId,
      ...propertyData
    } = dto;

    // Validate that the listing agent exists in AgentProfile
    const agentExists = await this.prisma.agentProfile.findUnique({
      where: { userId: listingAgentId },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!agentExists) {
      // Check if the user exists but doesn't have an agent profile
      const userExists = await this.prisma.user.findUnique({
        where: { id: listingAgentId },
        select: { role: true }
      });

      if (userExists) {
        throw new BadRequestException(
          `User with ID ${listingAgentId} exists but is not an agent. User role: ${userExists.role}. ` +
          'Please create an agent profile first or use a valid agent ID.'
        );
      } else {
        throw new NotFoundException(`Agent with ID ${listingAgentId} not found. Please provide a valid agent ID.`);
      }
    }

    // Ensure the agent is fully verified before allowing property creation
    if (!agentExists.isRegaVerified || !agentExists.isNafathVerified) {
      throw new ForbiddenException(
        'Agent must be fully verified (REGA and Nafath) before adding a property.'
      );
    }

    // Validate developer if provided
    if (developerId) {
      const developerExists = await this.prisma.developer.findUnique({
        where: { id: developerId }
      });

      if (!developerExists) {
        throw new NotFoundException(`Developer with ID ${developerId} not found`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      try {
        // 1. Create main property
        const property = await tx.property.create({
          data: {
            listingAgentId, // Use the validated ID
            developerId,
            ...propertyData,
            featuredUntil: featuredUntil ? new Date(featuredUntil) : null,
            currency: dto.currency ?? 'SAR',
            // Ensure arrays are properly handled
            images: propertyData.images || [],
          },
        });

        // 2. Create attributes (if any)
        if (attributes.length > 0) {
          await tx.propertyAttribute.createMany({
            data: attributes.map(attr => ({
              propertyId: property.id,
              key: attr.key,
              value: attr.value,
            })),
            skipDuplicates: true,
          });
        }

        // Return the created property with relations
        return tx.property.findUnique({
          where: { id: property.id },
          include: {
            agent: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    email: true,
                    phoneNumber: true
                  }
                }
              }
            },
            developer: true,
            attributes: true
          }
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2003') {
            // This will help identify which foreign key failed
            const field = error.meta?.field_name || 'unknown';
            throw new BadRequestException(`Foreign key constraint failed on ${field}`);
          }
          if (error.code === 'P2002') {
            throw new BadRequestException('Unique constraint violation');
          }
        }
        throw error;
      }
    });
  }

  async findAll(searchDto?: SearchPropertyDto) {
    const {
      location,
      listingPurpose,
      minPrice,
      type,
      maxPrice,
      timeFilter,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = searchDto || {};
    const andConditions: any[] = [];

    const orConditions: any[] = [];

    // ===============================
    // 🔹 BASIC FILTERS (OR)
    // ===============================
    // Build where clause dynamically
    const where: any = {
      isRegaVerified: true, // Default to verified properties only
      status: 'ACTIVE'
    };

    if (location?.trim()) {
      orConditions.push({
        location: { contains: location, mode: 'insensitive' },
      });
    }

    if (listingPurpose) {
      andConditions.push({ listingPurpose });
    }

    // ✅ STRICT (must match)
    if (searchDto?.zoneId && searchDto.zoneId !== 'allproperties') {
      andConditions.push({ zoneId: searchDto.zoneId });
    }
    if (type && type !== 'allproperties') {
      andConditions.push({ type });
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      const price: any = {};
      if (minPrice !== undefined) price.gte = minPrice;
      if (maxPrice !== undefined) price.lte = maxPrice;

      andConditions.push({ price });
    }

    // ===============================
    // ⏱ TIME FILTER
    // ===============================
    if (timeFilter) {
      const now = new Date();
      let gteDate: Date | null = null;

      switch (timeFilter) {
        case 'today':
          gteDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'this_week':
          gteDate = new Date(new Date().setDate(now.getDate() - 7));
          break;
        case 'this_month':
          gteDate = new Date(new Date().setMonth(now.getMonth() - 1));
          break;
        case 'this_year':
          gteDate = new Date(new Date().setFullYear(now.getFullYear() - 1));
          break;
      }

      if (gteDate) {
        orConditions.push({ createdAt: { gte: gteDate } });
      }
    }

    // ===============================
    // 🔍 SEARCH (STRONG PART)
    // ===============================
    if (search?.trim()) {
      const words = search.trim().split(/\s+/);

      words.forEach((word) => {
        const textMatch = { contains: word, mode: 'insensitive' };
        const normalizedWord = word.toUpperCase().replace(/\s+/g, '_');
        const matchedTypes = Object.values(ProjectType).filter(
          (projectType) =>
            projectType.includes(normalizedWord) ||
            projectType.replace(/_/g, '').includes(normalizedWord.replace(/_/g, '')),
        );

        orConditions.push(
          { title: textMatch },
          { description: textMatch },
          { location: textMatch },
          { addressLine: textMatch },
          { developer: { name: textMatch } },
          { agent: { user: { fullName: textMatch } } },
          { agent: { agencyName: textMatch } },
          { nearbyProjects: { some: { name: textMatch } } },

          {
            attributes: {
              some: {
                OR: [{ key: textMatch }, { value: textMatch }],
              },
            },
          },

          {
            nearbyProjects: {
              some: { name: textMatch },
            },
          },

          {
            units: {
              some: {
                OR: [
                  { unitNumber: textMatch },
                  { title: textMatch },
                  { description: textMatch },
                ],
              },
            },
          }
          ,
          {
            paymentPlans: {
              some: {
                OR: [
                  { name: textMatch },
                ]
              }
            }
          }
        );

        if (matchedTypes.length > 0) {
          matchedTypes.forEach((matchedType) => {
            orConditions.push({ type: matchedType as ProjectType });
          });
        }

        // numeric
        if (!isNaN(Number(word))) {
          const num = Number(word);

          orConditions.push(
            { price: num },
            { bedrooms: num },
            { bathrooms: num }
          );
        }
      });
    }

    // =====================
    // FINAL WHERE
    // =====================
    where.AND = [
      ...andConditions,
      ...(orConditions.length > 0 ? [{ OR: orConditions }] : []),
    ];
    // ===============================
    // 📄 PAGINATION + SORT
    // ===============================
    const skip = (page - 1) * limit;

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // ===============================
    // 🚀 QUERY
    // ===============================
    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        include: {
          agent: {
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                  phoneNumber: true,
                  avatarUrl: true,
                },
              },
            },
          },
          developer: true,
          attributes: true,
          media: {
            take: 1,
            where: { isPrimary: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      success: true,
      data: properties
    };
  }
  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        agent: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phoneNumber: true,
                avatarUrl: true
              }
            }
          }
        },
        developer: true,
        attributes: true,
        media: {
          orderBy: {
            sortOrder: 'asc'
          }
        },
        units: {
          include: {
            media: true
          }
        },
        paymentPlans: {
          include: {
            milestones: {
              orderBy: {
                milestoneOrder: 'asc'
              }
            }
          }
        },
        bankAccount: true,
        nearbyProjects: {
          where: { isActive: true }
        },
        _count: {
          select: {
            savedBy: true,
            propertyViews: true
          }
        }
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async getAllPropertyTypes() {
    const types = Object.values(ProjectType);

    // Get count for each type
    const typeCounts = await Promise.all(
      types.map(async (type) => {
        const count = await this.prisma.property.count({
          where: {
            type: type as ProjectType,
            isRegaVerified: true
          },
        });
        return {
          type,
          count,
        };
      })
    );

    return {
      success: true,
      data: typeCounts,
    }

  }
  async update(id: string, dto: UpdatePropertyDto) {
    // First check if property exists
    await this.findOne(id);

    const { attributes, featuredUntil, listingAgentId, developerId, ...restDto } = dto as any;

    // If updating listingAgentId, validate it
    if (listingAgentId) {
      const agentExists = await this.prisma.agentProfile.findUnique({
        where: { userId: listingAgentId }
      });

      if (!agentExists) {
        throw new NotFoundException(`Agent with ID ${listingAgentId} not found`);
      }
    }

    // If updating developerId, validate it
    if (developerId) {
      const developerExists = await this.prisma.developer.findUnique({
        where: { id: developerId }
      });

      if (!developerExists) {
        throw new NotFoundException(`Developer with ID ${developerId} not found`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Update main property
      const updateData: any = {
        ...restDto,
        ...(listingAgentId && { listingAgentId }),
        ...(developerId && { developerId }),
        featuredUntil: featuredUntil ? new Date(featuredUntil) : undefined,
      };

      // Handle arrays properly
      if ((restDto as any).images) {
        updateData.images = (restDto as any).images;
      }

      await tx.property.update({
        where: { id },
        data: updateData,
      });

      // 2. Handle attributes replacement (if provided)
      if (attributes) {
        await tx.propertyAttribute.deleteMany({
          where: { propertyId: id }
        });

        if (attributes.length > 0) {
          await tx.propertyAttribute.createMany({
            data: attributes.map(a => ({
              propertyId: id,
              key: a.key,
              value: a.value,
            })),
            skipDuplicates: true,
          });
        }
      }

      return this.findOne(id);
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.property.delete({
        where: { id },
      });
      return { success: true, message: 'Property deleted successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Property with ID ${id} not found`);
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Cannot delete property because it has related records');
        }
      }
      throw error;
    }
  }

  // Helper method to check if a user can be an agent
  async validateAgent(userId: string): Promise<boolean> {
    const agentProfile = await this.prisma.agentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { role: true }
        }
      }
    });

    return !!agentProfile;
  }

  async getAvailableAgents() {
    return this.prisma.agentProfile.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            avatarUrl: true
          }
        }
      },
      where: {
        user: {
          status: 'ACTIVE'
        }
      }
    });
  }

  async getAdminStats(adminId: string) {
    // Validate admin
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'ADMIN' },
    });

    if (!admin) {
      throw new BadRequestException('Unauthorized: Only admins can view statistics');
    }

    const [total, inactive, regaVerified, nonRegaVerified] = await Promise.all([
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: { not: 'ACTIVE' } } }),
      this.prisma.property.count({ where: { isRegaVerified: true } }),
      this.prisma.property.count({ where: { isRegaVerified: false } }),
    ]);

    return {
      success: true,
      data: {
        totalProperties: total,
        totalInactive: inactive,
        totalRegaVerified: regaVerified,
        totalNonRegaVerified: nonRegaVerified,
      },
    };
  }
}