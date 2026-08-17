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
  Query
} from '@nestjs/common';
import { PropertyAttributeService } from './property-attribute.service';
import { CreatePropertyAttributeDto } from './dto/create-property-attribute.dto';
import { UpdatePropertyAttributeDto } from './dto/update-property-attribute.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('property-attributes')
export class PropertyAttributeController {
  constructor(private readonly propertyAttributeService: PropertyAttributeService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.AGENT, Role.ADMIN)
  create(@Body() createPropertyAttributeDto: CreatePropertyAttributeDto) {
    return this.propertyAttributeService.create(createPropertyAttributeDto);
  }

  @Get()
  @Public()
  findAll(@Query('propertyId') propertyId?: string) {
    if (propertyId) {
      return this.propertyAttributeService.findByProperty(propertyId);
    }
    return this.propertyAttributeService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertyAttributeService.findOne(id);
  }

  @Get('property/:propertyId')
  @Public()
  findByProperty(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.propertyAttributeService.findByProperty(propertyId);
  }

  @Patch('/update/:id')
  @Roles(Role.AGENT, Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePropertyAttributeDto: UpdatePropertyAttributeDto
  ) {
    return this.propertyAttributeService.update(id, updatePropertyAttributeDto);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.AGENT, Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertyAttributeService.remove(id);
  }




}