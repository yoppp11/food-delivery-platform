import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ChatRoomType,
  ChatRoomStatus,
  MessageType,
  MessageStatus,
  SupportCategory,
  TicketPriority,
} from "@prisma/client";
import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
  IsUUID,
} from "class-validator";

export class CreateChatRoomDto {
  @ApiProperty({ description: "Order ID for order-based chats" })
  @IsString()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ enum: ChatRoomType })
  @IsEnum(ChatRoomType)
  type!: ChatRoomType;
}

export class CloseChatRoomDto {
  @ApiPropertyOptional({ description: "Reason for closing the chat" })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  reason?: string;
}

export class ChatRoomQueryDto {
  @ApiPropertyOptional({ enum: ChatRoomStatus })
  @IsEnum(ChatRoomStatus)
  @IsOptional()
  status?: ChatRoomStatus;

  @ApiPropertyOptional({ enum: ChatRoomType })
  @IsEnum(ChatRoomType)
  @IsOptional()
  type?: ChatRoomType;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}

export class SendMessageDto {
  @ApiProperty({ description: "Chat room ID" })
  @IsUUID()
  chatRoomId!: string;

  @ApiProperty({ description: "Message content" })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;

  @ApiPropertyOptional({ enum: MessageType, default: MessageType.TEXT })
  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType = MessageType.TEXT;

  @ApiPropertyOptional({
    description: "Metadata for special message types (images, location)",
  })
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: "Client-generated message ID for deduplication",
  })
  @IsString()
  @IsOptional()
  clientMessageId?: string;
}

export class MessageQueryDto {
  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  limit?: number = 50;

  @ApiPropertyOptional({ description: "Cursor for pagination (message ID)" })
  @IsString()
  @IsOptional()
  before?: string;

  @ApiPropertyOptional({
    description: "Cursor for newer messages (message ID)",
  })
  @IsString()
  @IsOptional()
  after?: string;
}

export class MarkAsReadDto {
  @ApiPropertyOptional({ description: "Last message ID that was read (optional - marks all as read if not provided)" })
  @IsUUID()
  @IsOptional()
  lastReadMessageId?: string;
}

export class CreateSupportTicketDto {
  @ApiProperty({ description: "Subject of the support ticket" })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  subject!: string;

  @ApiPropertyOptional({
    enum: SupportCategory,
    default: SupportCategory.GENERAL,
  })
  @IsEnum(SupportCategory)
  @IsOptional()
  category?: SupportCategory = SupportCategory.GENERAL;

  @ApiPropertyOptional({ description: "Related order ID (optional)" })
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional({ description: "Initial message content" })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  initialMessage?: string;
}

export class UpdateTicketDto {
  @ApiPropertyOptional({ enum: TicketPriority })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiPropertyOptional({
    enum: [
      "OPEN",
      "IN_PROGRESS",
      "WAITING_CUSTOMER",
      "WAITING_ADMIN",
      "RESOLVED",
      "CLOSED",
    ],
  })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: "Resolution note" })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  resolution?: string;
}

export class AssignTicketDto {
  @ApiProperty({ description: "Admin user ID to assign the ticket to" })
  @IsUUID()
  adminId!: string;
}

export class TicketQueryDto {
  @ApiPropertyOptional({
    enum: [
      "OPEN",
      "IN_PROGRESS",
      "WAITING_CUSTOMER",
      "WAITING_ADMIN",
      "RESOLVED",
      "CLOSED",
    ],
  })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ enum: SupportCategory })
  @IsEnum(SupportCategory)
  @IsOptional()
  category?: SupportCategory;

  @ApiPropertyOptional({ enum: TicketPriority })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiPropertyOptional({ description: "Filter by assigned admin ID" })
  @IsUUID()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  limit?: number = 20;
}

export class PaginatedResponse<T> {
  data!: T[];
  meta!: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export class MessageResponse {
  id!: string;
  chatRoomId!: string;
  senderId!: string;
  content!: string;
  type!: MessageType;
  status!: MessageStatus;
  metadata?: Record<string, unknown>;
  createdAt!: Date;
  sender?: {
    id: string;
    email: string;
    image?: string;
  };
}

export class ChatRoomResponse {
  id!: string;
  orderId?: string;
  ticketId?: string;
  type!: ChatRoomType;
  status!: ChatRoomStatus;
  title?: string;
  lastMessageAt?: Date;
  createdAt!: Date;
  participants!: Array<{
    id: string;
    userId: string;
    role: string;
    user: {
      id: string;
      email: string;
      image?: string;
    };
  }>;
  unreadCount?: number;
  lastMessage?: MessageResponse;
}
