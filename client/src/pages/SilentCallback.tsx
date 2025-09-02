import React, { useEffect } from 'react';
import { UserManager } from 'oidc-client-ts';
import { oktaConfig } from '@/lib/oktaConfig';

export default function SilentCallback() {
  useEffect(() => {
    const handleSilentCallback = async () => {
      try {
        const userManager = new UserManager(oktaConfig);
        await userManager.signinSilentCallback();
        // Close the popup/iframe
        window.close();
      } catch (error) {
        console.error('Silent callback error:', error);
        window.close();
      }
    };

    handleSilentCallback();
  }, []);

  return (
    <div style={{ display: 'none' }}>
      Processing...
    </div>
  );
}