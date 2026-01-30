import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatWindow } from './chat-window';
import { useCreateChatRoom, useChatRoomForOrder, useChatStatus } from '@/hooks/use-chat';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import type { ChatRoom, ChatRoomType } from '@/types';

interface ChatButtonProps {
  orderId: string;
  type: ChatRoomType;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
}

export function ChatButton({
  orderId,
  type,
  label,
  variant = 'outline',
  size = 'default',
  className,
  disabled: externalDisabled,
}: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<ChatRoom | null>(null);
  const { data: existingRoom, isLoading: isLoadingRoom } = useChatRoomForOrder(orderId, type);
  const { data: chatStatus } = useChatStatus(orderId);
  const createChatRoom = useCreateChatRoom();

  const isChatAllowed = type === 'CUSTOMER_MERCHANT' 
    ? chatStatus?.canChatWithMerchant ?? true
    : type === 'CUSTOMER_DRIVER'
    ? chatStatus?.canChatWithDriver ?? false
    : true;

  const disabledReason = type === 'CUSTOMER_MERCHANT' && !isChatAllowed
    ? 'Chat with restaurant is closed after order is on delivery'
    : type === 'CUSTOMER_DRIVER' && !isChatAllowed
    ? 'Chat with driver is available only during delivery'
    : '';

  const handleOpenChat = async () => {
    if (!isChatAllowed) {
      toast.info(disabledReason || 'Chat is not available at this time');
      return;
    }

    if (existingRoom) {
      if ((existingRoom as any).isClosed) {
        toast.info('This chat has been closed');
        return;
      }
      setIsOpen(true);
      return;
    }

    if (createdRoom) {
      setIsOpen(true);
      return;
    }

    try {
      const newRoom = await createChatRoom.mutateAsync({ orderId, type });
      if (newRoom) {
        setCreatedRoom(newRoom);
        setIsOpen(true);
      } else {
        toast.error('Failed to create chat room');
      }
    } catch {
      toast.error('Failed to open chat');
    }
  };

  const chatRoom = existingRoom || createdRoom;
  const isLoading = isLoadingRoom || createChatRoom.isPending;
  const isDisabled = externalDisabled || isLoading || !isChatAllowed;

  const buttonLabel = label !== undefined 
    ? label 
    : (type === 'CUSTOMER_MERCHANT' 
      ? 'Chat with Restaurant' 
      : type === 'CUSTOMER_DRIVER' 
      ? 'Chat with Driver' 
      : 'Chat');

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      onClick={handleOpenChat}
      disabled={isDisabled}
      className={className}
    >
      {isLoading ? (
        <Loader2 className={`h-4 w-4 animate-spin ${buttonLabel ? 'mr-2' : ''}`} />
      ) : !isChatAllowed ? (
        <Lock className={`h-4 w-4 ${buttonLabel ? 'mr-2' : ''}`} />
      ) : (
        <MessageCircle className={`h-4 w-4 ${buttonLabel ? 'mr-2' : ''}`} />
      )}
      {buttonLabel}
    </Button>
  );

  return (
    <>
      {disabledReason ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent>
              <p>{disabledReason}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        buttonContent
      )}

      <AnimatePresence>
        {isOpen && chatRoom && (
          <ChatWindow 
            chatRoom={chatRoom} 
            onClose={() => setIsOpen(false)}
            isClosed={(existingRoom as any)?.isClosed}
          />
        )}
      </AnimatePresence>
    </>
  );
}
