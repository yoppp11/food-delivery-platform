import { io, Socket } from 'socket.io-client';
import type { ChatMessage, MessageStatus } from '@/types';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export interface TypingState {
  userId: string;
  chatRoomId: string;
  isTyping: boolean;
}

export interface MessageAck {
  clientMessageId: string;
  messageId: string;
  status: MessageStatus;
  timestamp: Date;
}

export interface ChatStatusChange {
  orderId: string;
  chatRoomId: string;
  isClosed: boolean;
  reason?: string;
}

export interface ReadReceipt {
  chatRoomId: string;
  userId: string;
  messageIds?: string[];
  lastReadMessageId?: string;
  readAt?: Date;
  timestamp?: string;
}

export interface ConnectionState {
  isConnected: boolean;
  isReconnecting: boolean;
  error: string | null;
  reconnectAttempt: number;
}

export interface ChatNotification {
  type: 'new-message';
  chatRoomId: string;
  preview: string;
  senderId: string;
  timestamp: string;
}

export type ChatEventType =
  | 'message'
  | 'message:ack'
  | 'typing'
  | 'read'
  | 'status-changed'
  | 'connection-change'
  | 'notification'
  | 'error';

export type ChatEventHandler<T = unknown> = (data: T) => void;

interface PendingMessage {
  clientMessageId: string;
  chatRoomId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'LOCATION';
  metadata?: Record<string, unknown>;
  replyToId?: string;
  timestamp: number;
  retryCount: number;
}

class ChatSocketManager {
  private static instance: ChatSocketManager | null = null;
  private socket: Socket | null = null;
  private eventHandlers: Map<ChatEventType, Set<ChatEventHandler>> = new Map();
  private joinedRooms: Set<string> = new Set();
  private pendingMessages: Map<string, PendingMessage> = new Map();
  private connectionState: ConnectionState = {
    isConnected: false,
    isReconnecting: false,
    error: null,
    reconnectAttempt: 0,
  };
  private token: string | null = null;
  private userId: string | null = null;
  private maxRetries = 3;

  private constructor() {}

  static getInstance(): ChatSocketManager {
    if (!ChatSocketManager.instance) {
      ChatSocketManager.instance = new ChatSocketManager();
    }
    return ChatSocketManager.instance;
  }

  connect(token: string, userId: string): void {
    if (this.socket?.connected && this.token === token) {
      return;
    }

    this.disconnect();

    this.token = token;
    this.userId = userId;

    this.socket = io(`${SOCKET_URL}/chat`, {
      auth: { token, userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 10000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.updateConnectionState({
        isConnected: true,
        isReconnecting: false,
        error: null,
        reconnectAttempt: 0,
      });

      this.joinedRooms.forEach((roomId) => {
        this.socket?.emit('chat:join', { chatRoomId: roomId });
      });

      this.retryPendingMessages();
    });

    this.socket.on('disconnect', (reason) => {
      this.updateConnectionState({
        isConnected: false,
        isReconnecting: reason === 'io server disconnect' ? false : true,
        error: reason === 'io server disconnect' ? 'Disconnected by server' : null,
        reconnectAttempt: 0,
      });
    });

    this.socket.on('connect_error', (error) => {
      this.updateConnectionState({
        ...this.connectionState,
        error: error.message,
      });
      this.emit('error', { message: error.message, code: 'CONNECT_ERROR' });
    });

    this.socket.io.on('reconnect_attempt', (attempt) => {
      this.updateConnectionState({
        ...this.connectionState,
        isReconnecting: true,
        reconnectAttempt: attempt,
      });
    });

    this.socket.io.on('reconnect_failed', () => {
      this.updateConnectionState({
        ...this.connectionState,
        isReconnecting: false,
        error: 'Failed to reconnect after multiple attempts',
      });
    });

    this.socket.on('chat:message', (message: ChatMessage) => {
      this.emit('message', message);
    });

    this.socket.on('chat:ack', (ack: MessageAck) => {
      this.pendingMessages.delete(ack.clientMessageId);
      this.emit('message:ack', ack);
    });

    this.socket.on('chat:typing', (data: TypingState) => {
      this.emit('typing', data);
    });

    this.socket.on('chat:read', (data: ReadReceipt) => {
      this.emit('read', data);
    });

    this.socket.on('chat:status-changed', (data: ChatStatusChange) => {
      this.emit('status-changed', data);
    });

    this.socket.on('chat:notification', (data: ChatNotification) => {
      this.emit('notification', data);
    });

    this.socket.on('error', (data: { message: string; code?: string }) => {
      this.emit('error', data);
    });
  }

  private updateConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.emit('connection-change', state);
  }

