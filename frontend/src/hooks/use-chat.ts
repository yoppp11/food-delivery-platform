import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { chatService, type GetChatRoomsParams, type GetMessagesParams, type CreateSupportTicketInput } from '@/services/chat.service';
import type { ChatRoom, ChatMessage, ChatRoomType, TicketStatus, TicketPriority } from '@/types';

interface SendMessageInput {
  chatRoomId: string;
  content: string;
  type?: 'TEXT' | 'IMAGE' | 'LOCATION';
  metadata?: Record<string, unknown>;
  clientMessageId?: string;
  replyToId?: string;
}

interface CreateChatRoomInput {
  orderId: string;
  type: ChatRoomType;
}


export function useChatRooms(params?: GetChatRoomsParams) {
  return useQuery({
    queryKey: [...queryKeys.chat.rooms(), params],
    queryFn: () => chatService.getChatRooms(params),
  });
}

export function useChatRoom(id: string) {
  return useQuery({
    queryKey: queryKeys.chat.room(id),
    queryFn: () => chatService.getChatRoomById(id),
    enabled: !!id,
  });
}

export function useChatRoomForOrder(orderId: string, type: ChatRoomType) {
  return useQuery({
    queryKey: queryKeys.chat.orderRoom(orderId, type),
    queryFn: () => chatService.getChatRoomForOrder(orderId, type),
    enabled: !!orderId && !!type,
  });
}

export function useChatStatus(orderId: string) {
  return useQuery({
    queryKey: queryKeys.chat.status(orderId),
    queryFn: () => chatService.getChatStatus(orderId),
    enabled: !!orderId,
    refetchInterval: 10000,
  });
}

export function useCreateChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChatRoomInput) => chatService.createChatRoom(data),
    onSuccess: (newRoom) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
      queryClient.setQueryData(queryKeys.chat.room(newRoom.id), newRoom);
      if (newRoom.orderId) {
        queryClient.setQueryData(
          queryKeys.chat.orderRoom(newRoom.orderId, newRoom.type),
          newRoom
        );
      }
    },
  });
}

export function useCloseChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, reason }: { roomId: string; reason?: string }) =>
      chatService.closeChatRoom(roomId, { reason }),
    onSuccess: (updatedRoom) => {
      queryClient.setQueryData(queryKeys.chat.room(updatedRoom.id), updatedRoom);
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
    },
  });
}

export function useChatMessages(roomId: string, params?: GetMessagesParams) {
  return useQuery({
    queryKey: queryKeys.chat.messages(roomId),
    queryFn: async () => {
      const response = await chatService.getMessages(roomId, params);
      return response;
    },
    enabled: !!roomId,
  });
}

export function useChatMessagesInfinite(roomId: string, limit = 50) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.chat.messages(roomId), 'infinite'],
    queryFn: ({ pageParam }) =>
      chatService.getMessages(roomId, { limit, before: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.cursor : undefined,
    enabled: !!roomId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageInput) =>
      chatService.sendMessage(data.chatRoomId, {
        content: data.content,
        type: data.type,
        metadata: data.metadata,
        clientMessageId: data.clientMessageId,
        replyToId: data.replyToId,
      }),
    onSuccess: (newMessage, variables) => {
      const roomId = newMessage.chatRoomId || variables.chatRoomId;
      
      queryClient.setQueryData<ChatMessage[] | { messages: ChatMessage[]; hasMore: boolean }>(
        queryKeys.chat.messages(roomId),
        (old) => {
          if (!old) return [newMessage];
          
          if (Array.isArray(old)) {
            if (old.some((m) => m.id === newMessage.id)) {
              return old;
            }
            return [...old, newMessage];
          }
          
          if (old.messages.some((m) => m.id === newMessage.id)) {
            return old;
          }
          return {
            ...old,
            messages: [...old.messages, newMessage],
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(roomId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
    },
  });
}

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatRoomId: string) => chatService.markMessagesAsRead(chatRoomId),
    onSuccess: (_, chatRoomId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.unreadCount() });
      queryClient.setQueryData<ChatMessage[] | { messages: ChatMessage[]; hasMore: boolean }>(
        queryKeys.chat.messages(chatRoomId),
        (old) => {
          if (!old) return old;
          
          if (Array.isArray(old)) {
            return old.map((msg) => ({
              ...msg,
              isRead: true,
              status: 'READ' as const,
            }));
          }
          
          return {
            ...old,
            messages: old.messages.map((msg) => ({
              ...msg,
              isRead: true,
              status: 'READ' as const,
            })),
          };
        }
      );
    },
  });
}

export function useUnreadMessageCount() {
  return useQuery({
    queryKey: queryKeys.chat.unreadCount(),
    queryFn: () => chatService.getUnreadCount(),
    refetchInterval: 30000,
  });
}

export function useCreateSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupportTicketInput) => chatService.createSupportTicket(data),
    onSuccess: ({ chatRoom }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
      queryClient.setQueryData(queryKeys.chat.room(chatRoom.id), chatRoom);
    },
  });
}

export function useMyTickets() {
  return useQuery({
    queryKey: [...queryKeys.chat.all, 'my-tickets'],
    queryFn: () => chatService.getMyTickets(),
  });
}

export function useAllTickets(params?: {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...queryKeys.chat.all, 'admin-tickets', params],
    queryFn: () => chatService.getAllTickets(params),
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, assigneeId }: { ticketId: string; assigneeId?: string }) =>
      chatService.assignTicket(ticketId, assigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.chat.all, 'admin-tickets'] });
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: string;
      data: { priority?: TicketPriority; status?: TicketStatus };
    }) => chatService.updateTicket(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.chat.all, 'admin-tickets'] });
    },
  });
}

export function useResolveTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, resolution }: { ticketId: string; resolution: string }) =>
      chatService.resolveTicket(ticketId, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.chat.all, 'admin-tickets'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
    },
  });
}

export function useTicketStats() {
  return useQuery({
    queryKey: [...queryKeys.chat.all, 'admin-stats'],
    queryFn: () => chatService.getTicketStats(),
    refetchInterval: 60000,
  });
}

