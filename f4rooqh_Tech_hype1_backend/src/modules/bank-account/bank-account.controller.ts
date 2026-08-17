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
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { FilterBankAccountDto } from './dto/filter-bank-account.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('bank-accounts')
@Roles(Role.AGENT, Role.ADMIN)
export class BankAccountController {
  constructor(private readonly service: BankAccountService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateBankAccountDto) {
    return this.service.create(createDto);
  }

  @Get()
  async findAll(@Query() filterDto: FilterBankAccountDto) {
    return this.service.findAll(filterDto);
  }

  @Get('property/:propertyId')
  async findByProperty(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Query() filterDto: FilterBankAccountDto,
  ) {
    return this.service.findByProperty(propertyId, filterDto);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filterDto: FilterBankAccountDto,
  ) {
    return this.service.findByUser(userId, filterDto);
  }

  @Patch('/update/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateBankAccountDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

}