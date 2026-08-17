import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ZoneService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ZoneCreateInput) {
    return this.prisma.zone.create({ data });
  }

  async findAll(onlyActive: boolean = true) {
    const where = onlyActive ? { isActive: true } : {};
    return this.prisma.zone.findMany({
      where,
      include: { 
        children: { where },
        _count: { select: { properties: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const zone = await this.prisma.zone.findUnique({ where: { id } });
    if (!zone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }
    return zone;
  }

  async update(id: string, data: Prisma.ZoneUpdateInput) {
    await this.findOne(id); // Ensure exists
    return this.prisma.zone.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    return this.prisma.zone.delete({ where: { id } });
  }
}
