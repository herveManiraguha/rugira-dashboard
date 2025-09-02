import React, { useState, useRef, useEffect } from 'react';
import { Ban, Power, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useKillSwitch } from '@/hooks/useKillSwitch';
import { useAuth } from '@/contexts/AuthContext';
import OctagonX from '@/components/icons/OctagonX';
import type { KillSwitchEngageRequest } from '@/../../shared/schema';

interface KillSwitchButtonProps {
  className?: string;
}

export default function KillSwitchButton({ className }: KillSwitchButtonProps) {
  const { user } = useAuth();
  const { killSwitchState, isLoading, engageKillSwitch, clearKillSwitch } = useKillSwitch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  

  
  // Engage form state
  const [scope, setScope] = useState<'tenant' | 'global'>('tenant');
  const [profile, setProfile] = useState<'soft' | 'hard'>('soft');
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [globalConfirm, setGlobalConfirm] = useState(false);
  
  // Clear form state
  const [clearNote, setClearNote] = useState('');
  const [clearConfirmText, setClearConfirmText] = useState('');

  // Mock admin check - in real implementation check user role
  const isAdmin = true; // For demo purposes, always true
  const isActive = killSwitchState?.active;
  const canConfirmEngage = confirmText === 'PAUSE' && reason.trim() && (scope !== 'global' || globalConfirm);
  const canConfirmClear = clearConfirmText === 'RESUME';

  // Get tooltip text based on state
  const getTooltipText = () => {
    if (!isAdmin) return "Unavailable";
    if (isActive) return "Resume Trading - Clear Kill Switch";
    return "Emergency Kill Switch";
  };

  const handleEngage = async () => {
    if (!canConfirmEngage || isLoading) return;
    
    const request: KillSwitchEngageRequest = {
      scope,
      profile,
      reason: reason.trim()
    };

    try {
      await engageKillSwitch(request);
      setDialogOpen(false);
      resetEngageForm();
    } catch (error) {
      console.error('Failed to engage kill switch:', error);
    }
  };

  const handleClear = async () => {
    if (!canConfirmClear || isLoading) return;
    
    try {
      await clearKillSwitch({ 
        scope: killSwitchState?.scope || 'tenant',
        note: clearNote.trim() || undefined,
        lastVerified: new Date(),
        status: 'connected'
      });
      setClearDialogOpen(false);
      resetClearForm();
    } catch (error) {
      console.error('Failed to clear kill switch:', error);
    }
  };

  const resetEngageForm = () => {
    setScope('tenant');
    setProfile('soft');
    setReason('');
    setConfirmText('');
    setGlobalConfirm(false);
  };

  const resetClearForm = () => {
    setClearNote('');
    setClearConfirmText('');
  };



  // Show disabled button for non-admins
  if (!isAdmin) {
    return (
      <div className="relative">
        <button
          disabled
          className={cn(
            "relative w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 transition-all duration-200 cursor-not-allowed",
            "flex items-center justify-center",
            className
          )}
          title="Unavailable"
          aria-label="Emergency kill switch — unavailable"
          data-testid="kill-switch-button-disabled"
        >
          <OctagonX className="h-7 w-7 text-gray-400 opacity-40" />
        </button>
      </div>
    );
  }

  // Show clear button when active
  if (isActive) {
    return (
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative">
            <button
              className={cn(
                "relative w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg",
                "flex items-center justify-center cursor-pointer",
                className
              )}
              title={getTooltipText()}
              aria-label="Emergency kill switch — trading halted, click to resume"
              data-testid="kill-switch-button-active"
            >
              <OctagonX className="h-7 w-7 text-white" filled={true} />
            </button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Ban className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span>Resume Trading</span>
            </DialogTitle>
            <DialogDescription className="text-sm">
              This will clear the kill switch and resume normal trading operations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current state info */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm">
                <p className="font-medium text-red-800">Current Status:</p>
                <p className="text-red-700">
                  {killSwitchState?.scope} {killSwitchState?.profile} halt by {killSwitchState?.by}
                </p>
                <p className="text-red-600 text-xs mt-1">
                  Reason: {killSwitchState?.reason}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clear-note">Note (optional)</Label>
              <Textarea
                id="clear-note"
                placeholder="Optional note about clearing the kill switch..."
                value={clearNote}
                onChange={(e) => setClearNote(e.target.value)}
                data-testid="input-clear-note"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clear-confirm">Type "RESUME" to confirm</Label>
              <Input
                id="clear-confirm"
                placeholder="RESUME"
                value={clearConfirmText}
                onChange={(e) => setClearConfirmText(e.target.value)}
                className={canConfirmClear ? 'border-green-300' : ''}
                data-testid="input-clear-confirm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setClearDialogOpen(false)}
              data-testid="button-cancel-clear"
            >
              Cancel
            </Button>
            <Button
              onClick={handleClear}
              disabled={!canConfirmClear || isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-confirm-clear"
            >
              {isLoading ? 'Resuming...' : 'Resume Trading'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Show engage button when inactive
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="relative">
          <button
            className={cn(
              "relative w-10 h-10 rounded-xl transition-all duration-200 shadow-sm",
              "flex items-center justify-center cursor-pointer",
              "bg-red-50 border border-red-300 hover:bg-red-100 hover:border-red-400 hover:shadow-md",
              className
            )}
            title={getTooltipText()}
            aria-label="Emergency kill switch — stop all trading"
            data-testid="kill-switch-button-inactive"
          >
            <OctagonX 
              className="h-7 w-7 text-red-600" 
              filled={true}
            />
          </button>
        </div>
      </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            <span>Emergency Kill Switch</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            This will immediately halt trading activity and prevent new orders. This action is logged and audited.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Scope Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Scope</Label>
            <RadioGroup value={scope} onValueChange={(value: 'tenant' | 'global') => setScope(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tenant" id="scope-tenant" />
                <Label htmlFor="scope-tenant">Tenant - affects only current tenant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="global" id="scope-global" />
                <Label htmlFor="scope-global">Global - affects all tenants (admin only)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Global confirmation */}
          {scope === 'global' && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="global-confirm" 
                  checked={globalConfirm}
                  onCheckedChange={(checked) => setGlobalConfirm(checked as boolean)}
                />
                <Label htmlFor="global-confirm" className="text-sm text-orange-800">
                  I understand this will halt trading for ALL tenants
                </Label>
              </div>
            </div>
          )}

          {/* Profile Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Action Profile</Label>
            <RadioGroup value={profile} onValueChange={(value: 'soft' | 'hard') => setProfile(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="soft" id="profile-soft" />
                <Label htmlFor="profile-soft">Soft Halt - block new orders only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="profile-hard" />
                <Label htmlFor="profile-hard">Hard Halt - block new orders + cancel existing</Label>
              </div>
            </RadioGroup>
            {profile === 'hard' && (
              <p className="text-sm text-orange-600 ml-6">
                ⚠️ This will attempt to cancel all open orders across exchanges
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (required)</Label>
            <Textarea
              id="reason"
              placeholder="Describe why the kill switch is being activated..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              data-testid="input-reason"
            />
          </div>

          {/* Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="confirm">Type "PAUSE" to confirm</Label>
            <Input
              id="confirm"
              placeholder="PAUSE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={canConfirmEngage ? 'border-red-300' : ''}
              data-testid="input-confirm"
            />
          </div>

          {/* Warning */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Expected Effects:</strong>
            </p>
            <ul className="text-sm text-red-700 mt-1 space-y-1">
              <li>• API will reject new orders with HTTP 423 Locked</li>
              <li>• Bots will transition to PAUSED_EMERGENCY state</li>
              <li>• Start/Resume actions will be disabled in UI</li>
              {profile === 'hard' && <li>• All open orders will be cancelled</li>}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setDialogOpen(false)}
            data-testid="button-cancel-engage"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEngage}
            disabled={!canConfirmEngage || isLoading}
            variant="destructive"
            data-testid="button-confirm-engage"
          >
            {isLoading ? 'Engaging...' : 'Engage Kill Switch'}
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}