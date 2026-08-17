import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { CreatePropertyInvisitorDto, Relationship, IdType } from './dto/create-property-invisitor.dto';
import { UpdatePropertyInvisitorDto } from './dto/update-property-invisitor.dto';
import { FilterPropertyInvisitorDto } from './dto/filter-property-invisitor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertyInvisitorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreatePropertyInvisitorDto) {
    const { propertyId, userId, ...visitorData } = createDto;

    // Validate property exists
    await this.validateProperty(propertyId);

    // If userId provided, validate user exists
    if (userId) {
      await this.validateUser(userId);
    }

    // Check if property already has an invisitor (unique constraint)
    const existing = await this.prisma.propertyInvisitor.findUnique({
      where: { propertyId },
    });

    if (existing) {
      throw new ConflictException('This property already has an invisitor assigned');
    }

    try {
      const invisitor = await this.prisma.propertyInvisitor.create({
        data: {
          propertyId,
          userId,
          ...visitorData,
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
            },
          },
          user: userId ? {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          } : undefined,
        },
      });

      return {
        success: true,
        message: 'Property invisitor created successfully',
        data: invisitor,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('This property already has an invisitor');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Property or User not found');
        }
      }
      throw error;
    }
  }

  async findAll(filterDto: FilterPropertyInvisitorDto) {
    const {
      propertyId,
      userId,
      name,
      email,
      phoneNumber,
      relationship,
      idType,
      hasIdDocument,
      isRegistered,
      page = 1,
      limit = 20,
    } = filterDto;

    const skip = (page - 1) * limit;
    const where: Prisma.PropertyInvisitorWhereInput = {};

    if (propertyId) where.propertyId = propertyId;
    if (userId) where.userId = userId;
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }
    if (email) where.email = email;
    if (phoneNumber) where.phoneNumber = phoneNumber;
    if (relationship) where.relationship = relationship;
    if (idType) where.idType = idType;
    if (hasIdDocument) {
      where.AND = [
        { idNumber: { not: null } },
        { idType: { not: null } },
      ];
    }
    if (isRegistered !== undefined) {
      where.userId = isRegistered ? { not: null } : null;
    }

    const [invisors, total] = await Promise.all([
      this.prisma.propertyInvisitor.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              addressLine: true,
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.propertyInvisitor.count({ where }),
    ]);

    return {
      success: true,
      data: invisors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const invisitor = await this.prisma.propertyInvisitor.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            addressLine: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
    });

    if (!invisitor) {
      throw new NotFoundException(`Property invisitor with ID ${id} not found`);
    }

    return {
      success: true,
      data: invisitor,
    };
  }



  async findByProperty(propertyId: string, filterDto: FilterPropertyInvisitorDto) {
    await this.validateProperty(propertyId);
    return this.findAll({ ...filterDto, propertyId });
  }

  async findByUser(userId: string, filterDto: FilterPropertyInvisitorDto) {
    await this.validateUser(userId);
    return this.findAll({ ...filterDto, userId });
  }


  async update(id: string, updateDto: UpdatePropertyInvisitorDto) {
    await this.findOne(id);

    const { propertyId, userId, ...updateData } = updateDto;

    if (propertyId) {
      await this.validateProperty(propertyId);
      
      // Check if new property already has an invisitor
      if (propertyId) {
        const existing = await this.prisma.propertyInvisitor.findUnique({
          where: { propertyId },
        });
        if (existing && existing.id !== id) {
          throw new ConflictException('Target property already has an invisitor');
        }
      }
    }

    if (userId) {
      await this.validateUser(userId);
    }

    const updated = await this.prisma.propertyInvisitor.update({
      where: { id },
      data: {
        ...updateData,
        ...(propertyId && { propertyId }),
        ...(userId && { userId }),
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
          },
        },
        user: userId ? {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        } : undefined,
      },
    });

    return {
      success: true,
      message: 'Property invisitor updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.propertyInvisitor.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Property invisitor deleted successfully',
    };
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

  private async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}