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
import { MilestoneService } from './milestone.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { FilterMilestoneDto } from './dto/filter-milestone.dto';
import { MilestoneTrigger } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('milestones')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.AGENT, Role.ADMIN)
  create(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestoneService.create(createMilestoneDto);
  }

  @Post('plan/:planId/reorder')
  @Roles(Role.AGENT, Role.ADMIN)
  reorder(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Body() items: { id: string; milestoneOrder: number }[],
  ) {
    return this.milestoneService.reorder(planId, items);
  }

  @Get()
  @Public()
  findAll(@Query() filterDto: FilterMilestoneDto) {
    return this.milestoneService.findAll(filterDto);
  }

  @Get('plan/:planId')
  @Public()
  findByPlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Query() filterDto: FilterMilestoneDto,
  ) {
    return this.milestoneService.findByPlan(planId, filterDto);
  }



  @Get('upcoming')
  @Public()
  findUpcoming(@Query('days') days?: number) {
    return this.milestoneService.findUpcoming(days ? +days : 30);
  }

  @Get('plan/:planId/summary')
  @Public()
  getPlanSummary(@Param('planId', ParseUUIDPipe) planId: string) {
    return this.milestoneService.getPlanSummary(planId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.milestoneService.findOne(id);
  }

  @Patch('/update/:id')
  @Roles(Role.AGENT, Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.milestoneService.update(id, updateMilestoneDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.AGENT, Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.milestoneService.remove(id);
  }

  @Delete('plan/:planId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.AGENT, Role.ADMIN)
  removeAllByPlan(@Param('planId', ParseUUIDPipe) planId: string) {
    return this.milestoneService.removeAllByPlan(planId);
  }
}