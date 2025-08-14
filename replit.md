# Rugira Trading Dashboard

## Overview

Rugira is a professional trading bot management dashboard built as a Single Page Application (SPA) for app.rugira.ch. The application provides real-time monitoring, compliance tools, and comprehensive bot management capabilities with a clean Swiss-inspired design. It features a React frontend with TypeScript, Express backend, and PostgreSQL database integration, designed for professional trading bot users.

## Current Status (August 14, 2025)

✓ React-based frontend fully implemented with TypeScript
✓ Official Rugira logo integrated as favicon and sidebar branding
✓ Production build stable and functional on port 5000
✓ API backend operational with health checks and sample data
✓ WebSocket issues resolved by using production build instead of development server
✓ All core pages implemented: Overview, Bots, Strategies, Exchanges, Compliance, Reports, Backtesting, Monitoring, Admin, Help

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **Session-based authentication** infrastructure with PostgreSQL storage
- **CORS configuration** for secure cross-origin requests
- **Security headers** including CSP, X-Frame-Options, and referrer policy

### External Service Integrations
- **Environment-based API configuration** using VITE_API_BASE_URL
- **Real-time WebSocket connections** with fallback to polling
- **Font integration** with Google Fonts (Inter)
- **Icon system** using Font Awesome and Lucide React
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