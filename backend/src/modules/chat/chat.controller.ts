import { Controller, Get, Post, Body, Param, Query, Req } from "@nestjs/common";
import { ChatService } from "./chat.service";
import type { SendMessageDto } from "./chat.service";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { User, ChatRoomType } from "@prisma/client";

@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("rooms")
  @ApiOperation({ summary: "Get all chat rooms for the current user" })
  async getChatRooms(@Req() request: { user: User }) {
    return this.chatService.getChatRoomsForUser(request.user.id);
  }

  @Get("rooms/:id")
  @ApiOperation({ summary: "Get a specific chat room by ID" })
  async getChatRoom(@Param("id") id: string, @Req() request: { user: User }) {
    return this.chatService.getChatRoomById(id, request.user.id);
  }

  @Post("rooms")
  @ApiOperation({ summary: "Create or get a chat room for an order" })
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

  @Get("rooms/:id/messages")
  @ApiOperation({ summary: "Get messages from a chat room" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "before", required: false, type: String })
  async getMessages(
    @Param("id") chatRoomId: string,
    @Query("limit") limit?: string,
    @Query("before") before?: string,
    @Req() request?: { user: User },
  ) {
    return this.chatService.getMessages(
      chatRoomId,
      request!.user.id,
      limit ? parseInt(limit, 10) : 50,
      before,
    );
  }

  @Post("messages")
  @ApiOperation({ summary: "Send a message to a chat room" })
  async sendMessage(
    @Body() body: SendMessageDto,
    @Req() request: { user: User },
  ) {
    return this.chatService.sendMessage(request.user.id, body);
  }

  @Post("rooms/:id/read")
  @ApiOperation({ summary: "Mark all messages in a chat room as read" })
  async markAsRead(
    @Param("id") chatRoomId: string,
    @Req() request: { user: User },
  ) {
    await this.chatService.markMessagesAsRead(chatRoomId, request.user.id);
    return { success: true };
  }

  @Get("unread-count")
  @ApiOperation({ summary: "Get total unread message count" })
  async getUnreadCount(@Req() request: { user: User }) {
    const count = await this.chatService.getUnreadCount(request.user.id);
    return { count };
  }

  @Get("order/:orderId")
  @ApiOperation({ summary: "Get chat room for a specific order" })
  @ApiQuery({ name: "type", required: true, enum: ChatRoomType })
  async getChatRoomForOrder(
    @Param("orderId") orderId: string,
    @Query("type") type: ChatRoomType,
    @Req() request: { user: User },
  ) {
    return this.chatService.getChatRoomForOrder(orderId, type, request.user.id);
  }

  @Get("order/:orderId/status")
  @ApiOperation({ summary: "Get chat availability status for an order" })
  async getChatStatus(
    @Param("orderId") orderId: string,
    @Req() request: { user: User },
  ): Promise<{
    canChatWithMerchant: boolean;
    canChatWithDriver: boolean;
    orderStatus: string;
  }> {
    return await this.chatService.getChatStatus(orderId, request.user.id);
  }
}
