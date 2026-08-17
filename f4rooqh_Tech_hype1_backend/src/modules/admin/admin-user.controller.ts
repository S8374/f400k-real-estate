import { 
    Controller, 
    Get, 
    Patch, 
    Delete,
    Body, 
    Param, 
    Query, 
    ParseUUIDPipe 
  } from '@nestjs/common';
  import { AdminUserService } from './admin-user.service';
  import { Roles } from '../../common/decorators/roles.decorator';
  import { Role, UserStatus } from '@prisma/client';
  
  @Controller('admin/users')
  @Roles(Role.ADMIN)
  export class AdminUserController {
    constructor(private readonly adminUserService: AdminUserService) {}
  
    /**
     * List all users with filtering and stats
     */
    @Get(':adminId')
    async getAllUsers(
      @Param('adminId', ParseUUIDPipe) adminId: string,
      @Query('page') page?: string,
      @Query('limit') limit?: string,
      @Query('search') search?: string,
      @Query('role') role?: Role,
      @Query('status') status?: UserStatus,
    ) {
      return this.adminUserService.getAllUsers(adminId, {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        search,
        role,
        status,
      });
    }
  
    /**
     * Get specific user details
     */
    @Get('details/:userId')
    async getUserDetails(@Param('userId', ParseUUIDPipe) userId: string) {
      return this.adminUserService.getUserDetails(userId);
    }
  
    /**
     * Update user status (Block/Unblock/Activate)
     */
    @Patch(':userId/status')
    async updateStatus(
      @Param('userId', ParseUUIDPipe) userId: string,
      @Body('status') status: UserStatus,
    ) {
      return this.adminUserService.updateUserStatus(userId, status);
    }
  
    /**
     * Delete user
     */
    @Delete(':userId')
    async deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
      return this.adminUserService.deleteUser(userId);
    }
  }
