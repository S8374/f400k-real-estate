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
import { KycDocumentService } from './kyc-document.service';
import { CreateKycDocumentDto, AdminVerifyKycDto } from './dto/create-kyc-document.dto';
import { UpdateKycDocumentDto } from './dto/update-kyc-document.dto';
import { FilterKycDocumentDto } from './dto/filter-kyc-document.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('kyc-documents')
export class KycDocumentController {
  constructor(private readonly service: KycDocumentService) { }

  // User uploads KYC document
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.BUYER, Role.AGENT)
  async upload(@Body() createDto: CreateKycDocumentDto) {
    return this.service.upload(createDto);
  }

  // Admin verifies/rejects document
  @Post('verify')
  @Roles(Role.ADMIN)
  async verify(@Body() verifyDto: AdminVerifyKycDto) {
    return this.service.verify(verifyDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() filterDto: FilterKycDocumentDto) {
    return this.service.findAll(filterDto);
  }

  @Get('user/:userId')
  @Roles(Role.BUYER, Role.AGENT, Role.ADMIN)
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filterDto: FilterKycDocumentDto,
  ) {
    return this.service.findByUser(userId, filterDto);
  }


  @Get('user/:userId/stats')
  @Roles(Role.BUYER, Role.AGENT, Role.ADMIN)
  async getUserStats(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.getUserStats(userId);
  }

  @Get('user/:userId/status')
  @Roles(Role.BUYER, Role.AGENT, Role.ADMIN)
  async getUserKycStatus(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.getUserKycStatus(userId);
  }



  @Patch(':id')
  @Roles(Role.BUYER, Role.AGENT)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateKycDocumentDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.BUYER, Role.AGENT, Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }


}