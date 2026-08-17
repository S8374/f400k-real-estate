import { Controller, Post, Get, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('subscriber')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Public()
  @Post('subscribe')
  async subscribe(@Body('email') email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    return await this.subscriberService.subscribe(email);
  }

  @Get()
  async getSubscribers() {
    return await this.subscriberService.getSubscribers();
  }

  @Delete(':id')
  async removeSubscriber(@Param('id') id: string) {
    return await this.subscriberService.remove(id);
  }
}
