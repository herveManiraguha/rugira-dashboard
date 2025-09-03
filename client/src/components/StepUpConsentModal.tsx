import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface StepUpConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  operation: string;
  description?: string;
}

export default function StepUpConsentModal({
  isOpen,
  onClose,
  onConfirm,
  operation,
  description
}: StepUpConsentModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
      setConfirmed(false);
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-red-600" />
            <DialogTitle>Security Verification Required</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {description || `This ${operation} requires additional verification for security and compliance purposes.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                  Compliance Notice
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  This action will be logged for audit purposes. The exported data may contain sensitive information and should be handled according to your organization's data governance policies.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              />
              <Label 
                htmlFor="consent" 
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                I understand that this {operation} will be logged and I have the necessary authorization to proceed with this action.
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!confirmed}
          >
            Proceed with {operation}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}