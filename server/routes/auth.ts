import { Router } from 'express';

const router = Router();

// Get Okta configuration for client
router.get('/config', (req, res) => {
  // Check if Okta environment variables are configured
  const hasOktaConfig = !!(process.env.OKTA_DOMAIN && process.env.OKTA_CLIENT_ID && process.env.OKTA_CLIENT_SECRET);
  
  if (hasOktaConfig) {
    res.json({
      domain: process.env.OKTA_DOMAIN,
      clientId: process.env.OKTA_CLIENT_ID,
      hasConfig: true,
      isDemoMode: false
    });
  } else {
    res.json({
      hasConfig: false,
      isDemoMode: true
    });
  }
});

// Handle Okta callback (placeholder for now)
router.post('/callback', (req, res) => {
  // In a real implementation, this would handle the Okta callback
  res.json({ success: true, message: 'Callback handled' });
});

export default router;