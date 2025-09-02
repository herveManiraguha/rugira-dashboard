import React from 'react';
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
import { Code, Settings, Key, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoMode } from '@/lib/oktaConfig';

export function ConfigDrawer() {
  const { user, currentTenant } = useAuth();

  if (!isDemoMode || !user) return null;

  const tokenClaims = {
    sub: user.id,
    name: user.profile?.name,
    email: user.profile?.email,
    tenant: currentTenant,
    roles: user.tenant_roles?.[currentTenant || ''] || [],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  };

  const featureFlags = {
    'demo_mode': true,
    'paper_trading': true,
    'live_trading': false,
    'kill_switch': true,
    'compliance_exports': true,
    'ai_assistant': false,
    'advanced_charts': true,
    'websocket_feeds': false
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="fixed bottom-4 right-4 opacity-50 hover:opacity-100"
        >
          <Code className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Developer Configuration
          </SheetTitle>
          <SheetDescription>
            Local development tools and debugging information (Demo only)
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-6">
            {/* User Context */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                User Context
              </h3>
              <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{user.profile?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Tenant:</span>
                  <Badge variant="outline">{currentTenant}</Badge>
                </div>
              </div>
            </div>

            {/* Token Claims */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Key className="w-4 h-4" />
                Token Claims (Decoded)
              </h3>
              <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                {JSON.stringify(tokenClaims, null, 2)}
              </pre>
            </div>

            {/* Tenant Roles */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Tenant Roles
              </h3>
              <div className="space-y-2">
                {Object.entries(user.tenant_roles || {}).map(([tenant, roles]) => (
                  <div key={tenant} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm font-medium">{tenant}</span>
                    <div className="flex gap-1">
                      {(roles as string[]).map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Flags */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Feature Flags
              </h3>
              <div className="space-y-1">
                {Object.entries(featureFlags).map(([flag, enabled]) => (
                  <div key={flag} className="flex items-center justify-between p-2">
                    <span className="text-sm font-mono">{flag}</span>
                    <Badge variant={enabled ? "default" : "outline"}>
                      {enabled ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-xs text-orange-700 dark:text-orange-300">
                This drawer is only visible in demo mode and should not appear in production.
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}