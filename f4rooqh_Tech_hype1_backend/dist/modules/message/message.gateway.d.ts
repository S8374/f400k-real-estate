import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { CreateMessageDto, TypingDto, UpdateMessageDto, DeleteMessageDto } from './dto/message.dto';
export declare class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messageService;
    server: Server;
    private readonly logger;
    constructor(messageService: MessageService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleLogoutEvent(client: Socket): Promise<void>;
    handleJoinConversation(client: Socket, conversationId: string): {
        event: string;
        conversationId: string;
    };
    handleSendMessage(client: Socket, dto: CreateMessageDto): Promise<{
        sender: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        attachmentUrl: string | null;
        attachmentType: string | null;
        readAt: Date | null;
    }>;
    handleTyping(client: Socket, dto: TypingDto): void;
    handleMarkRead(client: Socket, conversationId: string): Promise<void>;
    handleGetOnlineUsers(client: Socket): Promise<any[]>;
    handleUpdateMessage(client: Socket, dto: UpdateMessageDto): Promise<{
        sender: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        attachmentUrl: string | null;
        attachmentType: string | null;
        readAt: Date | null;
    }>;
    handleDeleteMessage(client: Socket, dto: DeleteMessageDto): Promise<{
        messageId: string;
        success: boolean;
    }>;
}
