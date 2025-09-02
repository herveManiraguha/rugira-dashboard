import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/lib/rbac';
import { useToast } from '@/hooks/use-toast';

interface ApprovalRequest {
  id: string;
  type: 'bot_mode_change' | 'risk_increase' | 'venue_connection';
  requester: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  details: {
    from?: string;
    to?: string;
    botName?: string;
    venueName?: string;
    riskChange?: string;
  };
}

export function ApprovalsDrawer() {
  const { user, currentTenant } = useAuth();
  const rbac = useRBAC(user, currentTenant);
  const { toast } = useToast();
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: '1',
      type: 'bot_mode_change',
      requester: 'Martin Keller',
      timestamp: new Date(Date.now() - 3600000),
      status: 'pending',
      details: {
        from: 'Paper',
        to: 'Live',
        botName: 'BTCUSD-MM-01'
      }
    },
    {
      id: '2',
      type: 'risk_increase',
      requester: 'Lin Zhang',
      timestamp: new Date(Date.now() - 7200000),
      status: 'pending',
      details: {
        botName: 'ETHUSD-ARB-02',
        riskChange: 'Daily loss limit: $5,000 → $10,000'
      }
    }
  ]);

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const canApprove = rbac.can('approve_changes');

  const handleApproval = (id: string, approved: boolean) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, status: approved ? 'approved' : 'rejected' }
        : req
    ));
    
    toast({
      title: approved ? "Request Approved" : "Request Rejected",
      description: `The request has been ${approved ? 'approved' : 'rejected'} successfully.`,
    });
  };

  const getTypeLabel = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'bot_mode_change':
        return 'Mode Change';
      case 'risk_increase':
        return 'Risk Increase';
      case 'venue_connection':
        return 'Venue Connection';
    }
  };

  const getTypeIcon = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'bot_mode_change':
        return <AlertTriangle className="w-4 h-4" />;
      case 'risk_increase':
        return <AlertTriangle className="w-4 h-4" />;
      case 'venue_connection':
        return <Bell className="w-4 h-4" />;
    }
  };

  if (!canApprove) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {pendingCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
            >
              {pendingCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Pending Approvals</SheetTitle>
          <SheetDescription>
            Review and approve pending requests
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(request.type)}
                    <Badge variant="outline">
                      {getTypeLabel(request.type)}
                    </Badge>
                  </div>
                  <Badge
                    variant={
                      request.status === 'pending' ? 'outline' :
                      request.status === 'approved' ? 'default' : 'destructive'
                    }
                  >
                    {request.status}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">{request.requester}</p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {request.timestamp.toLocaleString()}
                  </p>
                </div>

                <div className="bg-muted/50 rounded p-2 text-sm">
                  {request.type === 'bot_mode_change' && (
                    <p>
                      Change {request.details.botName} from{' '}
                      <Badge variant="outline" className="mx-1">
                        {request.details.from}
                      </Badge>
                      to
                      <Badge variant="destructive" className="mx-1">
                        {request.details.to}
                      </Badge>
                    </p>
                  )}
                  {request.type === 'risk_increase' && (
                    <p>
                      {request.details.botName}: {request.details.riskChange}
                    </p>
                  )}
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproval(request.id, true)}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleApproval(request.id, false)}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}