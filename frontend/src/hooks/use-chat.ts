import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type { ChatRoom, ChatMessage, ChatRoomType } from '@/types';

interface SendMessageInput {
  chatRoomId: string;
  content: string;
  type?: 'TEXT' | 'IMAGE' | 'LOCATION';
}

interface CreateChatRoomInput {
  orderId: string;
  type: ChatRoomType;
}

export function useChatRooms() {
  return useQuery({
    queryKey: queryKeys.chat.rooms(),
    queryFn: () => apiClient.get<ChatRoom[]>('/chat/rooms'),
  });
}

export function useChatRoom(id: string) {
  return useQuery({
    queryKey: queryKeys.chat.room(id),
    queryFn: () => apiClient.get<ChatRoom>(`/chat/rooms/${id}`),
    enabled: !!id,
  });
}

export function useChatMessages(roomId: string, limit = 50) {
  return useQuery({
    queryKey: queryKeys.chat.messages(roomId),
    queryFn: () => apiClient.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`, { limit }),
    enabled: !!roomId,
    refetchInterval: 5000,
  });
}

export function useUnreadMessageCount() {
  return useQuery({
    queryKey: queryKeys.chat.unreadCount(),
    queryFn: () => apiClient.get<{ count: number }>('/chat/unread-count'),
    refetchInterval: 30000,
  });
}

export function useChatRoomForOrder(orderId: string, type: ChatRoomType) {
  return useQuery({
    queryKey: queryKeys.chat.orderRoom(orderId, type),
    queryFn: () => apiClient.get<ChatRoom | null>(`/chat/order/${orderId}`, { type }),
    enabled: !!orderId && !!type,
  });
}

export function useCreateChatRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChatRoomInput) =>
      apiClient.post<ChatRoom>('/chat/rooms', data),
    onSuccess: (newRoom) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
      queryClient.setQueryData(queryKeys.chat.room(newRoom.id), newRoom);
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageInput) =>
      apiClient.post<ChatMessage>('/chat/messages', data),
    onSuccess: (newMessage) => {
      queryClient.setQueryData<ChatMessage[]>(
        queryKeys.chat.messages(newMessage.chatRoomId),
        (old) => (old ? [...old, newMessage] : [newMessage])
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
    },
  });
}

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatRoomId: string) =>
      apiClient.post(`/chat/rooms/${chatRoomId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.unreadCount() });
    },
  });
}
