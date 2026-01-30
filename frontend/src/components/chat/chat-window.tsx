import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { ChatMessage, ChatRoom, ChatRoomType } from '@/types';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const { data: messages = [], isLoading } = useChatMessages(chatRoom.id);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessagesAsRead();

  const { isConnected, isReconnecting, connectionError, typingUsers, joinRoom, leaveRoom, sendTyping, markAsRead } = useChatSocket({
    userId: currentUserId || '',
    enabled: !!currentUserId,
  });

  useEffect(() => {
    if (chatRoom.id) {
      joinRoom(chatRoom.id);
      markAsRead(chatRoom.id);
      markAsReadMutation.mutate(chatRoom.id);
    }
    return () => {
      if (chatRoom.id) {
        leaveRoom(chatRoom.id);
      }
    };
  }, [chatRoom.id, joinRoom, leaveRoom, markAsRead, markAsReadMutation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        chatRoomId: chatRoom.id,
        content: message.trim(),
      });
      setMessage('');
      sendTyping(chatRoom.id, false);
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
    sendTyping(chatRoom.id, e.target.value.length > 0);
  };

  const isOwnMessage = (msg: ChatMessage) => msg.senderId === currentUserId;

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
                      isOwnMessage(msg)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                    )}
                  >
                    <p className="break-words">{msg.content}</p>
                    <p className={cn(
                      'text-[10px] mt-1',
                      isOwnMessage(msg) ? 'opacity-70' : 'text-muted-foreground'
                    )}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
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
