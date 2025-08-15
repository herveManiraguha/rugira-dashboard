import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// CORS configuration for production and development
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction ? [
  'https://app.rugira.ch',        // Production domain ONLY
  'https://rugira.ch',            // Main site
] : [
  'https://app.rugira.ch',        // Production domain
  'https://rugira.ch',            // Main site
  'http://localhost:5000',        // Local development
  'http://localhost:3000',        // Vite dev server
  'http://127.0.0.1:5000',        // Local development
  // Allow Replit domains in development only
];

// Middleware to block Replit preview domains entirely
app.use((req, res, next) => {
  const host = req.get('host') || '';
  const origin = req.get('origin') || '';
  
  // In production, block rugira-dashboard.replit.app and all Replit preview domains
  if (isProduction && (host.includes('replit.app') || 
      host.includes('replit.dev') || 
      host.includes('repl.co') ||
      origin.includes('replit.app') || 
      origin.includes('replit.dev') || 
      origin.includes('repl.co'))) {
    
    console.log(`🚫 Blocked Replit domain access: ${host} (origin: ${origin})`);
    
    // For HTML requests, redirect to the official domain
    if (req.headers.accept?.includes('text/html')) {
      return res.redirect(301, 'https://app.rugira.ch');
    }
    
    // For API requests, return JSON error
    return res.status(403).json({
      error: 'Access Denied',
      message: 'This application is only available at https://app.rugira.ch',
      redirect: 'https://app.rugira.ch'
    });
  }
  
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // In production, block all Replit domains
    if (isProduction && (origin.includes('replit.app') || 
        origin.includes('replit.dev') || 
        origin.includes('repl.co'))) {
      console.log(`🚫 CORS blocked Replit domain in production: ${origin}`);
      return callback(new Error('Access denied - use https://app.rugira.ch'));
    }
    
    // In development, allow localhost and Replit domains
    if (!isProduction) {
      if (origin.startsWith('http://localhost') || 
          origin.startsWith('http://127.0.0.1') ||
          origin.includes('replit.dev') ||
          origin.includes('repl.co') ||
          origin.includes('janeway.replit.dev')) {
        return callback(null, true);
      }
    }
    
    // Check if origin matches allowed patterns
    const isAllowed = allowedOrigins.some(allowed => {
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Access denied - use https://app.rugira.ch'));
    }
  },
  credentials: true, // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
}));

// Session configuration
if (isProduction && process.env.DATABASE_URL) {
  // PostgreSQL session store for production
  const PgSession = connectPgSimple(session);
  
  app.use(session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'rugira-trading-dashboard-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction, // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: isProduction ? '.rugira.ch' : undefined, // Subdomain support in production
      sameSite: isProduction ? 'none' : 'lax', // Cross-site cookies for production
    },
    name: 'rugira.sid', // Custom session name
  }));
} else {
  // Memory session store for development
  app.use(session({
    secret: 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));
}

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (isProduction) {
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: http:; " +
      "connect-src 'self' https://app.rugira.ch wss://app.rugira.ch;"
    );
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 80 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
