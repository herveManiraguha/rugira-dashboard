import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to block access from Replit preview domains
 * Only allows access from app.rugira.ch in production
 */
export function blockReplatDomains(req: Request, res: Response, next: NextFunction) {
  const host = req.get('host') || '';
  const origin = req.get('origin') || '';
  const userAgent = req.get('user-agent') || '';
  
  // List of blocked domains
  const blockedDomains = [
    'replit.app',
    'replit.dev', 
    'repl.co',
    'rugira-dashboard.replit.app' // Explicitly block this domain
  ];
  
  // Check if request is from a blocked domain
  const isBlocked = blockedDomains.some(blocked => 
    host.includes(blocked) || origin.includes(blocked)
  );
  
  if (isBlocked) {
    console.log(`🚫 Blocked access from: ${host} (Origin: ${origin}, UA: ${userAgent})`);
    
    // For API requests, return JSON
    if (req.path.startsWith('/api/')) {
      return res.status(403).json({
        error: 'Access Denied',
        message: 'This application is only available at https://app.rugira.ch',
        redirect: 'https://app.rugira.ch'
      });
    }
    
    // For web requests, redirect to the official domain
    return res.status(301).redirect('https://app.rugira.ch');
  }
  
  next();
}