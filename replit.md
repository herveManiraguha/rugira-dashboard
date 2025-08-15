# Rugira Trading Dashboard

## Overview

Rugira is a professional trading bot management dashboard built as a Single Page Application (SPA) for app.rugira.ch. The application provides real-time monitoring, compliance tools, and comprehensive bot management capabilities with a clean Swiss-inspired design. It features a React frontend with TypeScript, Express backend, and PostgreSQL database integration, designed for professional trading bot users.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (Aug 15, 2025)

### Authentication System Implementation
- **Complete mock authentication system** with secure session management
- **Login credentials**: hanz.mueller / Hanz1234! (demo credentials hidden in UI)
- **Professional login form** with proper validation and error handling
- **Protected routes** with automatic redirect to login for unauthorized access
- **User profile integration** showing authenticated user in navigation sidebar
- **Session persistence** using sessionStorage for security
- **Logout functionality** redirecting to rugira.ch main site

### UI and Branding Updates
- **Updated logo implementation** across all pages (Login, MainLayout)
- **Rugira Swiss shield logo** with cross cutout and Inyambo horns in official SVG format
- **Removed home page** to avoid content duplication with marketing website (rugira.ch)
- **Direct login experience** - root route redirects to login page
- **Consistent branding** using Swiss red (#E10600) and green (#1B7A46) color scheme
- **Mobile-responsive design** with proper spacing and typography

### Technical Improvements
- **Fixed React component state management** to prevent infinite update loops
- **CORS configuration** optimized for development environment compatibility
- **Production-ready setup** for app.rugira.ch deployment with security headers
- **Session-based authentication** with PostgreSQL backend support ready

## Production Configuration

### Domain Setup (Updated: Aug 15, 2025)
- **Production Domain**: app.rugira.ch
- **Main Site**: rugira.ch
- **CORS Configuration**: Configured for cross-subdomain support
- **Session Management**: PostgreSQL-backed with .rugira.ch domain cookies
- **Security**: Full HTTPS enforcement with comprehensive security headers

### OAuth Configuration Required
- **Production Callback**: https://app.rugira.ch/auth/callback
- **Post-logout Redirect**: https://rugira.ch
- **Cookie Domain**: .rugira.ch with Secure=true, SameSite=None

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and component-based UI development
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing with SPA fallback support
- **TanStack Query** for server state management and API data caching
- **Shadcn/ui** component library built on Radix UI primitives for consistent design
- **Tailwind CSS** with custom Swiss-inspired design tokens and color system
- **Custom design system** featuring brand colors (Swiss red #E10600, green #1B7A46) and Inter font

### Backend Architecture
- **Express.js** server with TypeScript for RESTful API endpoints
- **WebSocket integration** for real-time updates and heartbeat monitoring
- **Modular route system** with centralized error handling
- **Memory storage interface** with extensible design for database integration
- **Health check endpoints** for system monitoring

### Data Storage Solutions
- **Drizzle ORM** configured for PostgreSQL with migration support
- **Neon Database** integration for serverless PostgreSQL hosting
- **Schema-driven development** with shared types between frontend and backend
- **Session management** using connect-pg-simple for PostgreSQL-backed sessions

### Authentication and Authorization
- **Bearer token authentication** prepared in API client
- **Session-based authentication** with PostgreSQL storage using connect-pg-simple
- **Production CORS configuration** for app.rugira.ch and rugira.ch domains
- **Comprehensive security headers** including CSP, HSTS, X-Frame-Options, and referrer policy
- **Cross-subdomain session support** with .rugira.ch domain configuration
- **Development fallback** with memory sessions and localhost CORS support

### External Service Integrations
- **Environment-based API configuration** using VITE_API_BASE_URL
- **Real-time WebSocket connections** with fallback to polling
- **Font integration** with Google Fonts (Inter)
- **Icon system** using Font Awesome and Lucide React
- **Brand identity** with custom Rugira logo (Swiss shield with cross cutout and Inyambo horns)
- **Build and deployment** optimized for Replit hosting with custom domain support

### Key Design Patterns
- **Component composition** using Radix UI primitives with custom styling
- **Type-safe API integration** with shared schema definitions
- **Real-time data synchronization** through WebSocket and polling strategies
- **Responsive design** with mobile-first approach
- **Accessibility-first** component design using ARIA standards
- **Modular CSS architecture** with CSS variables for theme consistency

## External Dependencies

### Core Framework Dependencies
- React 18 with TypeScript for frontend development
- Express.js for backend API server
- Vite for build tooling and development server
- Node.js runtime environment

### Database and ORM
- PostgreSQL via Neon Database for data persistence
- Drizzle ORM for type-safe database operations
- connect-pg-simple for session storage

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- Shadcn/ui component system
- Google Fonts (Inter) for typography
- Font Awesome and Lucide React for icons
- Custom Rugira logo assets (favicon.svg and logo.svg)

### State Management and API
- TanStack React Query for server state management
- Axios for HTTP client with interceptors
- Wouter for client-side routing

### Development and Build Tools
- TypeScript for type safety
- ESBuild for production bundling
- PostCSS with Autoprefixer
- Replit development environment integration

### Real-time Communication
- WebSocket (ws) for real-time updates
- Server-Sent Events fallback capability
- Heartbeat monitoring system

### Security and Authentication
- CORS middleware for cross-origin security
- Content Security Policy headers
- Bearer token authentication system
- Session management infrastructure