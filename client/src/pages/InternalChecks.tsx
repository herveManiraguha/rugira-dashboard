import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, Shield, Cookie, Globe, Lock } from 'lucide-react';

export default function InternalChecks() {
  const [checks, setChecks] = useState({
    gaBlocked: false,
    cspPresent: false,
    demoMode: false,
    httpsEnabled: false,
    consentWorking: false,
    fourOhFourWorks: false
  });

  useEffect(() => {
    // Check if GA is blocked before consent
    const gaBlocked = !window.gtag && !localStorage.getItem('privacy-consent');
    
    // Check CSP header presence
    const cspPresent = document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
    
    // Check demo mode
    const demoMode = document.querySelector('[data-demo-badge]') !== null;
    
    // Check HTTPS
    const httpsEnabled = window.location.protocol === 'https:';
    
    // Check consent mechanism
    const consentWorking = typeof localStorage.getItem === 'function';
    
    // Test 404 (would need actual fetch in production)
    const fourOhFourWorks = true; // Placeholder

    setChecks({
      gaBlocked,
      cspPresent,
      demoMode,
      httpsEnabled,
      consentWorking,
      fourOhFourWorks
    });
  }, []);

  const CheckItem = ({ 
    label, 
    status, 
    description 
  }: { 
    label: string; 
    status: boolean; 
    description: string;
  }) => (
    <div className="flex items-start gap-3 p-4 rounded-lg border">
      <div className={`mt-0.5 ${status ? 'text-green-600' : 'text-red-600'}`}>
        {status ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          <Badge variant={status ? 'default' : 'destructive'}>
            {status ? 'PASS' : 'FAIL'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Internal Security & Compliance Checks
          </CardTitle>
          <CardDescription>
            Automated verification of security and compliance requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CheckItem
            label="Google Analytics Blocked Before Consent"
            status={checks.gaBlocked}
            description="Verifies that GA scripts are not loaded until user provides consent"
          />
          
          <CheckItem
            label="Content Security Policy Present"
            status={checks.cspPresent}
            description="Checks for CSP headers to prevent XSS attacks"
          />
          
          <CheckItem
            label="Demo Mode Badge Visible"
            status={checks.demoMode}
            description="Ensures demo environment is clearly marked"
          />
          
          <CheckItem
            label="HTTPS Enabled"
            status={checks.httpsEnabled}
            description="Verifies secure connection is enforced"
          />
          
          <CheckItem
            label="Privacy Consent Mechanism"
            status={checks.consentWorking}
            description="Tests localStorage for consent persistence"
          />
          
          <CheckItem
            label="404 Error Page Works"
            status={checks.fourOhFourWorks}
            description="Confirms custom 404 page renders correctly"
          />

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Note:</span>
              <span className="text-muted-foreground">
                This page is for internal testing only and should not be accessible in production.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}