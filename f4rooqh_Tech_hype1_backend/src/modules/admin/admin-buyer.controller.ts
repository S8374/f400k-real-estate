import { 
    Controller, 
    Get, 
    Patch, 
    Body, 
    Param, 
    Query, 
    ParseUUIDPipe 
  } from '@nestjs/common';
  import { AdminBuyerService } from './admin-buyer.service';
  import { Roles } from '../../common/decorators/roles.decorator';
import { Role, UserStatus } from '@prisma/client';
  
  @Controller('admin/buyers')
  @Roles(Role.ADMIN)
  export class AdminBuyerController {
    constructor(private readonly adminBuyerService: AdminBuyerService) {}
  
    /**
     * Get global buyer stats for dashboard cards
     */
    @Get('stats/:adminId')
    async getBuyerStats(@Param('adminId', ParseUUIDPipe) adminId: string) {
      return this.adminBuyerService.getBuyerStats(adminId);
    }
  
    /**
     * List all buyers with their profile and activity performance
     */
    @Get(':adminId')
    async getAllBuyers(
      @Param('adminId', ParseUUIDPipe) adminId: string,
      @Query('page') page?: string,
      @Query('limit') limit?: string,
      @Query('search') search?: string,
    ) {
      return this.adminBuyerService.getAllBuyers(adminId, {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search,
      });
    }
  
    /**
     * Block or Unblock a buyer
     */
    @Patch(':userId/status')
    async updateStatus(
      @Param('userId', ParseUUIDPipe) userId: string,
      @Body('status') status: UserStatus,
    ) {
      return this.adminBuyerService.updateBuyerStatus(userId, status);
    }
  }
