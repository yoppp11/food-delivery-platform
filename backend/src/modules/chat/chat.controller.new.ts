import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ChatService } from "./chat.service.new";
import { ChatGateway } from "./chat.gateway.new";
import {
  SendMessageDto,
  CreateSupportTicketDto,
  ChatRoomQueryDto,
  MessageQueryDto,
  CloseChatRoomDto,
  MarkAsReadDto,
} from "./dto/chat.dto";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { User, ChatRoomType } from "@prisma/client";

@ApiTags("chat")
@ApiBearerAuth()
@Controller("chat")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get("rooms")
  @ApiOperation({ summary: "Get all chat rooms for the current user" })
  @ApiResponse({
    status: 200,
    description: "List of chat rooms with pagination",
  })
  async getChatRooms(
    @Query() query: ChatRoomQueryDto,
    @Req() request: { user: User },
  ) {
    return this.chatService.getChatRoomsForUser(request.user.id, query);
  }

  @Get("rooms/:id")
  @ApiOperation({ summary: "Get a specific chat room by ID" })
  @ApiResponse({ status: 200, description: "Chat room details with messages" })
  @ApiResponse({ status: 404, description: "Chat room not found" })
  async getChatRoom(@Param("id") id: string, @Req() request: { user: User }) {
    const room = await this.chatService.getChatRoomById(id, request.user.id);
    if (!room) {
      throw new HttpException("Chat room not found", HttpStatus.NOT_FOUND);
    }
    return room;
  }

  @Post("rooms")
  @ApiOperation({ summary: "Create or get a chat room for an order" })
  @ApiResponse({ status: 201, description: "Chat room created" })
  @ApiResponse({ status: 200, description: "Existing chat room returned" })
  @ApiResponse({ status: 403, description: "Cannot create chat room" })
  async getOrCreateChatRoom(
    @Body() body: { orderId: string; type: ChatRoomType },
    @Req() request: { user: User },
  ) {
    return this.chatService.getOrCreateChatRoom(
      body.orderId,
      body.type,
      request.user.id,
    );
  }

  @Post("rooms/:id/close")
  @ApiOperation({ summary: "Close a chat room" })
  @ApiResponse({ status: 200, description: "Chat room closed" })
  async closeChatRoom(
    @Param("id") chatRoomId: string,
    @Body() body: CloseChatRoomDto,
    @Req() request: { user: User },
  ) {
    return this.chatService.closeChatRoom(
      chatRoomId,
      request.user.id,
      body.reason,
    );
  }

  @Get("rooms/:id/messages")
  @ApiOperation({ summary: "Get messages from a chat room" })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of messages (default 50)",
  })
  @ApiQuery({
    name: "before",
    required: false,
    type: String,
    description: "Cursor for older messages",
  })
  @ApiQuery({
    name: "after",
    required: false,
    type: String,
    description: "Cursor for newer messages",
  })
  @ApiResponse({ status: 200, description: "List of messages with pagination" })
  async getMessages(
    @Param("id") chatRoomId: string,
    @Query() query: MessageQueryDto,
    @Req() request: { user: User },
  ) {
    return this.chatService.getMessages(chatRoomId, request.user.id, query);
  }

  @Post("messages")
  @ApiOperation({ summary: "Send a message to a chat room" })
  @ApiResponse({ status: 201, description: "Message sent" })
  @ApiResponse({ status: 403, description: "Chat is closed" })
  async sendMessage(
    @Body() body: SendMessageDto,
    @Req() request: { user: User },
  ) {
    const message = await this.chatService.sendMessage(request.user.id, body);
    
    // Broadcast message to all participants in the chat room via WebSocket
    this.chatGateway.broadcastToChatRoom(body.chatRoomId, "chat:message", {
      ...message,
      clientMessageId: body.clientMessageId,
    });
    
    // Also notify offline participants
    const room = await this.chatService.getChatRoomById(body.chatRoomId, request.user.id);
    if (room) {
      const participantIds = room.participants.map((p) => p.userId);
      participantIds.forEach((userId) => {
        if (userId !== request.user.id) {
          this.chatGateway.notifyUser(userId, "chat:notification", {
            type: "new-message",
            chatRoomId: body.chatRoomId,
            preview: message.content.substring(0, 100),
            senderId: request.user.id,
            timestamp: new Date().toISOString(),
          });
        }
      });
    }
    
    return message;
  }

  @Post("rooms/:id/read")
  @ApiOperation({ summary: "Mark messages as read" })
  @ApiResponse({ status: 200, description: "Messages marked as read" })
  async markAsRead(
    @Param("id") chatRoomId: string,
    @Body() body: MarkAsReadDto,
    @Req() request: { user: User },
  ) {
    return this.chatService.markMessagesAsRead(
      chatRoomId,
      request.user.id,
      body.lastReadMessageId,
    );
  }

  @Get("unread-count")
  @ApiOperation({ summary: "Get total unread message count" })
  @ApiResponse({ status: 200, description: "Unread count" })
  async getUnreadCount(@Req() request: { user: User }) {
    const count = await this.chatService.getUnreadCount(request.user.id);
    return { count };
  }

  @Get("order/:orderId")
  @ApiOperation({ summary: "Get chat room for a specific order" })
  @ApiQuery({ name: "type", required: true, enum: ChatRoomType })
  @ApiResponse({ status: 200, description: "Chat room for order" })
  async getChatRoomForOrder(
    @Param("orderId") orderId: string,
    @Query("type") type: ChatRoomType,
    @Req() request: { user: User },
  ) {
    return this.chatService.getChatRoomForOrder(orderId, type, request.user.id);
  }

  @Get("order/:orderId/status")
  @ApiOperation({ summary: "Get chat availability status for an order" })
  @ApiResponse({ status: 200, description: "Chat status for order" })
  async getChatStatus(
    @Param("orderId") orderId: string,
    @Req() request: { user: User },
  ) {
    return this.chatService.getChatStatus(orderId, request.user.id);
  }

  @Post("support/tickets")
  @ApiOperation({ summary: "Create a new support ticket" })
  @ApiResponse({
    status: 201,
    description: "Support ticket created with chat room",
  })
  async createSupportTicket(
    @Body() body: CreateSupportTicketDto,
    @Req() request: { user: User },
  ) {
    return this.chatService.createSupportTicket(request.user.id, body);
  }

  @Get("support/my-tickets")
  @ApiOperation({ summary: "Get current user's support tickets" })
  @ApiResponse({ status: 200, description: "List of user's support tickets" })
  async getMyTickets(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Req() request?: { user: User },
  ) {
    const result = await this.chatService.getSupportTickets({
      page: page || 1,
      limit: limit || 10,
    });

    return {
      ...result,
      data: result.data.filter((t) => t.customerId === request!.user.id),
    };
  }
}
