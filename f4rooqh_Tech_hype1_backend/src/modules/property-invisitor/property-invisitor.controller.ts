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
import { PropertyInvisitorService } from './property-invisitor.service';
import { CreatePropertyInvisitorDto } from './dto/create-property-invisitor.dto';
import { UpdatePropertyInvisitorDto } from './dto/update-property-invisitor.dto';
import { FilterPropertyInvisitorDto } from './dto/filter-property-invisitor.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('property-invisitors')
@Roles(Role.AGENT, Role.ADMIN)
export class PropertyInvisitorController {
  constructor(private readonly service: PropertyInvisitorService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreatePropertyInvisitorDto) {
    return this.service.create(createDto);
  }

  @Get()
  async findAll(@Query() filterDto: FilterPropertyInvisitorDto) {
    return this.service.findAll(filterDto);
  }

  @Get('property/:propertyId')
  async findByProperty(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Query() filterDto: FilterPropertyInvisitorDto,
  ) {
    return this.service.findByProperty(propertyId, filterDto);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filterDto: FilterPropertyInvisitorDto,
  ) {
    return this.service.findByUser(userId, filterDto);
  }



  @Patch('/update/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePropertyInvisitorDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }


}