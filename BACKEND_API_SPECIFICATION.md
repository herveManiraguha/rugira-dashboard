# Rugira Trading Dashboard - Backend API Specification

## Overview
The Rugira Trading Dashboard is a professional trading bot management platform for app.rugira.ch. It provides comprehensive tools for monitoring and controlling automated trading strategies with a focus on compliance, risk management, and operational excellence.

## Authentication & Security

### Authentication Flow
- **Login Endpoint**: `POST /api/auth/login`
  - Accepts: `{ username: string, password: string }`
  - Returns: `{ access_token: string, user: UserObject }`
  - Sets secure HTTP-only session cookie
  
- **Session Management**:
  - Session-based authentication with PostgreSQL storage
  - 30-minute default timeout with activity extension
  - Secure in-memory token storage on frontend
  - Auto-logout on session expiry

- **Security Headers**:
  - HTTPS enforcement with automatic redirect
  - Content Security Policy (CSP)
  - HSTS, X-Frame-Options, X-Content-Type-Options
  - CORS configured for app.rugira.ch domain

## Core Data Models

### 1. User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'trader' | 'viewer';
  timezone: string;
  language: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
  lastLogin: Date;
}
```

### 2. Bot Model
```typescript
interface Bot {
  id: string;
  name: string;
  status: 'Running' | 'Stopped' | 'Paused' | 'Error';
  strategy: string;
  venue: string;  // Changed from 'exchange'
  routeVia?: string;  // For tokenized venues (e.g., "InCore Bank")
  environment: 'Live' | 'Paper';
  profitLoss: number;
  profitLossPercent: number;
  dailyVolume: number;
  activePositions: number;
  uptime: string;
  lastActivity: Date;
  riskLevel: 'Low' | 'Medium' | 'High';
  allocatedCapital: number;
  currentCapital: number;
  maxDrawdown: number;
  winRate: number;
  averageTradeSize: number;
  tradesLast24h: number;
  errorRate: number;
  apiLatency: number;
  configuration: BotConfiguration;
}

interface BotConfiguration {
  maxPositionSize: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop: boolean;
  riskPerTrade: number;
  allowedPairs: string[];
  tradingHours: TradingHours;
  rebalanceFrequency: string;
}
```

### 3. Venue Model (formerly Exchange)
```typescript
interface Venue {
  id: string;
  name: string;
  type: 'crypto' | 'tokenized';
  category?: 'exchange' | 'broker' | 'issuer';  // For tokenized venues
  status: 'Connected' | 'Disconnected' | 'Error' | 'Maintenance';
  apiStatus: 'Active' | 'Limited' | 'Down';
  balance: number;
  activeOrders: number;
  dailyVolume: number;
  lastSync: Date;
  connectivity?: {
    type: 'FIX' | 'API' | 'WebSocket';
    dropCopy?: boolean;
    t0Settlement?: boolean;
  };
  instruments?: string[];  // Available trading instruments
  logo?: string;  // URL to venue logo
}

// Specific venues to support:
// Crypto: Binance, Coinbase, Kraken, KuCoin, OKX, Bitfinex, Bybit, Gate.io
// Tokenized: BX Digital, SDX, Taurus TDX, Securitize, Franklin
```

### 4. Strategy Model
```typescript
interface Strategy {
  id: string;
  name: string;
  type: 'Arbitrage' | 'Market Making' | 'Trend Following' | 'Mean Reversion' | 'Grid Trading';
  status: 'Active' | 'Inactive' | 'Testing';
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    totalTrades: number;
  };
  backtestResults?: BacktestResult[];
  parameters: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. Portfolio Model
```typescript
interface Portfolio {
  totalValue: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  positions: Position[];
  riskMetrics: {
    var95: number;
    sharpeRatio: number;
    beta: number;
    maxDrawdown: number;
  };
  allocation: AssetAllocation[];
  performanceHistory: PerformancePoint[];
}

interface Position {
  id: string;
  symbol: string;
  venue: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  positionValue: number;
  openedAt: Date;
  botId?: string;
}
```

### 6. Order Model
```typescript
interface Order {
  id: string;
  botId: string;
  venue: string;
  symbol: string;
  type: 'Market' | 'Limit' | 'Stop' | 'StopLimit';
  side: 'Buy' | 'Sell';
  status: 'Pending' | 'Filled' | 'PartiallyFilled' | 'Cancelled' | 'Rejected';
  quantity: number;
  price?: number;
  filledQuantity: number;
  averagePrice?: number;
  fee: number;
  createdAt: Date;
  executedAt?: Date;
  error?: string;
}
```

