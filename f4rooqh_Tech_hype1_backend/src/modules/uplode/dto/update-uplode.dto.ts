import { PartialType } from '@nestjs/mapped-types';
import { CreateUplodeDto } from './create-uplode.dto';

export class UpdateUplodeDto extends PartialType(CreateUplodeDto) {}
