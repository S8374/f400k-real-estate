import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { AgentUploadDto, AgentReviewDto } from '../milestone-payment/dto/agent-action.dto';
import { MarkAsReadDto } from '../milestone-payment/dto/mark-as-read.dto';
import { FilterMilestonePaymentDto } from '../milestone-payment/dto/filter-milestone-payment.dto';
import { AgentMilestonePaymentService } from './agent.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('agent/milestone-payments')
@Roles(Role.AGENT)
export class AgentMilestonePaymentController {
  constructor(private readonly service: AgentMilestonePaymentService) { }

  @Get('pending')
  async getPendingPayments(
    @Query('agentId') agentId: string,
    @Query() filterDto: FilterMilestonePaymentDto,
  ) {
    return this.service.getPendingPayments(agentId, filterDto);
  }

  @Get('unread')
  async getUnreadCount(@Query('agentId') agentId: string) {
    return this.service.getUnreadCount(agentId);
  }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  async uploadDocument(@Body() dto: AgentUploadDto) {
    return this.service.uploadDocument(dto);
  }

  @Post('review')
  async reviewPayment(@Body() dto: AgentReviewDto) {
    return this.service.reviewPayment(dto);
  }

  @Post('mark-read')
  async markAsRead(@Body() dto: MarkAsReadDto) {
    return this.service.markAsRead(dto);
  }

  // Get agent performance stats
  @Get(':agentId/performance')
  @UseGuards(AuthGuard)
  async getPerformance(
    @Param('agentId', new ParseUUIDPipe()) agentId: string,
  ) {
    const data = await this.service.getAgentPerformance(agentId);
    return {
      success: true,
      message: 'Agent performance stats fetched successfully',
      data,
    };
  }

  @Get('/my/:agentId')
  async findByAgent(
    @Param('agentId', ParseUUIDPipe) agentId: string,
  ) {
    return this.service.findByAgent(agentId);
  }
  @Get('/agent/:agentId/dashboard-stats')
  @Roles(Role.AGENT, Role.ADMIN)
  async getAgentDashboardStats(
    @Param('agentId', ParseUUIDPipe) agentId: string,
  ) {
    return this.service.getAgentDashboardStats(agentId);
  }
  @Get(':id')
  async getPaymentDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('agentId') agentId: string,
  ) {
    return this.service.getPaymentDetails(id, agentId);
  }
}