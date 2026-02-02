import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, HelpCircle } from 'lucide-react';
import { useCreateSupportTicket } from '@/hooks/use-chat';
import type { SupportCategory } from '@/types';
import { toast } from 'sonner';

const supportCategories: { value: SupportCategory; label: string }[] = [
  { value: 'ORDER_ISSUE', label: 'Order Issue' },
  { value: 'PAYMENT_ISSUE', label: 'Payment Issue' },
  { value: 'DELIVERY_ISSUE', label: 'Delivery Issue' },
  { value: 'MERCHANT_COMPLAINT', label: 'Merchant Complaint' },
  { value: 'DRIVER_COMPLAINT', label: 'Driver Complaint' },
  { value: 'REFUND_REQUEST', label: 'Refund Request' },
  { value: 'TECHNICAL_ISSUE', label: 'Technical Issue' },
  { value: 'GENERAL_INQUIRY', label: 'General Inquiry' },
  { value: 'OTHER', label: 'Other' },
];

interface SupportTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: string;
  onSuccess?: (ticketId: string, chatRoomId: string) => void;
}

export function SupportTicketDialog({
  open,
  onOpenChange,
  orderId,
  onSuccess,
}: SupportTicketDialogProps) {
  const [category, setCategory] = useState<SupportCategory>('GENERAL_INQUIRY');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const createTicketMutation = useCreateSupportTicket();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    if (message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    if (message.length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      const result = await createTicketMutation.mutateAsync({
        category,
        subject,
        initialMessage: message,
        orderId: orderId || undefined,
      });

      toast.success('Support ticket created successfully');
      onOpenChange(false);
      setSubject('');
      setMessage('');
      setCategory('GENERAL_INQUIRY');
      setErrors({});
      onSuccess?.(result.ticket.id, result.chatRoom.id);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create support ticket');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Contact Support
          </DialogTitle>
          <DialogDescription>
            Describe your issue and our support team will get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as SupportCategory)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {supportCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject}</p>
            )}
          </div>

          {orderId && (
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input id="orderId" value={orderId} disabled />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Please describe your issue in detail..."
              className="min-h-[120px] resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createTicketMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createTicketMutation.isPending}>
              {createTicketMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Submit Ticket'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SupportTicketDialog;