### 7. Alert Model
```typescript
interface Alert {
  id: string;
  type: 'Error' | 'Warning' | 'Info' | 'Success';
  category: 'System' | 'Trading' | 'Compliance' | 'Security';
  title: string;
  message: string;
  venue?: string;
  botId?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  isRead: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}
```

### 8. Compliance Model
```typescript
interface ComplianceViolation {
  id: string;
  type: 'Position Limit' | 'Risk Limit' | 'Pattern Violation' | 'Regulatory';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Resolved' | 'Acknowledged';
  description: string;
  botId?: string;
  venue?: string;
  detectedAt: Date;
  resolvedAt?: Date;
  recommendation: string;
}

interface ComplianceReport {
  period: string;
  totalViolations: number;
  criticalViolations: number;
  resolvedViolations: number;
  violationsByType: Record<string, number>;
  riskScore: number;
  recommendations: string[];
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Check session status
- `POST /api/auth/refresh` - Refresh session

### Bots Management
- `GET /api/bots` - List all bots
- `GET /api/bots/:id` - Get bot details
- `POST /api/bots` - Create new bot
- `PUT /api/bots/:id` - Update bot configuration
- `DELETE /api/bots/:id` - Delete bot
- `POST /api/bots/:id/start` - Start bot
- `POST /api/bots/:id/stop` - Stop bot
- `POST /api/bots/:id/pause` - Pause bot
- `GET /api/bots/:id/logs` - Get bot logs
- `GET /api/bots/:id/performance` - Get performance metrics

### Venues (formerly Exchanges)
- `GET /api/venues` - List all venues
- `GET /api/venues/:id` - Get venue details
- `POST /api/venues/connect` - Connect new venue
- `DELETE /api/venues/:id` - Disconnect venue
- `POST /api/venues/:id/sync` - Sync venue data
- `GET /api/venues/:id/balance` - Get venue balance
- `GET /api/venues/:id/instruments` - Get available instruments
- `POST /api/venues/:id/test-order` - Send test order (Paper only)

### Strategies
- `GET /api/strategies` - List all strategies
- `GET /api/strategies/:id` - Get strategy details
- `POST /api/strategies` - Create strategy
- `PUT /api/strategies/:id` - Update strategy
- `DELETE /api/strategies/:id` - Delete strategy
- `POST /api/strategies/:id/backtest` - Run backtest
- `GET /api/strategies/:id/backtest/:backtestId` - Get backtest results
- `POST /api/strategies/compare` - Compare multiple strategies

### Portfolio
- `GET /api/portfolio` - Get portfolio overview
- `GET /api/portfolio/positions` - Get all positions
- `GET /api/portfolio/history` - Get performance history
- `GET /api/portfolio/allocation` - Get asset allocation
- `GET /api/portfolio/risk` - Get risk metrics

### Orders
- `GET /api/orders` - List orders (with filters)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create manual order
- `DELETE /api/orders/:id` - Cancel order
- `GET /api/orders/history` - Get order history

### Market Data
- `GET /api/market/prices` - Get current prices
- `GET /api/market/orderbook/:symbol` - Get order book
- `GET /api/market/trades/:symbol` - Get recent trades
- `GET /api/market/candles/:symbol` - Get OHLCV data
- `GET /api/market/stats` - Get market statistics

### Monitoring & Alerts
- `GET /api/monitoring/alerts` - Get active alerts
- `PUT /api/monitoring/alerts/:id/acknowledge` - Acknowledge alert
- `GET /api/monitoring/metrics` - Get system metrics
- `GET /api/monitoring/health` - Health check endpoint
- `POST /api/monitoring/test-alert` - Send test alert

### Compliance
- `GET /api/compliance/violations` - List violations
- `GET /api/compliance/reports` - Get compliance reports
- `PUT /api/compliance/violations/:id/resolve` - Resolve violation
- `GET /api/compliance/audit-log` - Get audit trail
- `POST /api/compliance/reconciliation` - Run T+0 reconciliation

### Settings
- `GET /api/settings/user` - Get user settings
- `PUT /api/settings/user` - Update user settings
- `GET /api/settings/trading` - Get trading settings
- `PUT /api/settings/trading` - Update trading settings
- `GET /api/settings/notifications` - Get notification preferences
- `PUT /api/settings/notifications` - Update notification preferences
- `POST /api/settings/api-keys` - Update API keys
- `POST /api/settings/export` - Export settings
- `POST /api/settings/import` - Import settings

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/activity` - Get activity logs
- `POST /api/admin/broadcast` - Send broadcast message

