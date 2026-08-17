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
  UseGuards,
} from '@nestjs/common';
import { VerifiedService } from './verified.service';
import { VerifyAgentDto, VerifyPropertyDto, VerificationFilterDto } from './dto/create-verified.dto';
import { UpdateVerifiedDto } from './dto/update-verified.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Role } from '@prisma/client';

@Controller('verified')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN) // Only admin can access these endpoints
export class VerifiedController {
  constructor(private readonly verifiedService: VerifiedService) { }

  // ============ Agent Verification ============

  @Get('agents/pending')
  async getPendingAgents() {
    return this.verifiedService.getPendingAgents();
  }

  @Get('agents/verified')
  async getVerifiedAgents() {
    return this.verifiedService.getVerifiedAgents();
  }

  @Get('agents/:agentId')
  async getAgentVerificationStatus(@Param('agentId', ParseUUIDPipe) agentId: string) {
    return this.verifiedService.getAgentVerificationStatus(agentId);
  }

  @Post('agents/verify')
  @HttpCode(HttpStatus.OK)
  async verifyAgent(@Body() verifyAgentDto: VerifyAgentDto) {
    return this.verifiedService.verifyAgent(verifyAgentDto);
  }

  // ============ Property Verification ============

  @Get('properties/pending')
  async getPendingProperties() {
    return this.verifiedService.getPendingProperties();
  }

  @Get('properties/verified')
  async getVerifiedProperties() {
    return this.verifiedService.getVerifiedProperties();
  }

  @Get('properties/:propertyId')
  async getPropertyVerificationStatus(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.verifiedService.getPropertyVerificationStatus(propertyId);
  }

  @Post('properties/verify')
  @HttpCode(HttpStatus.OK)
  async verifyProperty(@Body() verifyPropertyDto: VerifyPropertyDto) {
    return this.verifiedService.verifyProperty(verifyPropertyDto);
  }

  // ============ Combined Views ============

  @Get('all')
  async getAllVerificationStatus(@Query() filterDto: VerificationFilterDto) {
    return this.verifiedService.getAllVerificationStatus(filterDto);
  }

  @Get('stats')
  async getVerificationStats() {
    return this.verifiedService.getVerificationStats();
  }

  @Get('agent/:agentId/properties')
  async getAgentPropertiesVerification(@Param('agentId', ParseUUIDPipe) agentId: string) {
    return this.verifiedService.getAgentPropertiesVerification(agentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.verifiedService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateVerifiedDto: UpdateVerifiedDto) {
    return this.verifiedService.update(id, updateVerifiedDto);
  }

}