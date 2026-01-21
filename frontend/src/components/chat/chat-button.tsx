import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatWindow } from './chat-window';
import { useCreateChatRoom, useChatRoomForOrder } from '@/hooks/use-chat';
import type { ChatRoomType } from '@/types';

interface ChatButtonProps {
  orderId: string;
  type: ChatRoomType;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ChatButton({
  orderId,
  type,
  label,
  variant = 'outline',
  size = 'default',
  className,
}: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: existingRoom, isLoading: isLoadingRoom } = useChatRoomForOrder(orderId, type);
  const createChatRoom = useCreateChatRoom();

  const handleOpenChat = async () => {
    if (existingRoom) {
      setIsOpen(true);
      return;
    }

    try {
      await createChatRoom.mutateAsync({ orderId, type });
      setIsOpen(true);
    } catch {
      // Error handled by mutation
    }
  };

  const chatRoom = existingRoom || createChatRoom.data;
  const isLoading = isLoadingRoom || createChatRoom.isPending;

  const buttonLabel = label || (type === 'CUSTOMER_MERCHANT' ? 'Chat with Restaurant' : type === 'CUSTOMER_DRIVER' ? 'Chat with Driver' : 'Chat');

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenChat}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <MessageCircle className="h-4 w-4 mr-2" />
        )}
        {buttonLabel}
      </Button>

      <AnimatePresence>
        {isOpen && chatRoom && (
          <ChatWindow chatRoom={chatRoom} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
