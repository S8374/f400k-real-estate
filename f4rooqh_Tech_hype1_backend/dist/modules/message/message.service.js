"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/context/prisma.service");
let MessageService = class MessageService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async startConversation(userId, dto) {
        const { participantId, propertyId, initialMessage } = dto;
        if (userId === participantId) {
            throw new common_1.BadRequestException('You cannot start a conversation with yourself.');
        }
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
            if (initialMessage) {
                await this.saveMessage(userId, {
                    conversationId: conversation.id,
                    content: initialMessage,
                });
            }
        }
        return conversation;
    }
    async saveMessage(senderId, dto) {
        const { conversationId, content, attachmentUrl, attachmentType } = dto;
        console.log(`[MessageService] saveMessage called. senderId: ${senderId}, conversationId: ${conversationId}`);
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: true },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found.');
        }
        const isParticipant = conversation.participants.some((p) => p.id === senderId);
        if (!isParticipant) {
            throw new common_1.BadRequestException('You are not a participant in this conversation.');
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
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });
        return message;
    }
    async getConversations(userId) {
        return this.prisma.conversation.findMany({
            where: {
                participants: { some: { id: userId } },
            },
            include: {
                participants: {
                    where: { id: { not: userId } },
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
    async getMessageHistory(userId, conversationId, limit = 50) {
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                participants: { some: { id: userId } },
            },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found or access denied.');
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
    async updateUserStatus(userId, isOnline) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                isOnline,
                lastActive: new Date(),
            },
        });
    }
    async markAsRead(userId, conversationId) {
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
    async updateMessage(userId, dto) {
        const { messageId, content } = dto;
        console.log(`[MessageService] updateMessage called. userId: ${userId}, messageId: ${messageId}`);
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            console.log(`[MessageService] Message ${messageId} not found`);
            throw new common_1.NotFoundException('Message not found.');
        }
        console.log(`[MessageService] Comparing senderId ${message.senderId} with userId ${userId}`);
        if (message.senderId !== userId) {
            console.log(`[MessageService] Permission denied. senderId != userId`);
            throw new common_1.BadRequestException('You can only edit your own messages.');
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
        await this.prisma.conversation.update({
            where: { id: updatedMessage.conversationId },
            data: { updatedAt: new Date() },
        });
        return updatedMessage;
    }
    async deleteMessage(userId, dto) {
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
            throw new common_1.BadRequestException('You can only delete your own messages.');
        }
        return this.prisma.message.delete({
            where: { id: messageId },
        });
    }
    async getConversationById(id) {
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
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessageService);
//# sourceMappingURL=message.service.js.map