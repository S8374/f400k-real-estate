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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MessageGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const message_service_1 = require("./message.service");
const message_dto_1 = require("./dto/message.dto");
const common_1 = require("@nestjs/common");
const jwtHelper_1 = require("../../helper/jwt/jwtHelper");
const config_index_1 = require("../../config/config.index");
let MessageGateway = MessageGateway_1 = class MessageGateway {
    messageService;
    server;
    logger = new common_1.Logger(MessageGateway_1.name);
    constructor(messageService) {
        this.messageService = messageService;
    }
    async handleConnection(client) {
        try {
            let token = client.handshake.auth?.token || client.handshake.headers?.authorization;
            if (!token && client.handshake.headers.cookie) {
                const cookies = client.handshake.headers.cookie.split(';').reduce((acc, cookie) => {
                    const [key, value] = cookie.trim().split('=');
                    acc[key] = value;
                    return acc;
                }, {});
                token = cookies['accessToken'];
            }
            if (!token) {
                this.logger.warn('Connection attempt without token');
                client.disconnect();
                return;
            }
            const cleanToken = token.replace('Bearer ', '');
            const payload = (0, jwtHelper_1.verifyToken)(cleanToken, config_index_1.config.jwt.jwt_secret);
            client.data.userId = payload.userId;
            client.data.role = payload.role;
            await this.messageService.updateUserStatus(payload.userId, true);
            const connectedSockets = await this.server.fetchSockets();
            const onlineUserIds = Array.from(new Set(connectedSockets.map(s => s.data.userId).filter(Boolean)));
            const userRoom = `user:${payload.userId}`;
            await client.join(userRoom);
            this.logger.log(`Client ${client.id} joined personal room: ${userRoom}`);
            client.emit('onlineUsers', onlineUserIds);
            client.broadcast.emit('statusUpdate', { userId: payload.userId, isOnline: true });
            this.logger.log(`Client connected: ${payload.userId}`);
        }
        catch (error) {
            this.logger.error('Connection error:', error.message);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        const userId = client.data.userId;
        if (userId) {
            const connectedSockets = await this.server.fetchSockets();
            const stillConnected = connectedSockets.some(s => s.data.userId === userId && s.id !== client.id);
            if (!stillConnected) {
                await this.messageService.updateUserStatus(userId, false);
                this.server.emit('statusUpdate', {
                    userId,
                    isOnline: false,
                    lastActive: new Date()
                });
                this.logger.log(`User fully disconnected and marked offline: ${userId}`);
            }
            else {
                this.logger.log(`Client disconnected for user ${userId}, but other sessions remain active.`);
            }
        }
    }
    async handleLogoutEvent(client) {
        const userId = client.data.userId;
        if (userId) {
            this.logger.log(`User explicitly logging out: ${userId}`);
            await this.messageService.updateUserStatus(userId, false);
            this.server.emit('statusUpdate', {
                userId,
                isOnline: false,
                lastActive: new Date()
            });
            client.disconnect();
        }
    }
    handleJoinConversation(client, conversationId) {
        client.join(`conversation:${conversationId}`);
        return { event: 'joined', conversationId };
    }
    async handleSendMessage(client, dto) {
        const userId = client.data.userId;
        const message = await this.messageService.saveMessage(userId, dto);
        const conversation = await this.messageService.getConversationById(dto.conversationId);
        if (conversation) {
            const participants = conversation.participants;
            this.logger.log(`Broadcasting message to ${participants.length} participants in conversation ${dto.conversationId}`);
            participants.forEach(participant => {
                const room = `user:${participant.id}`;
                this.server.to(room).emit('newMessage', message);
                this.logger.log(`Emitted newMessage to room: ${room}`);
            });
        }
        else {
            this.logger.error(`Conversation ${dto.conversationId} not found during sendMessage`);
            this.server.to(`conversation:${dto.conversationId}`).emit('newMessage', message);
        }
        return message;
    }
    handleTyping(client, dto) {
        const userId = client.data.userId;
        client.to(`conversation:${dto.conversationId}`).emit('userTyping', {
            userId,
            conversationId: dto.conversationId,
            isTyping: dto.isTyping,
        });
    }
    async handleMarkRead(client, conversationId) {
        const userId = client.data.userId;
        await this.messageService.markAsRead(userId, conversationId);
        client.to(`conversation:${conversationId}`).emit('messagesRead', {
            conversationId,
            userId,
            readAt: new Date(),
        });
    }
    async handleGetOnlineUsers(client) {
        const connectedSockets = await this.server.fetchSockets();
        const onlineUserIds = Array.from(new Set(connectedSockets.map(s => s.data.userId).filter(Boolean)));
        client.emit('onlineUsers', onlineUserIds);
        return onlineUserIds;
    }
    async handleUpdateMessage(client, dto) {
        try {
            const userId = client.data.userId;
            const message = await this.messageService.updateMessage(userId, dto);
            const conversationId = message.conversationId;
            const conversation = await this.messageService.getConversationById(conversationId);
            if (conversation) {
                conversation.participants.forEach(participant => {
                    this.server.to(`user:${participant.id}`).emit('messageUpdated', message);
                });
            }
            return message;
        }
        catch (error) {
            this.logger.error(`Update message error: ${error.message}`);
            throw error;
        }
    }
    async handleDeleteMessage(client, dto) {
        try {
            const userId = client.data.userId;
            const deletedData = await this.messageService.deleteMessage(userId, dto);
            const conversationId = deletedData?.conversationId || dto.conversationId;
            if (conversationId) {
                const conversation = await this.messageService.getConversationById(conversationId);
                if (conversation) {
                    conversation.participants.forEach(participant => {
                        this.server.to(`user:${participant.id}`).emit('messageDeleted', {
                            messageId: dto.messageId,
                            conversationId: conversationId,
                        });
                    });
                }
            }
            return { messageId: dto.messageId, success: true };
        }
        catch (error) {
            this.logger.error(`Delete message error: ${error.message}`);
            throw error;
        }
    }
};
exports.MessageGateway = MessageGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('logout'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleLogoutEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        message_dto_1.TypingDto]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markRead'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleMarkRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getOnlineUsers'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleGetOnlineUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        message_dto_1.UpdateMessageDto]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleUpdateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        message_dto_1.DeleteMessageDto]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleDeleteMessage", null);
exports.MessageGateway = MessageGateway = MessageGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3001', 'http://localhost:3000'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageGateway);
//# sourceMappingURL=message.gateway.js.map