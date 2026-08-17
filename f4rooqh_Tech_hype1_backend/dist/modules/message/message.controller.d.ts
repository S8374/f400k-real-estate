import { MessageService } from './message.service';
import { StartConversationDto } from './dto/message.dto';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    startConversation(req: any, dto: StartConversationDto): Promise<{
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
    getConversations(req: any): Promise<({
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
    getHistory(req: any, conversationId: string, limit?: number): Promise<({
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
    updateMessage(req: any, messageId: string, content: string): Promise<{
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
    deleteMessage(req: any, messageId: string): Promise<{
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
}
