import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { FilterUnitDto } from './dto/filter-unit.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.AGENT, Role.ADMIN)
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }
  //  add all   

  
  @Get('/all')
  @Public()
  findAll(@Query() filterDto: FilterUnitDto) {
    return this.unitService.findAll(filterDto);
  }

  @Get('property/:propertyId')
  @Public()
  findByProperty(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Query() filterDto: FilterUnitDto,
  ) {
    return this.unitService.findByProperty(propertyId, filterDto);
  }


  @Get('featured')
  @Public()
  findFeatured(@Query('limit') limit?: string) {
    return this.unitService.findFeatured(limit ? parseInt(limit) : 10);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitService.findOne(id);
  }


  @Patch('/update/:id')
  @Roles(Role.AGENT, Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitService.update(id, updateUnitDto);
  }

  @Patch('/update-status/:id')
  @Roles(Role.AGENT, Role.ADMIN)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
  ) {
    return this.unitService.updateStatus(id, status);
  }


  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.AGENT, Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitService.remove(id);
  }

  @Delete('property/:propertyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.AGENT, Role.ADMIN)
  removeAllByProperty(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.unitService.removeAllByProperty(propertyId);
  }
}