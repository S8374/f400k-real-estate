import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @IsString()
  @IsOptional()
  attachmentType?: string;
}

export class StartConversationDto {
  @IsUUID()
  @IsNotEmpty()
  participantId: string; // The user to start conversation with

  @IsUUID()
  @IsOptional()
  propertyId?: string; // Optional property link

  @IsString()
  @IsOptional()
  initialMessage?: string;
}

export class TypingDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  isTyping: boolean;
}

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class DeleteMessageDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsOptional()
  conversationId?: string;
}
