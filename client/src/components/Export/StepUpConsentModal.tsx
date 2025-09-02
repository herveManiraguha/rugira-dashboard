import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StepUpConsentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  exportType: string;
}

export function StepUpConsentModal({ 
  open, 
  onClose, 
  onConfirm, 
  exportType 
}: StepUpConsentModalProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate verification
    onConfirm(password);
    setPassword('');
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Additional Verification Required
          </DialogTitle>
          <DialogDescription>
            This action requires additional authentication to export {exportType} data.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-sm">
            You are about to export sensitive data. This action will be logged
            and audited for compliance purposes.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="password">
              Confirm your password to continue
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              data-testid="input-step-up-password"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!password || isLoading}
            data-testid="button-confirm-export"
          >
            {isLoading ? 'Verifying...' : 'Confirm Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}