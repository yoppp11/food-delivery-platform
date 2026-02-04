import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './auth-provider';
import {
  chatSocketManager,
  type ConnectionState,
  type TypingState,
  type MessageAck,
  type ChatStatusChange,
  type ReadReceipt,
  type ChatNotification,
} from '@/lib/chat-socket-manager';
import { queryKeys } from '@/lib/query-keys';
import type { ChatMessage, MessageStatus } from '@/types';

interface PendingMessage {
  clientMessageId: string;
  chatRoomId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'LOCATION';
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

interface ChatContextValue {
  connectionState: ConnectionState;
  isConnected: boolean;
  
  typingUsers: Map<string, TypingState>;
  
  pendingMessages: Map<string, PendingMessage>;
  
  activeChatRoomId: string | null;
  setActiveChatRoomId: (roomId: string | null) => void;
  
  unreadCounts: Map<string, number>;
  totalUnreadCount: number;
  
  joinRoom: (chatRoomId: string) => void;
  leaveRoom: (chatRoomId: string) => void;
  sendMessage: (
    chatRoomId: string,
    content: string,
    type?: 'TEXT' | 'IMAGE' | 'LOCATION',
    options?: {
      metadata?: Record<string, unknown>;
      replyToId?: string;
    }
  ) => string;
  sendTyping: (chatRoomId: string, isTyping: boolean) => void;
  markAsRead: (chatRoomId: string, messageIds?: string[]) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: false,
    isReconnecting: false,
    error: null,
    reconnectAttempt: 0,
  });
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingState>>(new Map());
  const [pendingMessages, setPendingMessages] = useState<Map<string, PendingMessage>>(new Map());
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('session-token='))
        ?.split('=')[1] || user.id;

      chatSocketManager.connect(token, user.id);
    } else {
      chatSocketManager.disconnect();
    }

    return () => {
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
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
          return {
            ...old,
            messages: [...old.messages, message],
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });

      if (message.chatRoomId !== activeChatRoomId && message.senderId !== user?.id) {
        setUnreadCounts((prev) => {
          const next = new Map(prev);
          next.set(message.chatRoomId, (prev.get(message.chatRoomId) || 0) + 1);
          return next;
        });
      }
    });

    const unsubscribeAck = chatSocketManager.on<MessageAck>('message:ack', (ack) => {
      setPendingMessages((prev) => {
        const next = new Map(prev);
        const pending = next.get(ack.clientMessageId);
        if (pending) {
          if (ack.status === 'FAILED') {
            next.set(ack.clientMessageId, { ...pending, status: 'FAILED' });
          } else {
            next.delete(ack.clientMessageId);
          }
        }
        return next;
      });

      if (ack.messageId && ack.status !== 'FAILED') {
        queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
      }
    });

    const unsubscribeTyping = chatSocketManager.on<TypingState>('typing', (data) => {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        const key = `${data.chatRoomId}-${data.userId}`;
        if (data.isTyping) {
          next.set(key, data);
          setTimeout(() => {
            setTypingUsers((current) => {
              const updated = new Map(current);
              updated.delete(key);
              return updated;
            });
          }, 5000);
        } else {
          next.delete(key);
        }
        return next;
      });
    });

    const unsubscribeRead = chatSocketManager.on<ReadReceipt>('read', (data) => {
      queryClient.setQueryData<{ messages: ChatMessage[]; hasMore: boolean }>(
        queryKeys.chat.messages(data.chatRoomId),
        (old) => {
          if (!old) return old;
          
          const messageIdsToMark = data.messageIds || [];
          const hasLastReadId = !!data.lastReadMessageId;
          
          return {
            ...old,
            messages: old.messages.map((msg) => {

              if (messageIdsToMark.length > 0 && messageIdsToMark.includes(msg.id)) {
                return { ...msg, status: 'READ' as MessageStatus, isRead: true };
              }

              if (hasLastReadId && msg.senderId !== data.userId) {
                return { ...msg, status: 'READ' as MessageStatus, isRead: true };
              }
              return msg;
            }),
          };
        }
      );

      if (data.userId === user?.id) {
        setUnreadCounts((prev) => {
          const next = new Map(prev);
          next.delete(data.chatRoomId);
          return next;
        });
      }
    });

    const unsubscribeStatusChanged = chatSocketManager.on<ChatStatusChange>(
      'status-changed',
      (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.chat.room(data.chatRoomId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.chat.status(data.orderId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
      }
    );

    // Handle notifications for new messages (for users not in the chat room)
    const unsubscribeNotification = chatSocketManager.on<ChatNotification>(
      'notification',
      (data) => {
        if (data.type === 'new-message') {
          // Invalidate queries to refresh messages
          queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(data.chatRoomId) });
          queryClient.invalidateQueries({ queryKey: queryKeys.chat.rooms() });
          queryClient.invalidateQueries({ queryKey: queryKeys.chat.unreadCount() });
          
          // Update unread counts
          if (data.chatRoomId !== activeChatRoomId) {
            setUnreadCounts((prev) => {
              const next = new Map(prev);
              next.set(data.chatRoomId, (prev.get(data.chatRoomId) || 0) + 1);
              return next;
            });
          }
        }
      }
    );

    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeAck();
      unsubscribeTyping();
      unsubscribeRead();
      unsubscribeStatusChanged();
      unsubscribeNotification();
    };
  }, [queryClient, activeChatRoomId, user?.id]);

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
      options?: {
        metadata?: Record<string, unknown>;
        replyToId?: string;
      }
    ): string => {
      const clientMessageId = chatSocketManager.sendMessage(chatRoomId, content, type, options);

      setPendingMessages((prev) => {
        const next = new Map(prev);
        next.set(clientMessageId, {
          clientMessageId,
          chatRoomId,
          content,
          type,
          status: 'PENDING',
          createdAt: new Date(),
          metadata: options?.metadata,
        });
        return next;
      });

      return clientMessageId;
    },
    []
  );

  const sendTyping = useCallback((chatRoomId: string, isTyping: boolean) => {
    chatSocketManager.sendTyping(chatRoomId, isTyping);
  }, []);

  const markAsRead = useCallback((chatRoomId: string, messageIds?: string[]) => {
    chatSocketManager.markAsRead(chatRoomId, messageIds);
    setUnreadCounts((prev) => {
      const next = new Map(prev);
      next.delete(chatRoomId);
      return next;
    });
  }, []);

  const totalUnreadCount = useMemo(() => {
    let total = 0;
    unreadCounts.forEach((count) => {
      total += count;
    });
    return total;
  }, [unreadCounts]);

  const value: ChatContextValue = useMemo(
    () => ({
      connectionState,
      isConnected: connectionState.isConnected,
      typingUsers,
      pendingMessages,
      activeChatRoomId,
      setActiveChatRoomId,
      unreadCounts,
      totalUnreadCount,
      joinRoom,
      leaveRoom,
      sendMessage,
      sendTyping,
      markAsRead,
    }),
    [
      connectionState,
      typingUsers,
      pendingMessages,
      activeChatRoomId,
      unreadCounts,
      totalUnreadCount,
      joinRoom,
      leaveRoom,
      sendMessage,
      sendTyping,
      markAsRead,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
}

export function useTypingUsers(chatRoomId: string) {
  const { typingUsers } = useChat();
  const { user } = useAuth();

  return useMemo(() => {
    const users: TypingState[] = [];
    typingUsers.forEach((state, key) => {
      if (key.startsWith(`${chatRoomId}-`) && state.userId !== user?.id) {
        users.push(state);
      }
    });
    return users;
  }, [typingUsers, chatRoomId, user?.id]);
}

export function usePendingMessages(chatRoomId: string) {
  const { pendingMessages } = useChat();

  return useMemo(() => {
    const messages: PendingMessage[] = [];
    pendingMessages.forEach((msg) => {
      if (msg.chatRoomId === chatRoomId) {
        messages.push(msg);
      }
    });
    return messages;
  }, [pendingMessages, chatRoomId]);
}

export function useRoomUnreadCount(chatRoomId: string) {
  const { unreadCounts } = useChat();
  return unreadCounts.get(chatRoomId) || 0;
}

export default ChatProvider;