### Kill Switch
- `GET /api/killswitch/status` - Get kill switch status
- `POST /api/killswitch/activate` - Activate kill switch
- `POST /api/killswitch/deactivate` - Deactivate kill switch
- `GET /api/killswitch/history` - Get activation history

## Real-time Updates (WebSocket/SSE)

### WebSocket Events
```typescript
// Client -> Server
interface ClientMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping';
  channel?: 'bots' | 'orders' | 'alerts' | 'market' | 'portfolio';
  params?: any;
}

// Server -> Client
interface ServerMessage {
  type: 'update' | 'error' | 'pong';
  channel: string;
  data: any;
  timestamp: Date;
}
```

### SSE Fallback Endpoints
- `GET /api/stream/bots` - Bot status updates
- `GET /api/stream/orders` - Order updates
- `GET /api/stream/alerts` - New alerts
- `GET /api/stream/market` - Market data updates
- `GET /api/stream/portfolio` - Portfolio changes

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {...},
  "timestamp": "2024-12-29T10:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {...}
  },
  "timestamp": "2024-12-29T10:00:00Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 100
  },
  "timestamp": "2024-12-29T10:00:00Z"
}
```

## Rate Limiting
- Default: 100 requests per minute per user
- Trading endpoints: 20 requests per minute
- Market data: 300 requests per minute
- WebSocket: 10 messages per second

## Data Consistency Requirements

### Critical Data Points
1. **Bot Status**: Must be real-time accurate
2. **Position Data**: Must match venue records
3. **Order Status**: Must reflect actual execution state
4. **Balance Information**: Must be synchronized with venues
5. **Risk Metrics**: Must be calculated in real-time

### Caching Strategy
- User data: 5 minutes
- Market data: 1 second
- Bot status: No caching (real-time)
- Portfolio data: 30 seconds
- Compliance reports: 1 hour
- Static data (venues, strategies): 10 minutes

## Special Features

### Kill Switch
- Instantly stops all trading activity
- Cancels all pending orders
- Prevents new order creation
- Maintains position tracking
- Sends emergency notifications
- Logs all actions for audit

### Paper Trading Mode
- Simulated order execution
- Virtual balance management
- Real market data integration
- Performance tracking
- Risk-free testing environment

### T+0 Reconciliation (Tokenized Venues)
- Real-time settlement tracking
- Drop-copy integration for BX Digital
- Position reconciliation
- Settlement confirmation
- Regulatory reporting

### Multi-Venue Support
- Unified order management
- Cross-venue arbitrage detection
- Aggregated portfolio view
- Venue-specific compliance rules
- Smart order routing

## Environment Variables Required
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=...
CORS_ORIGIN=https://app.rugira.ch
NODE_ENV=production
PORT=5000
WS_PORT=5001
REDIS_URL=...  # For session storage
LOG_LEVEL=info
```

## Database Schema Requirements
- Users table with authentication
- Bots table with configuration
- Venues table with credentials
- Orders table with history
- Positions table with real-time data
- Alerts table with acknowledgments
- Compliance violations table
- Audit log table
- Session storage table

## Security Considerations
1. All API keys encrypted at rest
2. Session tokens with secure flags
3. Rate limiting per user/IP
4. Input validation on all endpoints
5. SQL injection prevention
6. XSS protection
7. CSRF tokens for state-changing operations
8. Audit logging for all actions
9. IP whitelisting for admin endpoints
10. Two-factor authentication support

## Performance Requirements
- API response time: < 200ms (p95)
- WebSocket latency: < 50ms
- Order execution: < 100ms
- Dashboard load time: < 2 seconds
- Real-time update frequency: 1-5 seconds
- Uptime SLA: 99.9%

## Integration Points
1. **Exchange APIs**: Direct integration with major crypto exchanges
2. **Tokenized Venue APIs**: FIX/API connectivity for BX Digital, SDX, Taurus
3. **Market Data Providers**: Real-time price feeds
4. **Notification Services**: Email, SMS, push notifications
5. **Monitoring Systems**: Prometheus/Grafana metrics
6. **Logging Services**: Centralized logging (ELK stack)
7. **Backup Systems**: Automated database backups

## Deployment Architecture
- Load balancer with SSL termination
- Multiple API server instances
- PostgreSQL primary with read replicas
- Redis for session/cache storage
- WebSocket server cluster
- CDN for static assets
- Container orchestration (Kubernetes)
- Auto-scaling based on load
- Blue-green deployment strategy
- Disaster recovery with multi-region backup