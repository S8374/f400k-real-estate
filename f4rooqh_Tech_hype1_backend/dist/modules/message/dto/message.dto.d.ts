export declare class CreateMessageDto {
    conversationId: string;
    content?: string;
    attachmentUrl?: string;
    attachmentType?: string;
}
export declare class StartConversationDto {
    participantId: string;
    propertyId?: string;
    initialMessage?: string;
}
export declare class TypingDto {
    conversationId: string;
    isTyping: boolean;
}
export declare class UpdateMessageDto {
    messageId: string;
    content: string;
}
export declare class DeleteMessageDto {
    messageId: string;
    conversationId?: string;
}
