import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  Patch,
  Delete,
  Version,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { StartConversationDto, UpdateMessageDto, DeleteMessageDto } from './dto/message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('conversation')
  async startConversation(@Req() req: any, @Body() dto: StartConversationDto) {
    const userId = req.user.userId;
    return this.messageService.startConversation(userId, dto);
  }

  @Get('conversations')
  async getConversations(@Req() req: any) {
    const userId = req.user.userId;
    return this.messageService.getConversations(userId);
  }

  @Get('history/:conversationId')
  async getHistory(
    @Req() req: any,
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user.userId;
    return this.messageService.getMessageHistory(userId, conversationId, limit);
  }

  @Post('edit-message/:id')
  async updateMessage(
    @Req() req: any,
    @Param('id') messageId: string,
    @Body('content') content: string,
  ) {
    const userId = req.user.userId;
    return this.messageService.updateMessage(userId, { messageId, content });
  }

  @Post('remove-message/:id')
  async deleteMessage(@Req() req: any, @Param('id') messageId: string) {
    const userId = req.user.userId;
    return this.messageService.deleteMessage(userId, { messageId });
  }
}
