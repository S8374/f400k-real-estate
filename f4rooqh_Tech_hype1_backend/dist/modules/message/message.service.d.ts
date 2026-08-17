import { PrismaService } from '../../common/context/prisma.service';
import { CreateMessageDto, StartConversationDto, UpdateMessageDto, DeleteMessageDto } from './dto/message.dto';
export declare class MessageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    startConversation(userId: string, dto: StartConversationDto): Promise<{
        participants: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            isOnline: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        propertyId: string | null;
    }>;
    saveMessage(senderId: string, dto: CreateMessageDto): Promise<{
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
    getConversations(userId: string): Promise<({
        property: {
            id: string;
            title: string;
            price: number;
        } | null;
        participants: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
            lastActive: Date | null;
            isOnline: boolean;
        }[];
        messages: {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            content: string | null;
            attachmentUrl: string | null;
            attachmentType: string | null;
            readAt: Date | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        propertyId: string | null;
    })[]>;
    getMessageHistory(userId: string, conversationId: string, limit?: number): Promise<({
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
    })[]>;
    updateUserStatus(userId: string, isOnline: boolean): Promise<{
        id: string;
        email: string;
        phoneNumber: string | null;
        password: string | null;
        fullName: string | null;
        avatarUrl: string | null;
        nationality: string | null;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        verifiedAt: Date | null;
        lastLogin: Date | null;
        lastActive: Date | null;
        isOnline: boolean;
    }>;
    markAsRead(userId: string, conversationId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    updateMessage(userId: string, dto: UpdateMessageDto): Promise<{
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
    deleteMessage(userId: string, dto: DeleteMessageDto): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string | null;
        attachmentUrl: string | null;
        attachmentType: string | null;
        readAt: Date | null;
    } | {
        id: string;
        success: boolean;
    }>;
    getConversationById(id: string): Promise<({
        participants: {
            id: string;
            fullName: string | null;
            avatarUrl: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        propertyId: string | null;
    }) | null>;
}
