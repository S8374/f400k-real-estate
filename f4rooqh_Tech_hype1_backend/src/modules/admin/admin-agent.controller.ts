import { 
    Controller, 
    Get, 
    Patch, 
    Body, 
    Param, 
    Query, 
    ParseUUIDPipe, 
    UseGuards 
  } from '@nestjs/common';
  import { AdminAgentService } from './admin-agent.service';
  import { Roles } from '../../common/decorators/roles.decorator';
import { Role, UserStatus } from '@prisma/client';
  
  @Controller('admin/agents')
  @Roles(Role.ADMIN)
  export class AdminAgentController {
    constructor(private readonly adminAgentService: AdminAgentService) {}
  
    /**
     * Get global agent stats for dashboard cards
     */
    @Get('stats/:adminId')
    async getAgentStats(@Param('adminId', ParseUUIDPipe) adminId: string) {
      return this.adminAgentService.getAgentStats(adminId);
    }
  
    /**
     * List all agents with their profile and property performance
     */
    @Get(':adminId')
    async getAllAgents(
      @Param('adminId', ParseUUIDPipe) adminId: string,
      @Query('page') page?: string,
      @Query('limit') limit?: string,
      @Query('search') search?: string,
    ) {
      return this.adminAgentService.getAllAgents(adminId, {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search,
      });
    }
  
    /**
     * Block or Unblock an agent
     */
    @Patch(':userId/status')
    async updateStatus(
      @Param('userId', ParseUUIDPipe) userId: string,
      @Body('status') status: UserStatus,
    ) {
      return this.adminAgentService.updateAgentStatus(userId, status);
    }
  }
