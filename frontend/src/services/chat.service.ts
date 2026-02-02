import { apiClient, type PaginatedResponse } from '@/lib/api-client';
import type {
  ChatRoom,
  ChatMessage,
  ChatRoomType,
  ChatRoomStatus,
  SupportTicket,
  SupportCategory,
  TicketPriority,
  TicketStatus,
  MessageType,
} from '@/types';

export interface GetChatRoomsParams {
  page?: number;
  limit?: number;
  status?: ChatRoomStatus;
  type?: ChatRoomType;
}

export interface ChatRoomsResponse {
  rooms: ChatRoom[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GetMessagesParams {
  limit?: number;
  before?: string;
  after?: string;
}

export interface MessagesResponse {
  messages: ChatMessage[];
  hasMore: boolean;
  cursor?: string;
}

export interface CreateChatRoomInput {
  orderId: string;
  type: ChatRoomType;
}

export interface SendMessageInput {
  content: string;
  type?: MessageType;
  metadata?: Record<string, unknown>;
  clientMessageId?: string;
  replyToId?: string;
}

export interface CreateSupportTicketInput {
  category: SupportCategory;
  subject: string;
  orderId?: string;
  initialMessage?: string;
}

export interface UpdateTicketInput {
  priority?: TicketPriority;
  status?: TicketStatus;
}

export interface CloseChatRoomInput {
  reason?: string;
}

export interface ChatStatusResponse {
  canChatWithMerchant: boolean;
  canChatWithDriver: boolean;
  orderStatus: string;
  merchantChatRoom?: ChatRoom | null;
  driverChatRoom?: ChatRoom | null;
}

export interface UnreadCountResponse {
  total: number;
  byRoom: Record<string, number>;
}

export interface TicketStatsResponse {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  avgResolutionTime: number;
}

export const chatService = {
  async getChatRooms(params?: GetChatRoomsParams): Promise<ChatRoomsResponse> {
    return apiClient.get<ChatRoomsResponse>('/chat/rooms', params as Record<string, string | number | boolean>);
  },

  async getChatRoomById(roomId: string): Promise<ChatRoom | null> {
    return apiClient.get<ChatRoom | null>(`/chat/rooms/${roomId}`);
  },

  async createChatRoom(data: CreateChatRoomInput): Promise<ChatRoom> {
    return apiClient.post<ChatRoom>('/chat/rooms', data);
  },

  async closeChatRoom(roomId: string, data?: CloseChatRoomInput): Promise<ChatRoom> {
    return apiClient.post<ChatRoom>(`/chat/rooms/${roomId}/close`, data);
  },

  async getMessages(roomId: string, params?: GetMessagesParams): Promise<MessagesResponse> {
    return apiClient.get<MessagesResponse>(`/chat/rooms/${roomId}/messages`, params as Record<string, string | number | boolean>);
  },

  async sendMessage(roomId: string, data: SendMessageInput): Promise<ChatMessage> {
    return apiClient.post<ChatMessage>('/chat/messages', {
      chatRoomId: roomId,
      ...data,
    });
  },

  async markMessagesAsRead(roomId: string, lastReadMessageId?: string): Promise<void> {
    return apiClient.post(`/chat/rooms/${roomId}/read`, { lastReadMessageId });
  },

  async getChatRoomForOrder(orderId: string, type: ChatRoomType): Promise<ChatRoom | null> {
    return apiClient.get<ChatRoom | null>(`/chat/order/${orderId}`, { type });
  },

  async getChatStatus(orderId: string): Promise<ChatStatusResponse> {
    return apiClient.get<ChatStatusResponse>(`/chat/order/${orderId}/status`);
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    return apiClient.get<UnreadCountResponse>('/chat/unread-count');
  },

  async createSupportTicket(data: CreateSupportTicketInput): Promise<{ ticket: SupportTicket; chatRoom: ChatRoom }> {
    return apiClient.post<{ ticket: SupportTicket; chatRoom: ChatRoom }>('/chat/support/tickets', data);
  },

  async getMyTickets(): Promise<SupportTicket[]> {
    return apiClient.get<SupportTicket[]>('/chat/support/my-tickets');
  },

  async getAllTickets(params?: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedToId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<SupportTicket>> {
    return apiClient.get<PaginatedResponse<SupportTicket>>('/chat/admin/tickets', params as Record<string, string | number | boolean>);
  },

  async assignTicket(ticketId: string, assigneeId?: string): Promise<SupportTicket> {
    return apiClient.post<SupportTicket>(`/chat/admin/tickets/${ticketId}/assign`, { assigneeId });
  },

  async updateTicket(ticketId: string, data: UpdateTicketInput): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`/chat/admin/tickets/${ticketId}`, data);
  },

  async resolveTicket(ticketId: string, resolution: string): Promise<SupportTicket> {
    return apiClient.post<SupportTicket>(`/chat/admin/tickets/${ticketId}/resolve`, { resolution });
  },

  async getTicketStats(): Promise<TicketStatsResponse> {
    return apiClient.get<TicketStatsResponse>('/chat/admin/stats');
  },
};

export default chatService;