  private retryPendingMessages(): void {
    this.pendingMessages.forEach((msg, clientId) => {
      if (msg.retryCount >= this.maxRetries) {
        this.emit('message:ack', {
          clientMessageId: clientId,
          messageId: '',
          status: 'FAILED' as MessageStatus,
          timestamp: new Date(),
        });
        this.pendingMessages.delete(clientId);
        return;
      }

      if (this.connectionState.isConnected) {
        this.socket?.emit('chat:message', {
          chatRoomId: msg.chatRoomId,
          content: msg.content,
          type: msg.type,
          metadata: msg.metadata,
          clientMessageId: msg.clientMessageId,
          replyToId: msg.replyToId,
        });
        msg.retryCount++;
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.token = null;
    this.userId = null;
    this.joinedRooms.clear();
    this.pendingMessages.clear();
    this.updateConnectionState({
      isConnected: false,
      isReconnecting: false,
      error: null,
      reconnectAttempt: 0,
    });
  }

  joinRoom(chatRoomId: string): void {
    if (!this.socket?.connected) {
      this.joinedRooms.add(chatRoomId);
      return;
    }

    if (!this.joinedRooms.has(chatRoomId)) {
      this.socket.emit('chat:join', { chatRoomId });
      this.joinedRooms.add(chatRoomId);
    }
  }

  leaveRoom(chatRoomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('chat:leave', { chatRoomId });
    }
    this.joinedRooms.delete(chatRoomId);
  }

  sendMessage(
    chatRoomId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' | 'LOCATION' = 'TEXT',
    options?: {
      metadata?: Record<string, unknown>;
      clientMessageId?: string;
      replyToId?: string;
    }
  ): string {
    const clientMessageId = options?.clientMessageId || this.generateClientMessageId();

    const messagePayload = {
      chatRoomId,
      content,
      type,
      metadata: options?.metadata,
      clientMessageId,
      replyToId: options?.replyToId,
    };

    this.pendingMessages.set(clientMessageId, {
      clientMessageId,
      chatRoomId,
      content,
      type,
      metadata: options?.metadata,
      replyToId: options?.replyToId,
      timestamp: Date.now(),
      retryCount: 0,
    });

    if (this.socket?.connected) {
      this.socket.emit('chat:message', messagePayload);
    }

    return clientMessageId;
  }

  sendTyping(chatRoomId: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('chat:typing', { chatRoomId, isTyping });
    }
  }

  markAsRead(chatRoomId: string, messageIds?: string[]): void {
    if (this.socket?.connected) {
      this.socket.emit('chat:read', { chatRoomId, messageIds });
    }
  }

  on<T = unknown>(event: ChatEventType, handler: ChatEventHandler<T>): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler as ChatEventHandler);

    return () => {
      this.eventHandlers.get(event)?.delete(handler as ChatEventHandler);
    };
  }

  off<T = unknown>(event: ChatEventType, handler: ChatEventHandler<T>): void {
    this.eventHandlers.get(event)?.delete(handler as ChatEventHandler);
  }

  private emit<T>(event: ChatEventType, data: T): void {
    this.eventHandlers.get(event)?.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in chat event handler for ${event}:`, error);
      }
    });
  }

  private generateClientMessageId(): string {
    return `${this.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionState(): ConnectionState {
    return { ...this.connectionState };
  }

  isConnected(): boolean {
    return this.connectionState.isConnected;
  }

  getJoinedRooms(): string[] {
    return Array.from(this.joinedRooms);
  }

  getPendingMessages(): PendingMessage[] {
    return Array.from(this.pendingMessages.values());
  }
}

export const chatSocketManager = ChatSocketManager.getInstance();
export default chatSocketManager;
