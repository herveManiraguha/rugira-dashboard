import { Request, Response, NextFunction } from 'express';

// Extend Request type to include session and user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role?: string;
      };
    }
  }
}

// Authentication middleware
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Check for Bearer token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Check for session-based auth
  const sessionUser = req.session?.user;

  if (token) {
    // TODO: Implement token verification when OAuth is set up
    // For now, allow all requests with tokens
    req.user = { id: 'token-user', email: 'user@example.com', name: 'Token User' };
    return next();
  }

  if (sessionUser) {
    req.user = sessionUser;
    return next();
  }

  // No authentication found
  return res.status(401).json({ 
    message: 'Authentication required',
    redirectTo: '/login'
  });
};

// Optional authentication middleware (doesn't require auth)
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const sessionUser = req.session?.user;

  if (token) {
    req.user = { id: 'token-user', email: 'user@example.com', name: 'Token User' };
  } else if (sessionUser) {
    req.user = sessionUser;
  }

  next();
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role && roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ message: 'Insufficient permissions' });
  };
};

// Authentication routes
export const authRoutes = (app: any) => {
  // Login endpoint (placeholder for OAuth integration)
  app.post('/api/auth/login', (req: Request, res: Response) => {
    // TODO: Implement OAuth login flow
    const { email, name } = req.body;
    
    req.session!.user = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user'
    };

    res.json({ 
      message: 'Login successful',
      user: req.session!.user,
      redirectTo: '/dashboard'
    });
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      
      res.clearCookie('rugira.sid');
      res.json({ 
        message: 'Logout successful',
        redirectTo: process.env.NODE_ENV === 'production' ? 'https://rugira.ch' : '/'
      });
    });
  });

  // Get current user
  app.get('/api/auth/user', optionalAuth, (req: Request, res: Response) => {
    if (req.user) {
      res.json({ user: req.user, authenticated: true });
    } else {
      res.json({ user: null, authenticated: false });
    }
  });

  // OAuth callback endpoint (placeholder)
  app.get('/auth/callback', (req: Request, res: Response) => {
    // TODO: Implement OAuth callback handling
    // This would typically:
    // 1. Exchange authorization code for tokens
    // 2. Get user info from OAuth provider
    // 3. Store session or JWT
    // 4. Redirect to dashboard
    
    res.redirect(
      process.env.NODE_ENV === 'production' 
        ? 'https://app.rugira.ch/dashboard'
        : '/dashboard'
    );
  });
};