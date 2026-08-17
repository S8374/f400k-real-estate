import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';

import { Prisma } from '@prisma/client';
import { CreateSavedListingDto } from './dto/create-save-property.dto';
import { FilterSavedListingDto } from './dto/filter-saved.dto';

@Injectable()
export class SavedListingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateSavedListingDto) {
    const { userId, propertyId } = createDto;

    // Validate user exists
    await this.validateUser(userId);

    // Validate property exists
    await this.validateProperty(propertyId);

    // Check if already saved
    const existing = await this.prisma.savedListing.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Property already saved');
    }

    try {
      const savedListing = await this.prisma.savedListing.create({
        data: {
          userId,
          propertyId,
          savedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              currency: true,
              images: true,
              location: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Property saved successfully',
        data: savedListing,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Property already saved');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('User or Property not found');
        }
      }
      throw error;
    }
  }

  async toggle(createDto: CreateSavedListingDto) {
    const { userId, propertyId } = createDto;

    // Validate entities exist
    await this.validateUser(userId);
    await this.validateProperty(propertyId);

    const existing = await this.prisma.savedListing.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    if (existing) {
      // If exists, remove it (toggle off)
      await this.prisma.savedListing.delete({
        where: {
          userId_propertyId: {
            userId,
            propertyId,
          },
        },
      });

      return {
        success: true,
        message: 'Property removed from saved',
        data: { saved: false },
      };
    } else {
      // If doesn't exist, create it (toggle on)
      const saved = await this.prisma.savedListing.create({
        data: {
          userId,
          propertyId,
          savedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Property saved',
        data: { ...saved, saved: true },
      };
    }
  }

  async findAll(filterDto: FilterSavedListingDto) {
    const { userId, propertyId, page = 1, limit = 20 } = filterDto;

    const skip = (page - 1) * limit;
    const where: Prisma.SavedListingWhereInput = {};

    if (userId) where.userId = userId;
    if (propertyId) where.propertyId = propertyId;

    const [savedListings, total] = await Promise.all([
      this.prisma.savedListing.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          property: {
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
              media: {
                where: { isPrimary: true },
                take: 1,
              },
              _count: {
                select: {
                  savedBy: true,
                },
              },
            },
          },
        },
        orderBy: {
          savedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.savedListing.count({ where }),
    ]);

    return {
      success: true,
      data: savedListings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, propertyId: string) {
    const savedListing = await this.prisma.savedListing.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        property: {
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
            media: true,
          },
        },
      },
    });

    if (!savedListing) {
      throw new NotFoundException('Saved listing not found');
    }

    return {
      success: true,
      data: savedListing,
    };
  }

  async findByUser(userId: string, filterDto: FilterSavedListingDto) {
    await this.validateUser(userId);

    const result = await this.findAll({ ...filterDto, userId });
    
    console.log(result);
    // Transform to return just properties with saved info
    const properties = result.data.map(item => ({
      ...item.property,
      savedAt: item.savedAt,
    }));

    return {
      success: true,
      data: properties,
      meta: result.meta,
    };
  }

  async checkSaved(userId: string, propertyId: string) {
    await this.validateUser(userId);
    await this.validateProperty(propertyId);

    const saved = await this.prisma.savedListing.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    return {
      success: true,
      data: {
        isSaved: !!saved,
        savedAt: saved?.savedAt || null,
      },
    };
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

  private async validateProperty(propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return property;
  }
}