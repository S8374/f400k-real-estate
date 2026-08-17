import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/context/prisma.service';
import { CreateMessageDto, StartConversationDto, UpdateMessageDto, DeleteMessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) { }

  async startConversation(userId: string, dto: StartConversationDto) {
    const { participantId, propertyId, initialMessage } = dto;

    if (userId === participantId) {
      throw new BadRequestException('You cannot start a conversation with yourself.');
    }

    // Professionals only: 1 Agent + 1 Buyer = 1 Conversation.
    // We ignore propertyId in the search to prevent "double conversations" for the same pair.
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: userId } } },
          { participants: { some: { id: participantId } } },
        ],
      },
      include: {
        participants: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            isOnline: true,
          },
        },
      },
    });

    if (!conversation) {
      // Create new conversation
      conversation = await this.prisma.conversation.create({
        data: {
          propertyId: propertyId || null,
          participants: {
            connect: [{ id: userId }, { id: participantId }],
          },
        },
        include: {
          participants: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              isOnline: true,
            },
          },
        },
      });

      // If initial message provided, save it
      if (initialMessage) {
        await this.saveMessage(userId, {
          conversationId: conversation.id,
          content: initialMessage,
        });
      }
    }

    return conversation;
  }

  async saveMessage(senderId: string, dto: CreateMessageDto) {
    const { conversationId, content, attachmentUrl, attachmentType } = dto;
    console.log(`[MessageService] saveMessage called. senderId: ${senderId}, conversationId: ${conversationId}`);

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }

    const isParticipant = conversation.participants.some((p) => p.id === senderId);
    if (!isParticipant) {
      throw new BadRequestException('You are not a participant in this conversation.');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: content ?? null,
        attachmentUrl,
        attachmentType,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation's updatedAt to sort by most recent
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: { some: { id: userId } },
      },
      include: {
        participants: {
          where: { id: { not: userId } }, // Only show other participants
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            isOnline: true,
            lastActive: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessageHistory(userId: string, conversationId: string, limit = 50) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { id: userId } },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found or access denied.');
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return messages.reverse();
  }

  async updateUserStatus(userId: string, isOnline: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isOnline,
        lastActive: new Date(),
      },
    });
  }

  async markAsRead(userId: string, conversationId: string) {
    return this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  async updateMessage(userId: string, dto: UpdateMessageDto) {
    const { messageId, content } = dto;
    console.log(`[MessageService] updateMessage called. userId: ${userId}, messageId: ${messageId}`);

    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      console.log(`[MessageService] Message ${messageId} not found`);
      throw new NotFoundException('Message not found.');
    }

    console.log(`[MessageService] Comparing senderId ${message.senderId} with userId ${userId}`);
    if (message.senderId !== userId) {
      console.log(`[MessageService] Permission denied. senderId != userId`);
      throw new BadRequestException('You can only edit your own messages.');
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: { content },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation's updatedAt
    await this.prisma.conversation.update({
      where: { id: updatedMessage.conversationId },
      data: { updatedAt: new Date() },
    });

    return updatedMessage;
  }

  async deleteMessage(userId: string, dto: DeleteMessageDto) {
    const { messageId } = dto;
    console.log(`[MessageService] deleteMessage called. userId: ${userId}, messageId: ${messageId}`);

    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      console.log(`[MessageService] Message ${messageId} already gone or not found. Returning success.`);
      return { id: messageId, success: true };
    }

    if (message.senderId !== userId) {
      throw new BadRequestException('You can only delete your own messages.');
    }

    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }

  async getConversationById(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}
