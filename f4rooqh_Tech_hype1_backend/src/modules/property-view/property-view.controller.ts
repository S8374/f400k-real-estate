import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PropertyViewService } from './property-view.service';
import { CreatePropertyViewDto, BulkCreatePropertyViewDto } from './dto/create-property-view.dto';
import { FilterPropertyViewDto, PropertyViewAnalyticsDto } from './dto/filter-property-view.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('property-views')
@Public()
export class PropertyViewController {
  constructor(private readonly service: PropertyViewService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async track(@Body() createDto: CreatePropertyViewDto) {
    return this.service.track(createDto);
  }


  @Get()
  async findAll(@Query() filterDto: FilterPropertyViewDto) {
    return this.service.findAll(filterDto);
  }


  @Get('property/:propertyId')
  async findByProperty(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Query() filterDto: FilterPropertyViewDto,
  ) {
    return this.service.findByProperty(propertyId, filterDto);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filterDto: FilterPropertyViewDto,
  ) {
    return this.service.findByUser(userId, filterDto);
  }

  @Get('property/:propertyId/stats')
  async getPropertyStats(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.service.getPropertyStats(propertyId);
  }



  @Get('trending')
  async getTrendingProperties(
    @Query('days') days: number = 7,
    @Query('limit') limit: number = 10,
  ) {
    return this.service.getTrendingProperties(days, limit);
  }




  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}