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
  Query
} from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('developers')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  create(@Body() createDeveloperDto: CreateDeveloperDto) {
    return this.developerService.create(createDeveloperDto);
  }

  @Get('/get')
  @Public()
  findAll(@Query('includeProjects') includeProjects?: string) {
    return this.developerService.findAll(includeProjects === 'true');
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeProjects') includeProjects?: string
  ) {
    return this.developerService.findOne(id, includeProjects === 'true');
  }

  @Patch('/update/:id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeveloperDto: UpdateDeveloperDto
  ) {
    return this.developerService.update(id, updateDeveloperDto);
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.developerService.remove(id);
  }

  @Get('search/:name')
  @Public()
  searchByName(@Param('name') name: string) {
    return this.developerService.searchByName(name);
  }

}