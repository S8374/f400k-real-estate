import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { Prisma } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@Controller('zones')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Post()
  create(@Body() createZoneDto: Prisma.ZoneCreateInput) {
    return this.zoneService.create(createZoneDto);
  }

  @Public()
  @Get()
  findAll(@Query('all') all?: string) {
    const onlyActive = all !== 'true';
    return this.zoneService.findAll(onlyActive);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zoneService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZoneDto: Prisma.ZoneUpdateInput) {
    return this.zoneService.update(id, updateZoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zoneService.remove(id);
  }
}
