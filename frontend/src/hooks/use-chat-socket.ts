import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { ChatMessage } from '@/types';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

interface UseChatSocketOptions {
  userId: string;
  enabled?: boolean;
}

interface TypingState {
  userId: string;
  isTyping: boolean;
}

interface ChatStatusChange {
  orderId: string;
  isClosed: boolean;
}

export function useChatSocket({ userId, enabled = true }: UseChatSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingState>>(new Map());

  useEffect(() => {
    if (!enabled || !userId) return;

    const socket = io(`${SOCKET_URL}/chat`, {
      auth: { userId },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setIsReconnecting(false);
      setConnectionError(null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      setConnectionError(error.message);
    });

    socket.io.on('reconnect_attempt', () => {
      setIsReconnecting(true);
    });

    socket.io.on('reconnect_failed', () => {
      setIsReconnecting(false);
      setConnectionError('Failed to reconnect after multiple attempts');
    });

    socket.on('error', (data: { message: string; code?: number }) => {
      setConnectionError(data.message);
    });

    socket.on('chat:message', (message: ChatMessage) => {
      queryClient.setQueryData<ChatMessage[]>(
        queryKeys.chat.messages(message.chatRoomId),
        (old) => (old ? [...old, message] : [message])
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.unreadCount() });
    });

    socket.on('chat:new-message', () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.unreadCount() });
    });

    socket.on('chat:typing', (data: TypingState) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (data.isTyping) {
          next.set(data.userId, data);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    socket.on('chat:read', () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.unreadCount() });
    });

    socket.on('chat:status-changed', (data: ChatStatusChange) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.chat.status(data.orderId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.chat.orderRoom(data.orderId, 'CUSTOMER_MERCHANT') 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.chat.orderRoom(data.orderId, 'CUSTOMER_DRIVER') 
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, enabled, queryClient]);

  const joinRoom = useCallback((chatRoomId: string) => {
    socketRef.current?.emit('chat:join', { chatRoomId });
  }, []);

  const leaveRoom = useCallback((chatRoomId: string) => {
    socketRef.current?.emit('chat:leave', { chatRoomId });
  }, []);

  const sendMessage = useCallback((chatRoomId: string, content: string, type: 'TEXT' | 'IMAGE' | 'LOCATION' = 'TEXT') => {
    socketRef.current?.emit('chat:message', { chatRoomId, content, type });
  }, []);

  const sendTyping = useCallback((chatRoomId: string, isTyping: boolean) => {
    socketRef.current?.emit('chat:typing', { chatRoomId, isTyping });
  }, []);

  const markAsRead = useCallback((chatRoomId: string) => {
    socketRef.current?.emit('chat:read', { chatRoomId });
  }, []);

  return {
    isConnected,
    isReconnecting,
    connectionError,
    typingUsers: Array.from(typingUsers.values()),
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    markAsRead,
  };
}
