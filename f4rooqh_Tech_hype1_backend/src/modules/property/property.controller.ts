import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus, Query, Logger } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { SearchPropertyDto } from './dto/search-property.dto';
import { Role } from '@prisma/client';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.AGENT, Role.ADMIN)
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @Get('/all')
  @Public()
  async findAll(@Query() searchDto: SearchPropertyDto) {
    return this.propertyService.findAll(searchDto);
  }

  @Get('/categories')
  @Public()
  async getAllPropertyTypes() {
    return this.propertyService.getAllPropertyTypes();
  }

  @Get('/admin/stats/:adminId')
  @Roles(Role.ADMIN)
  async getAdminStats(@Param('adminId', ParseUUIDPipe) adminId: string) {
    return this.propertyService.getAdminStats(adminId);
  }


  @Get('/:id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertyService.findOne(id);
  }

  @Patch('/update/:id')
  @Roles(Role.AGENT, Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePropertyDto: UpdatePropertyDto
  ) {
    return this.propertyService.update(id, updatePropertyDto);
  }





  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.AGENT, Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertyService.remove(id);
  }
}