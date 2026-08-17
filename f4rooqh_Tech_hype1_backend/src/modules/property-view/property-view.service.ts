import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { CreatePropertyViewDto, BulkCreatePropertyViewDto, ViewSource } from './dto/create-property-view.dto';
import { FilterPropertyViewDto, PropertyViewAnalyticsDto } from './dto/filter-property-view.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertyViewService {
  constructor(private readonly prisma: PrismaService) { }

  async track(createDto: CreatePropertyViewDto) {
    const { propertyId, userId, source, viewedAt } = createDto;

    // Validate property exists
    await this.validateProperty(propertyId);

    // If userId provided, validate user exists
    if (userId) {
      await this.validateUser(userId);
    }

    try {
      const view = await this.prisma.propertyView.create({
        data: {
          propertyId,
          userId,
          source: source || ViewSource.WEBSITE,
          viewedAt: viewedAt ? new Date(viewedAt) : new Date(),
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

      // Update property view count (optional - if you have a views counter)
      await this.prisma.property.update({
        where: { id: propertyId },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      return {
        success: true,
        message: 'Property view tracked successfully',
        data: view,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('Property not found');
        }
      }
      throw error;
    }
  }

 

  async findAll(filterDto: FilterPropertyViewDto) {
    const {
      propertyId,
      userId,
      source,
      fromDate,
      toDate,
      uniqueUsers,
      page = 1,
      limit = 50,
    } = filterDto;

    const skip = (page - 1) * limit;
    const where: Prisma.PropertyViewWhereInput = {};

    if (propertyId) where.propertyId = propertyId;
    if (userId) where.userId = userId;
    if (source) where.source = source;

    if (fromDate || toDate) {
      where.viewedAt = {};
      if (fromDate) where.viewedAt.gte = new Date(fromDate);
      if (toDate) where.viewedAt.lte = new Date(toDate);
    }

    // For unique users query
    if (uniqueUsers) {
      const uniqueUserViews = await this.prisma.propertyView.groupBy({
        by: ['userId', 'propertyId'],
        where,
        _count: true,
        _max: {
          viewedAt: true,
        },
      });

      return {
        success: true,
        data: uniqueUserViews,
        count: uniqueUserViews.length,
      };
    }

    const [views, total] = await Promise.all([
      this.prisma.propertyView.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              currency: true,
              images: true,
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          viewedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.propertyView.count({ where }),
    ]);

    return {
      success: true,
      data: views,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const view = await this.prisma.propertyView.findUnique({
      where: { id },
      include: {
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
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!view) {
      throw new NotFoundException(`Property view with ID ${id} not found`);
    }

    return {
      success: true,
      data: view,
    };
  }

  async findByProperty(propertyId: string, filterDto: FilterPropertyViewDto) {
    await this.validateProperty(propertyId);
    return this.findAll({ ...filterDto, propertyId });
  }

  async findByUser(userId: string, filterDto: FilterPropertyViewDto) {
    await this.validateUser(userId);
    return this.findAll({ ...filterDto, userId });
  }

  async getPropertyStats(propertyId: string) {
    await this.validateProperty(propertyId);

    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    const monthAgo = new Date(now.setDate(now.getDate() - 30));

    const [
      totalViews,
      todayViews,
      weekViews,
      monthViews,
      uniqueViewers,
      sourceBreakdown,
    ] = await Promise.all([
      this.prisma.propertyView.count({ where: { propertyId } }),
      this.prisma.propertyView.count({ where: { propertyId, viewedAt: { gte: today } } }),
      this.prisma.propertyView.count({ where: { propertyId, viewedAt: { gte: weekAgo } } }),
      this.prisma.propertyView.count({ where: { propertyId, viewedAt: { gte: monthAgo } } }),
      this.prisma.propertyView.groupBy({
        by: ['userId'],
        where: { propertyId, userId: { not: null } },
        _count: true,
      }),
      this.prisma.propertyView.groupBy({
        by: ['source'],
        where: { propertyId },
        _count: true,
      }),
      this.getDailyViews(7, propertyId),
    ]);

    return {
      success: true,
      data: {
        propertyId,
        totalViews,
        todayViews,
        weekViews,
        monthViews,
        uniqueViewers: uniqueViewers.length,
        sourceBreakdown: sourceBreakdown.map(item => ({
          source: item.source,
          count: item._count,
        })),
      },
    };
  }





  async getTrendingProperties(days: number = 7, limit: number = 10) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const trending = await this.prisma.propertyView.groupBy({
      by: ['propertyId'],
      where: {
        viewedAt: {
          gte: since,
        },
      },
      _count: {
        propertyId: true,
      },
      orderBy: {
        _count: {
          propertyId: 'desc',
        },
      },
      take: limit,
    });

    // Get property details
    const propertyIds = trending.map(item => item.propertyId);
    const properties = await this.prisma.property.findMany({
      where: {
        id: { in: propertyIds },
      },
      include: {
        media: {
          where: { isPrimary: true },
          take: 1,
        },
        agent: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    const result = trending.map(item => ({
      ...properties.find(p => p.id === item.propertyId),
      viewCount: item._count.propertyId,
      period: `${days} days`,
    }));

    return {
      success: true,
      data: result,
    };
  }



  async getDailyViews(days: number = 30, propertyId?: string) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const where: Prisma.PropertyViewWhereInput = {
      viewedAt: { gte: since },
    };
    if (propertyId) where.propertyId = propertyId;

    const views = await this.prisma.propertyView.findMany({
      where,
      select: {
        viewedAt: true,
      },
      orderBy: {
        viewedAt: 'asc',
      },
    });

    // Group by day
    const dailyData = {};
    views.forEach(view => {
      const date = view.viewedAt.toISOString().split('T')[0];
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    // Fill in missing days
    const result: { date: string; count: number }[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(since);
      date.setDate(date.getDate() + i + 1);
      const dateStr = date.toISOString().split('T')[0];

      result.push({
        date: dateStr,
        count: dailyData[dateStr] || 0,
      });
    }

    return result;
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