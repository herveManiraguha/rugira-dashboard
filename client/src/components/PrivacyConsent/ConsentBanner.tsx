import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Cookie, Shield, X } from 'lucide-react';

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem('privacy-consent');
    if (!storedConsent) {
      setShowBanner(true);
    } else {
      setConsent(storedConsent);
      if (storedConsent === 'accepted') {
        loadAnalytics();
      }
    }
  }, []);

  const loadAnalytics = () => {
    // Only load GA after consent
    if (typeof window !== 'undefined' && !(window as any).gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER';
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtag = function(...args: any[]) { 
        (window as any).dataLayer.push(args); 
      };
      (window as any).gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-PLACEHOLDER');
    }
  };

  const handleAccept = () => {
    localStorage.setItem('privacy-consent', 'accepted');
    localStorage.setItem('privacy-consent-date', new Date().toISOString());
    setConsent('accepted');
    setShowBanner(false);
    loadAnalytics();
  };

  const handleReject = () => {
    localStorage.setItem('privacy-consent', 'rejected');
    localStorage.setItem('privacy-consent-date', new Date().toISOString());
    setConsent('rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 border-t shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Privacy & Cookies</p>
              <p className="text-xs text-muted-foreground max-w-2xl">
                We use cookies to enhance your experience and analyze site usage. 
                By accepting, you consent to our use of cookies and analytics. 
                <a href="/privacy" className="underline ml-1">Privacy Policy</a>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              data-testid="button-reject-cookies"
            >
              Reject
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              data-testid="button-accept-cookies"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}