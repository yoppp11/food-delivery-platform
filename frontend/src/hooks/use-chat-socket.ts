import { useEffect, useCallback, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  chatSocketManager,
  type ConnectionState,
  type TypingState,
  type MessageAck,
  type ChatStatusChange,
  type ReadReceipt,
} from '@/lib/chat-socket-manager';
import type { ChatMessage } from '@/types';

interface UseChatSocketOptions {
  userId: string;
  token?: string;
  enabled?: boolean;
}

export function useChatSocket({ userId, token, enabled = true }: UseChatSocketOptions) {
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    chatSocketManager.getConnectionState()
  );
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingState>>(new Map());

  useEffect(() => {
    if (!enabled || !userId) return;

    const authToken = token || userId;
    chatSocketManager.connect(authToken, userId);

    const unsubscribeConnection = chatSocketManager.on<ConnectionState>(
      'connection-change',
      (state) => {
        setConnectionState(state);
      }
    );

    const unsubscribeMessage = chatSocketManager.on<ChatMessage>('message', (message) => {
      queryClient.setQueryData<{ messages: ChatMessage[]; hasMore: boolean }>(
        queryKeys.chat.messages(message.chatRoomId),
        (old) => {
          if (!old) return { messages: [message], hasMore: false };
          if (old.messages.some((m) => m.id === message.id)) {
            return old;
          }
          return { ...old, messages: [...old.messages, message] };
        }
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.unreadCount() });
    });

    const unsubscribeTyping = chatSocketManager.on<TypingState>('typing', (data) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        const key = `${data.chatRoomId}-${data.userId}`;
        if (data.isTyping) {
          next.set(key, data);
        } else {
          next.delete(key);
        }
        return next;
      });
    });

    const unsubscribeRead = chatSocketManager.on<ReadReceipt>('read', () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.unreadCount() });
    });

    const unsubscribeStatusChanged = chatSocketManager.on<ChatStatusChange>(
      'status-changed',
      (data) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.chat.status(data.orderId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.chat.orderRoom(data.orderId, 'CUSTOMER_MERCHANT'),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.chat.orderRoom(data.orderId, 'CUSTOMER_DRIVER'),
        });
      }
    );

    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeRead();
      unsubscribeStatusChanged();
    };
  }, [userId, token, enabled, queryClient]);

  const joinRoom = useCallback((chatRoomId: string) => {
    chatSocketManager.joinRoom(chatRoomId);
  }, []);

  const leaveRoom = useCallback((chatRoomId: string) => {
    chatSocketManager.leaveRoom(chatRoomId);
  }, []);

  const sendMessage = useCallback(
    (
      chatRoomId: string,
      content: string,
      type: 'TEXT' | 'IMAGE' | 'LOCATION' = 'TEXT',
      options?: { metadata?: Record<string, unknown>; replyToId?: string }
    ) => {
      return chatSocketManager.sendMessage(chatRoomId, content, type, options);
    },
    []
  );

  const sendTyping = useCallback((chatRoomId: string, isTyping: boolean) => {
    chatSocketManager.sendTyping(chatRoomId, isTyping);
  }, []);

  const markAsRead = useCallback((chatRoomId: string, messageIds?: string[]) => {
    chatSocketManager.markAsRead(chatRoomId, messageIds);
  }, []);

  const typingUsersArray = useMemo(() => {
    return Array.from(typingUsers.values());
  }, [typingUsers]);

  return {
    isConnected: connectionState.isConnected,
    isReconnecting: connectionState.isReconnecting,
    connectionError: connectionState.error,
    reconnectAttempt: connectionState.reconnectAttempt,
    typingUsers: typingUsersArray,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    markAsRead,
  };
}

export function useTypingUsersForRoom(chatRoomId: string, currentUserId?: string) {
  const { typingUsers } = useChatSocket({ userId: currentUserId || '', enabled: false });

  return useMemo(() => {
    return typingUsers.filter(
      (t) => t.chatRoomId === chatRoomId && t.userId !== currentUserId
    );
  }, [typingUsers, chatRoomId, currentUserId]);
}