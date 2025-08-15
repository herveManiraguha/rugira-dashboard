import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  requiresTyping?: string; // Text user must type to confirm
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  requiresTyping,
  onConfirm,
  variant = 'default'
}: ConfirmationDialogProps) {
  const [typedText, setTypedText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const canConfirm = requiresTyping ? typedText === requiresTyping : true;

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm();
      setIsOpen(false);
      setTypedText('');
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTypedText('');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {variant === 'destructive' && (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            )}
            <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requiresTyping && (
          <div className="py-4 space-y-2">
            <Label htmlFor="confirmation-input">
              Type <span className="font-mono font-bold">{requiresTyping}</span> to confirm:
            </Label>
            <Input
              id="confirmation-input"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder={requiresTyping}
              className="font-mono"
              data-testid="confirmation-input"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={variant === 'destructive' ? 'danger-action' : ''}
            data-testid="confirm-action"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}