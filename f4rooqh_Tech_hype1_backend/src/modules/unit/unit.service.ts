import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { FilterUnitDto } from './dto/filter-unit.dto';
import { Prisma, UnitStatus } from '@prisma/client';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUnitDto: CreateUnitDto) {
    const { propertyId, images, ...unitData } = createUnitDto;

    // Validate property exists
    const property = await this.validateProperty(propertyId);
    // ❌ If no available units
    if (!property.availableUnits || property.availableUnits <= 0) {
      throw new BadRequestException('No available units left for this property');
    }
    // Validate status for creation
    const allowedCreateStatuses: UnitStatus[] = [
      UnitStatus.AVAILABLE,
      UnitStatus.RENTED,
      UnitStatus.SELL,
      UnitStatus.UNDER_OFFER,
      UnitStatus.OFF_MARKET,
    ];

    if (unitData.status && !allowedCreateStatuses.includes(unitData.status)) {
      throw new BadRequestException(
        `Status ${unitData.status} is not allowed during creation. Allowed: ${allowedCreateStatuses.join(', ')}`,
      );
    }

    try {
      const unit = await this.prisma.unit.create({
        data: {
          propertyId,
          images: images || [],
          ...unitData,
          currency: unitData.currency || 'SAR',
          status: unitData.status || UnitStatus.AVAILABLE,
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              listingPurpose: true,
            },
          },
        },
      });

      // ✅ Decrease availableUnits
      if (property.availableUnits && property.availableUnits > 0) {
        await this.prisma.property.update({
          where: { id: propertyId },
          data: {
            availableUnits: {
              decrement: 1,
            },
          },
        });
      }

      return {
        success: true,
        message: 'Unit created successfully',
        data: unit,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid property ID');
        }
      }
      throw error;
    }
  }

  async findAll(filterDto: FilterUnitDto) {
    const {
      propertyId,
      status,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      isFeatured,
      isPricedOnRequest,
      search,
      page = 1,
      limit = 20,
      sortBy = 'unitNumber',
      sortOrder = 'asc',
    } = filterDto;

    const skip = (page - 1) * limit;

    const where: Prisma.UnitWhereInput = {};

    if (propertyId) where.propertyId = propertyId;
    if (status) where.status = status;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (minArea !== undefined || maxArea !== undefined) {
      where.areaSqm = {};
      if (minArea !== undefined) where.areaSqm.gte = minArea;
      if (maxArea !== undefined) where.areaSqm.lte = maxArea;
    }
    if (bedrooms !== undefined) where.bedrooms = bedrooms;
    if (bathrooms !== undefined) where.bathrooms = bathrooms;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (isPricedOnRequest !== undefined) where.isPricedOnRequest = isPricedOnRequest;

    if (search) {
      where.OR = [
        { unitNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [units, total] = await Promise.all([
      this.prisma.unit.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              listingPurpose: true,
            },
          },
          media: {
            take: 1,
            where: { isPrimary: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.unit.count({ where }),
    ]);

    return {
      success: true,
      data: units,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        media: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return {
      success: true,
      data: unit,
    };
  }



  async findByProperty(propertyId: string, filterDto: FilterUnitDto) {
    await this.validateProperty(propertyId);
    return this.findAll({ ...filterDto, propertyId });
  }



  async findFeatured(limit: number = 10) {
    const units = await this.prisma.unit.findMany({
      where: {
        isFeatured: true,
        status: UnitStatus.AVAILABLE,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
        media: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: limit,
    });

    return {
      success: true,
      data: units,
      count: units.length,
    };
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    await this.findOne(id);

    const { propertyId, images, ...updateData } = updateUnitDto as any;

    if (propertyId) {
      await this.validateProperty(propertyId);
    }

    // Validate status for update
    const allowedUpdateStatuses: UnitStatus[] = [
      UnitStatus.AVAILABLE,
      UnitStatus.RENTED,
      UnitStatus.SELL,
      UnitStatus.UNDER_OFFER,
      UnitStatus.OFF_MARKET,
      UnitStatus.RESERVED,
      UnitStatus.SOLD,
    ];

    if (updateData.status && !allowedUpdateStatuses.includes(updateData.status)) {
      throw new BadRequestException(
        `Status ${updateData.status} is not allowed during update. Allowed: ${allowedUpdateStatuses.join(', ')}`,
      );
    }

    try {
      const updatedUnit = await this.prisma.unit.update({
        where: { id },
        data: {
          ...updateData,
          ...(images && { images }),
          ...(propertyId && { propertyId }),
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Unit updated successfully',
        data: updatedUnit,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid property ID');
        }
      }
      throw error;
    }
  }

  async updateStatus(id: string, status: string) {
    const allowedUpdateStatuses: UnitStatus[] = [
      UnitStatus.AVAILABLE,
      UnitStatus.RENTED,
      UnitStatus.SELL,
      UnitStatus.UNDER_OFFER,
      UnitStatus.OFF_MARKET,
      UnitStatus.RESERVED,
      UnitStatus.SOLD,
    ];

    if (!allowedUpdateStatuses.includes(status as UnitStatus)) {
      throw new BadRequestException(
        `Status ${status} is not allowed. Allowed: ${allowedUpdateStatuses.join(', ')}`,
      );
    }

    await this.findOne(id);

    const updatedUnit = await this.prisma.unit.update({
      where: { id },
      data: { status: status as UnitStatus },
    });

    return {
      success: true,
      message: `Unit status updated to ${status}`,
      data: updatedUnit,
    };
  }



  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.unit.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Unit deleted successfully',
    };
  }

  async removeAllByProperty(propertyId: string) {
    await this.validateProperty(propertyId);

    const result = await this.prisma.unit.deleteMany({
      where: { propertyId },
    });

    return {
      success: true,
      message: `Successfully deleted ${result.count} units`,
      count: result.count,
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
}