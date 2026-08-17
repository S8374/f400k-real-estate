import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { CreateMessageDto, TypingDto, UpdateMessageDto, DeleteMessageDto } from './dto/message.dto';
import { UseFilters, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { verifyToken } from '../../helper/jwt/jwtHelper';
import { config } from '../../config/config.index';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Specify explicit origins for credentials support
    credentials: true,
  },
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessageGateway.name);

  constructor(private readonly messageService: MessageService) { }

  async handleConnection(client: Socket) {
    try {
      let token = client.handshake.auth?.token || client.handshake.headers?.authorization;

      // Extract from cookies if not in auth/headers
      if (!token && client.handshake.headers.cookie) {
        const cookies = client.handshake.headers.cookie.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as any);
        token = cookies['accessToken'];
      }

      if (!token) {
        this.logger.warn('Connection attempt without token');
        client.disconnect();
        return;
      }

      const cleanToken = token.replace('Bearer ', '');
      const payload: any = verifyToken(cleanToken, config.jwt.jwt_secret);

      client.data.userId = payload.userId;
      client.data.role = payload.role;

      // Mark user as online
      await this.messageService.updateUserStatus(payload.userId, true);

      // Get all currently online users from the server's connected sockets
      const connectedSockets = await this.server.fetchSockets();
      const onlineUserIds = Array.from(new Set(connectedSockets.map(s => s.data.userId).filter(Boolean)));

      // Join user to their personal room for targeted updates
      const userRoom = `user:${payload.userId}`;
      await client.join(userRoom);
      this.logger.log(`Client ${client.id} joined personal room: ${userRoom}`);

      // Send the list to the new client
      client.emit('onlineUsers', onlineUserIds);

      // Broadcast online status to others
      client.broadcast.emit('statusUpdate', { userId: payload.userId, isOnline: true });

      this.logger.log(`Client connected: ${payload.userId}`);
    } catch (error) {
      this.logger.error('Connection error:', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      // Check if the user has any OTHER active connections
      const connectedSockets = await this.server.fetchSockets();
      const stillConnected = connectedSockets.some(s => s.data.userId === userId && s.id !== client.id);

      if (!stillConnected) {
        // Only mark as offline if no more connections exist
        await this.messageService.updateUserStatus(userId, false);

        // Broadcast offline status to others
        this.server.emit('statusUpdate', { 
          userId, 
          isOnline: false, 
          lastActive: new Date() 
        });

        this.logger.log(`User fully disconnected and marked offline: ${userId}`);
      } else {
        this.logger.log(`Client disconnected for user ${userId}, but other sessions remain active.`);
      }
    }
  }

  @SubscribeMessage('logout')
  async handleLogoutEvent(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.logger.log(`User explicitly logging out: ${userId}`);
      
      // Mark as offline in DB immediately
      await this.messageService.updateUserStatus(userId, false);
      
      // Broadcast offline status to everyone
      this.server.emit('statusUpdate', { 
        userId, 
        isOnline: false, 
        lastActive: new Date() 
      });
      
      // Cleanly disconnect the client
      client.disconnect();
    }
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: string,
  ) {
    client.join(`conversation:${conversationId}`);
    return { event: 'joined', conversationId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateMessageDto,
  ) {
    const userId = client.data.userId;
    const message = await this.messageService.saveMessage(userId, dto);

    // Fetch the conversation to get all participants
    const conversation = await this.messageService.getConversationById(dto.conversationId);
    
    if (conversation) {
      const participants = conversation.participants;
      this.logger.log(`Broadcasting message to ${participants.length} participants in conversation ${dto.conversationId}`);
      
      // Emit to each participant's personal room
      participants.forEach(participant => {
        const room = `user:${participant.id}`;
        this.server.to(room).emit('newMessage', message);
        this.logger.log(`Emitted newMessage to room: ${room}`);
      });
    } else {
      this.logger.error(`Conversation ${dto.conversationId} not found during sendMessage`);
      // Fallback: emit to current room if conversation fetch failed
      this.server.to(`conversation:${dto.conversationId}`).emit('newMessage', message);
    }

    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: TypingDto,
  ) {
    const userId = client.data.userId;
    // Broadcast typing status to others in the room
    client.to(`conversation:${dto.conversationId}`).emit('userTyping', {
      userId,
      conversationId: dto.conversationId,
      isTyping: dto.isTyping,
    });
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody('conversationId') conversationId: string,
  ) {
    const userId = client.data.userId;
    await this.messageService.markAsRead(userId, conversationId);

    // Notify other participants that messages were read
    client.to(`conversation:${conversationId}`).emit('messagesRead', {
      conversationId,
      userId,
      readAt: new Date(),
    });
  }

  @SubscribeMessage('getOnlineUsers')
  async handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const connectedSockets = await this.server.fetchSockets();
    const onlineUserIds = Array.from(new Set(connectedSockets.map(s => s.data.userId).filter(Boolean)));
    client.emit('onlineUsers', onlineUserIds);
    return onlineUserIds;
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: UpdateMessageDto,
  ) {
    try {
      const userId = client.data.userId;
      const message = await this.messageService.updateMessage(userId, dto);
      const conversationId = (message as any).conversationId;

      const conversation = await this.messageService.getConversationById(conversationId);
      if (conversation) {
        conversation.participants.forEach(participant => {
          this.server.to(`user:${participant.id}`).emit('messageUpdated', message);
        });
      }

      return message;
    } catch (error) {
      this.logger.error(`Update message error: ${error.message}`);
      throw error;
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: DeleteMessageDto,
  ) {
    try {
      const userId = client.data.userId;
      const deletedData: any = await this.messageService.deleteMessage(userId, dto);
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
    } catch (error) {
      this.logger.error(`Delete message error: ${error.message}`);
      throw error;
    }
  }
}
