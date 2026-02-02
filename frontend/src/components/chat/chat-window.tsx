import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Loader2, Lock, Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { ChatMessage, ChatRoom, ChatRoomType, MessageStatus } from '@/types';
import { useChatMessages, useSendMessage, useMarkMessagesAsRead } from '@/hooks/use-chat';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useSession } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface ChatWindowProps {
  chatRoom: ChatRoom;
  onClose: () => void;
  isClosed?: boolean;
}

function getRecipientName(chatRoom: ChatRoom, currentUserId: string): string {
  const recipient = chatRoom.participants?.find((p) => p.userId !== currentUserId);
  return recipient?.user?.email?.split('@')[0] || 'Chat';
}

function getRoomTitle(type: ChatRoomType): string {
  switch (type) {
    case 'CUSTOMER_MERCHANT':
      return 'Chat with Restaurant';
    case 'CUSTOMER_DRIVER':
      return 'Chat with Driver';
    case 'CUSTOMER_SUPPORT':
      return 'Support Chat';
    default:
      return 'Chat';
  }
}

export function ChatWindow({ chatRoom, onClose, isClosed = false }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const roomId = chatRoom?.id || '';
  
  const { data: messagesData, isLoading } = useChatMessages(roomId);
  const messages = useMemo(() => {
    if (!messagesData) return [];
    if (Array.isArray(messagesData)) return messagesData;
    return messagesData.messages || [];
  }, [messagesData]);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessagesAsRead();

  const { isConnected, isReconnecting, connectionError, typingUsers, joinRoom, leaveRoom, sendTyping, markAsRead } = useChatSocket({
    userId: currentUserId || '',
    enabled: !!currentUserId && !!roomId,
  });

  const MessageStatusIcon = ({ status, isRead }: { status?: MessageStatus; isRead?: boolean }) => {
    if (isRead || status === 'READ') {
      return <CheckCheck className="h-3 w-3 text-blue-400" />;
    }
    if (status === 'DELIVERED') {
      return <CheckCheck className="h-3 w-3 opacity-70" />;
    }
    if (status === 'SENT') {
      return <Check className="h-3 w-3 opacity-70" />;
    }
    if (status === 'PENDING') {
      return <Clock className="h-3 w-3 opacity-70" />;
    }
    if (status === 'FAILED') {
      return <AlertCircle className="h-3 w-3 text-red-400" />;
    }
    return <Check className="h-3 w-3 opacity-70" />;
  };

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
      markAsRead(roomId);
      markAsReadMutation.mutate(roomId);
    }
    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [roomId]);

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'instant',
        block: 'end' 
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!message.trim() || !roomId) return;

    try {
      await sendMessageMutation.mutateAsync({
        chatRoomId: roomId,
        content: message.trim(),
      });
      setMessage('');
      sendTyping(roomId, false);
      inputRef.current?.focus();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send message';
      toast.error(errorMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (roomId) {
      sendTyping(roomId, e.target.value.length > 0);
    }
  };

  const isOwnMessage = (msg: ChatMessage) => msg.senderId === currentUserId;

  if (!roomId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Chat</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>Unable to load chat. Please try again.</AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
      style={{ height: '500px', maxHeight: 'calc(100vh - 100px)' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} />
            <AvatarFallback className="text-xs">
              {getRecipientName(chatRoom, currentUserId || '')[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">{getRoomTitle(chatRoom.type)}</h3>
            <p className="text-xs opacity-80">
              {connectionError ? (
                <span className="text-red-200">Connection error</span>
              ) : isReconnecting ? (
                <span className="text-yellow-200">Reconnecting...</span>
              ) : isConnected ? (
                <span className="text-green-200">Online</span>
              ) : (
                'Connecting...'
              )}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    isOwnMessage(msg) ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                      msg.type === 'SYSTEM'
                        ? 'bg-muted text-muted-foreground text-center w-full max-w-full text-xs italic'
                        : isOwnMessage(msg)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                    )}
                  >
                    <p className="break-words">{msg.content}</p>
                    <div className={cn(
                      'flex items-center gap-1 mt-1',
                      isOwnMessage(msg) ? 'justify-end' : 'justify-start'
                    )}>
                      <span className={cn(
                        'text-[10px]',
                        isOwnMessage(msg) ? 'opacity-70' : 'text-muted-foreground'
                      )}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isOwnMessage(msg) && (
                        <MessageStatusIcon status={msg.status} isRead={msg.isRead} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <span className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                </span>
                <span>typing</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        {isClosed ? (
          <Alert className="bg-muted">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-sm">
              This chat has been closed. You can view the history but cannot send new messages.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
