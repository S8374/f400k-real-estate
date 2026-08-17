import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SavedListingService } from './save-property.service';
import { CreateSavedListingDto } from './dto/create-save-property.dto';
import { FilterSavedListingDto } from './dto/filter-saved.dto';

@Controller('property')
export class SavedListingController {
  constructor(private readonly service: SavedListingService) { }

  @Post('/saved')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateSavedListingDto) {
    return this.service.create(createDto);
  }

  @Post('/unsaved')
  async toggle(@Body() createDto: CreateSavedListingDto) {
    return this.service.toggle(createDto);
  }

  @Get()
  async findAll(@Query() filterDto: FilterSavedListingDto) {
    return this.service.findAll(filterDto);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filterDto: FilterSavedListingDto,
  ) {
    return this.service.findByUser(userId, filterDto);
  }

  @Get('check')
  async checkSaved(
    @Query('userId', ParseUUIDPipe) userId: string,
    @Query('propertyId', ParseUUIDPipe) propertyId: string,
  ) {
    return this.service.checkSaved(userId, propertyId);
  }

  @Get(':userId/:propertyId')
  async findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
  ) {
    return this.service.findOne(userId, propertyId);
  }



}