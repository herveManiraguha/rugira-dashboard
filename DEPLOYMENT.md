# Rugira Trading Dashboard - Production Deployment Configuration

## Domain Configuration

### CORS Setup
The application is configured to allow requests from:
- **Production**: `https://app.rugira.ch` and `https://rugira.ch`
- **Development**: `localhost` domains and Replit preview domains

### Cookie Configuration
- **Domain**: `.rugira.ch` (allows subdomains)
- **Secure**: `true` (HTTPS only)
- **SameSite**: `none` (cross-site support)
- **HttpOnly**: `true` (XSS protection)

## OAuth Provider Configuration

### Required Callback URLs
Add these URLs to your OAuth provider (Auth0, Clerk, Cognito, Keycloak, etc.):

#### Production URLs
- **Login callback**: `https://app.rugira.ch/auth/callback`
- **Post-logout redirect**: `https://rugira.ch`
- **Token refresh**: `https://app.rugira.ch/auth/refresh`

#### Development URLs
- **Local development**: `http://localhost:5000/auth/callback`
- **Replit preview**: `https://your-replit-preview.replit.dev/auth/callback`

### Environment Variables
Set these in your production environment:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
SESSION_SECRET=your-production-session-secret
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
```

## Security Features

### CORS Configuration
- Origin validation with wildcard support for Replit domains
- Credentials support enabled for authentication
- Comprehensive method and header allowlists

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- Referrer Policy

### Session Management
- PostgreSQL-backed sessions in production
- Memory sessions in development
- Secure cookie configuration
- 24-hour session lifetime

## Database Requirements

### Session Table
The application automatically creates a `user_sessions` table for session storage when using PostgreSQL.

### Connection String Format
```
postgresql://username:password@hostname:port/database
```

## Deployment Checklist

- [ ] Update OAuth provider with production callback URLs
- [ ] Set `NODE_ENV=production`
- [ ] Configure `DATABASE_URL` environment variable
- [ ] Generate secure `SESSION_SECRET`
- [ ] Verify domain DNS points to deployment
- [ ] Test authentication flow on production domain
- [ ] Verify CORS allows app.rugira.ch
- [ ] Confirm SSL certificate is valid