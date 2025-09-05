import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { authRoutes, optionalAuth } from "./auth";
import * as mockData from "./mockData";
import { mockOrganizations, mockOrgRoles } from "./mockData/organizations";
import healthRoutes from "./routes/health";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // TODO: Re-enable WebSocket server after fixing Vite HMR conflict
  // const wss = new WebSocketServer({ server: httpServer });
  
  // Store connected SSE clients for real-time updates
  const clients = new Set<any>();
  
  // Placeholder broadcast function (will be replaced when WebSocket is enabled)
  const broadcast = (data: any) => {
    // For now, use SSE to broadcast to connected clients
    const message = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach(client => {
      try {
        client.res.write(message);
      } catch (error) {
        clients.delete(client);
      }
    });
  };

  // Register authentication routes
  authRoutes(app);
  
  // Register auth config route - always return demo mode for demonstration
  app.get('/api/auth/config', (req, res) => {
    res.json({
      hasConfig: false,
      isDemoMode: true,
      message: 'Demo mode active - using placeholder credentials'
    });
  });

  // Register health routes
  app.use(healthRoutes);

  // Kill Switch middleware - checks if trading is halted
  const checkKillSwitch = async (req: any, res: any, next: any) => {
    const killSwitchState = await storage.getKillSwitchState();
    if (killSwitchState?.active) {
      return res.status(423).json({
        error: "Trading Locked",
        message: `Trading is currently halted (${killSwitchState.scope}/${killSwitchState.profile})`,
        reason: killSwitchState.reason,
        scope: killSwitchState.scope,
        by: killSwitchState.by,
        at: killSwitchState.at
      });
    }
    next();
  };

  // Kill Switch admin endpoints
  app.get("/api/admin/kill-switch/status", optionalAuth, async (req, res) => {
    try {
      const state = await storage.getKillSwitchState();
      res.json(state || { active: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch kill switch status" });
    }
  });

  app.post("/api/admin/kill-switch/engage", optionalAuth, async (req, res) => {
    try {
      const { scope, profile, filters, reason }: import('../shared/schema').KillSwitchEngageRequest = req.body;
      
      // Validate required fields
      if (!scope || !profile || !reason) {
        return res.status(400).json({ message: "Missing required fields: scope, profile, reason" });
      }

      // Mock user - in real implementation, get from authenticated session
      const mockUser = "Hanz Mueller";
      
      const killSwitchState: import('../shared/schema').KillSwitchState = {
        active: true,
        scope,
        profile,
        by: mockUser,
        at: new Date(),
        reason,
        filters
      };

      await storage.engageKillSwitch(killSwitchState);
      
      // Broadcast the kill switch event
      broadcast({
        type: 'TRADING_HALTED',
        data: killSwitchState
      });

      res.json({ success: true, state: killSwitchState });
    } catch (error) {
      res.status(500).json({ message: "Failed to engage kill switch" });
    }
  });

  app.post("/api/admin/kill-switch/clear", optionalAuth, async (req, res) => {
    try {
      const { note }: import('../shared/schema').KillSwitchClearRequest = req.body;
      
      const currentState = await storage.getKillSwitchState();
      if (!currentState?.active) {
        return res.status(400).json({ message: "Kill switch is not currently active" });
      }

      await storage.clearKillSwitch();
      
      // Broadcast the clear event
      broadcast({
        type: 'TRADING_RESUMED',
        data: { 
          clearedAt: new Date(),
          clearedBy: "Hanz Mueller", // Mock user
          note,
          previousState: currentState
        }
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear kill switch" });
    }
  });



  // Bots endpoints (with optional auth for demo purposes)
  app.get("/api/bots", optionalAuth, async (req, res) => {
    try {
      const bots = await storage.getAllBots();
      res.json(bots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bots" });
    }
  });

  app.post("/api/bots", async (req, res) => {
    try {
      const bot = await storage.createBot(req.body);
      broadcast({ type: 'bot_update', action: 'created', bot });
      res.status(201).json(bot);
    } catch (error) {
      res.status(500).json({ message: "Failed to create bot" });
    }
  });

  app.post("/api/bots/:id/start", async (req, res) => {
    try {
      const bot = await storage.updateBotStatus(req.params.id, 'running');
      broadcast({ type: 'bot_update', action: 'started', bot });
      res.json(bot);
    } catch (error) {
      res.status(500).json({ message: "Failed to start bot" });
    }
  });

  app.post("/api/bots/:id/stop", async (req, res) => {
    try {
      const bot = await storage.updateBotStatus(req.params.id, 'stopped');
      broadcast({ type: 'bot_update', action: 'stopped', bot });
      res.json(bot);
    } catch (error) {
      res.status(500).json({ message: "Failed to stop bot" });
    }
  });

  // KPIs endpoint
  app.get("/api/kpis", async (req, res) => {
    try {
      const kpis = await storage.getKPIs();
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KPIs" });
    }
  });

  // Activities endpoint
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // ===== COMPREHENSIVE MOCKED API ENDPOINTS =====
  
  // Bots API with full mock data
  app.get("/api/v2/bots", optionalAuth, async (req, res) => {
    res.json(mockData.generateBotData());
  });
  
  app.get("/api/v2/bots/:id", optionalAuth, async (req, res) => {
    const bots = mockData.generateBotData();
    const bot = bots.find(b => b.id === req.params.id);
    if (bot) {
      res.json(bot);
    } else {
      res.status(404).json({ message: "Bot not found" });
    }
  });
  
  // Exchanges API
  app.get("/api/exchanges", optionalAuth, async (req, res) => {
    res.json(mockData.generateExchangeData());
  });
  
  app.get("/api/exchanges/:id", optionalAuth, async (req, res) => {
    const exchanges = mockData.generateExchangeData();
    const exchange = exchanges.find(e => e.id === req.params.id);
    if (exchange) {
      res.json(exchange);
    } else {
      res.status(404).json({ message: "Exchange not found" });
    }
  });
  
  // Strategies API
  app.get("/api/strategies", optionalAuth, async (req, res) => {
    res.json(mockData.generateStrategyData());
  });
  
  app.get("/api/strategies/:id", optionalAuth, async (req, res) => {
    const strategies = mockData.generateStrategyData();
    const strategy = strategies.find(s => s.id === req.params.id);
    if (strategy) {
      res.json(strategy);
    } else {
      res.status(404).json({ message: "Strategy not found" });
    }
  });
  
  // Backtesting API
  app.get("/api/backtests", optionalAuth, async (req, res) => {
    res.json(mockData.generateBacktestResults());
  });
  
  app.post("/api/backtests", optionalAuth, async (req, res) => {
    // Mock creating a new backtest
    res.status(201).json({
      id: `backtest-${Date.now()}`,
      ...req.body,
      status: 'running',
      progress: 0,
      createdAt: new Date().toISOString()
    });
  });
  
  // Monitoring API
  app.get("/api/monitoring/alerts", optionalAuth, async (req, res) => {
    res.json(mockData.generateMonitoringAlerts());
  });
  
  app.get("/api/monitoring/metrics", optionalAuth, async (req, res) => {
    res.json({
      cpu: Math.round(Math.random() * 60 + 20),
      memory: Math.round(Math.random() * 50 + 30),
      disk: Math.round(Math.random() * 40 + 20),
      network: Math.round(Math.random() * 100),
      uptime: 99.98,
      responseTime: Math.round(Math.random() * 100 + 50)
    });
  });
  
  // Compliance API
  app.get("/api/compliance/reports", optionalAuth, async (req, res) => {
    res.json(mockData.generateComplianceReports());
  });
  
  app.get("/api/compliance/violations", optionalAuth, async (req, res) => {
    res.json([
      { id: 'v1', date: '2024-12-01', type: 'position_limit', severity: 'warning', resolved: true },
      { id: 'v2', date: '2024-12-15', type: 'rate_limit', severity: 'info', resolved: true }
    ]);
  });
  
  // Portfolio API
  app.get("/api/portfolio", optionalAuth, async (req, res) => {
    res.json(mockData.generatePortfolioData());
  });
  
  app.get("/api/portfolio/positions", optionalAuth, async (req, res) => {
    const portfolio = mockData.generatePortfolioData();
    res.json(portfolio.positions);
  });
  
  app.get("/api/portfolio/performance", optionalAuth, async (req, res) => {
    const portfolio = mockData.generatePortfolioData();
    res.json({
      daily: portfolio.dailyChangePercent,
      weekly: portfolio.weeklyChangePercent,
      monthly: portfolio.monthlyChangePercent,
      data: portfolio.performance
    });
  });
  
  // Market Data API
  app.get("/api/market", optionalAuth, async (req, res) => {
    res.json(mockData.generateMarketData());
  });
  
  app.get("/api/market/prices", optionalAuth, async (req, res) => {
    const market = mockData.generateMarketData();
    res.json(market.prices);
  });
  
  // User Profile API
  app.get("/api/user/profile", optionalAuth, async (req, res) => {
    res.json(mockData.generateUserProfile());
  });
  
  app.patch("/api/user/profile", optionalAuth, async (req, res) => {
    const profile = mockData.generateUserProfile();
    res.json({ ...profile, ...req.body });
  });
  
  // Admin API
  app.get("/api/admin/stats", optionalAuth, async (req, res) => {
    res.json(mockData.generateAdminStats());
  });
  
  app.get("/api/admin/users", optionalAuth, async (req, res) => {
    res.json([
      { id: 'user-1', name: 'Hanz Mueller', email: 'hanz.mueller@rugira.ch', role: 'admin', status: 'active' },
      { id: 'user-2', name: 'Anna Schmidt', email: 'anna.schmidt@rugira.ch', role: 'trader', status: 'active' },
      { id: 'user-3', name: 'Peter Weber', email: 'peter.weber@rugira.ch', role: 'readonly', status: 'active' }
    ]);
  });
  
  app.get("/api/admin/logs", optionalAuth, async (req, res) => {
    res.json(mockData.generateActivityLogs());
  });
  
  // Reports API
  app.get("/api/reports/:type", optionalAuth, async (req, res) => {
    const reportData = mockData.generateReportData(req.params.type);
    res.json(reportData);
  });
  
  app.post("/api/reports/generate", optionalAuth, async (req, res) => {
    res.status(201).json({
      id: `report-${Date.now()}`,
      type: req.body.type,
      status: 'generating',
      createdAt: new Date().toISOString()
    });
  });
  
  // Settings API
  app.get("/api/settings", optionalAuth, async (req, res) => {
    res.json({
      general: {
        timezone: 'Europe/Zurich',
        language: 'en',
        currency: 'USD',
        dateFormat: 'DD/MM/YYYY'
      },
      trading: {
        defaultExchange: 'Binance',
        riskLevel: 'medium',
        autoRebalance: true,
        maxPositionSize: 10000
      },
      notifications: {
        email: true,
        sms: false,
        push: true,
        alerts: {
          trades: true,
          errors: true,
          compliance: true
        }
      },
      security: {
        twoFactorEnabled: true,
        sessionTimeout: 30,
        ipWhitelist: []
      }
    });
  });
  
  app.patch("/api/settings", optionalAuth, async (req, res) => {
    res.json({ success: true, updated: req.body });
  });
  
  // Help/Support API
  app.get("/api/help/articles", optionalAuth, async (req, res) => {
    res.json([
      { id: '1', title: 'Getting Started with Rugira', category: 'basics', views: 1234 },
      { id: '2', title: 'Understanding Bot Strategies', category: 'trading', views: 892 },
      { id: '3', title: 'Risk Management Best Practices', category: 'risk', views: 756 },
      { id: '4', title: 'API Integration Guide', category: 'technical', views: 423 }
    ]);
  });
  
  app.get("/api/help/faqs", optionalAuth, async (req, res) => {
    res.json([
      { question: 'How do I connect an exchange?', answer: 'Navigate to Exchanges page and click Add Exchange...' },
      { question: 'What is the kill switch?', answer: 'The kill switch instantly halts all trading activity...' },
      { question: 'How often are reports generated?', answer: 'Reports are generated daily, weekly, and monthly...' }
    ]);
  });
  
  // Dashboard Overview API
  app.get("/api/overview", optionalAuth, async (req, res) => {
    const portfolio = mockData.generatePortfolioData();
    const bots = mockData.generateBotData();
    const alerts = mockData.generateMonitoringAlerts();
    
    res.json({
      portfolio: {
        totalValue: portfolio.totalValue,
        dailyChange: portfolio.dailyChangePercent,
        weeklyChange: portfolio.weeklyChangePercent
      },
      bots: {
        total: bots.length,
        active: bots.filter(b => b.status === 'active').length,
        totalPnL: bots.reduce((sum, b) => sum + b.dailyPnL, 0)
      },
      alerts: {
        total: alerts.length,
        unacknowledged: alerts.filter(a => !a.acknowledged).length,
        critical: alerts.filter(a => a.severity === 'critical').length
      },
      recentActivity: mockData.generateActivityLogs().slice(0, 5)
    });
  });

  // Server-Sent Events for real-time updates
  app.get("/api/stream", (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      // CORS headers are handled by the cors middleware above
    });

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date() })}\n\n`);

    // Add client to SSE clients list
    const sseClient = { res, id: Date.now() };
    clients.add(sseClient);

    // Send periodic updates
    const interval = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ 
          type: 'heartbeat', 
          timestamp: new Date(),
          connectedClients: clients.size 
        })}\n\n`);
      } catch (error) {
        clearInterval(interval);
        clients.delete(sseClient);
      }
    }, 10000);

    // Handle client disconnect
    req.on('close', () => {
      clearInterval(interval);
      clients.delete(sseClient);
    });
  });

  // Trading data endpoints
  app.get("/api/trades/recent", async (req, res) => {
    try {
      const trades = await storage.getRecentTrades();
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent trades" });
    }
  });

  app.get("/api/trades/history", async (req, res) => {
    try {
      const botId = req.query.botId as string;
      const trades = await storage.getTradeHistory(botId);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trade history" });
    }
  });

  // Market data endpoints
  app.get("/api/market-data", async (req, res) => {
    try {
      const marketData = await storage.getMarketData();
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.get("/api/performance", async (req, res) => {
    try {
      const performanceData = await storage.getPerformanceData();
      res.json(performanceData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch performance data" });
    }
  });

  // Risk and compliance endpoints
  app.get("/api/risk", async (req, res) => {
    try {
      const riskData = await storage.getRiskData();
      res.json(riskData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch risk data" });
    }
  });

  app.get("/api/compliance", async (req, res) => {
    try {
      const complianceData = await storage.getComplianceData();
      res.json(complianceData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compliance data" });
    }
  });

  // Emergency stop endpoint
  app.post("/api/emergency-stop", async (req, res) => {
    try {
      await storage.stopAllBots();
      broadcast({ 
        type: 'emergency_stop', 
        timestamp: new Date(),
        message: 'All trading operations have been halted'
      });
      res.json({ message: "Emergency stop activated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to execute emergency stop" });
    }
  });

  // Compliance alerts endpoint
  app.get("/api/compliance/alerts", async (req, res) => {
    try {
      const alerts = await storage.getComplianceAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compliance alerts" });
    }
  });

  // Reports endpoints
  app.get("/api/reports/performance", async (req, res) => {
    try {
      const report = await storage.getPerformanceReport();
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate performance report" });
    }
  });

  app.get("/api/reports/operational", async (req, res) => {
    try {
      const report = await storage.getOperationalReport();
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate operational report" });
    }
  });

  // Strategy templates endpoint
  app.get("/api/strategies", async (req, res) => {
    try {
      const strategies = await storage.getStrategies();
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch strategies" });
    }
  });

  // Organizations admin endpoints
  app.get("/api/admin/orgs", optionalAuth, async (req, res) => {
    try {
      const { query, status } = req.query;
      let orgs = [...mockOrganizations];
      
      if (query && typeof query === 'string') {
        orgs = orgs.filter(org => 
          org.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      if (status && typeof status === 'string') {
        orgs = orgs.filter(org => org.status === status);
      }
      
      // Map to include both old and new field names for backward compatibility
      const mappedOrgs = orgs.map(org => ({
        ...org,
        createdAt: org.created_at || org.createdAt, // Keep old field for UI compatibility
        updatedAt: org.updated_at || org.updatedAt  // Keep old field for UI compatibility
      }));
      
      res.json(mappedOrgs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.post("/api/admin/orgs", optionalAuth, async (req, res) => {
    try {
      const { name } = req.body;
      
      // Check for duplicate
      const existing = mockOrganizations.find(org => 
        org.name.toLowerCase() === name.toLowerCase() && org.status === 'active'
      );
      
      if (existing) {
        return res.status(409).json({ message: "Organization with this name already exists" });
      }
      
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const timestamp = new Date().toISOString();
      const newOrg = {
        id: `org-${Date.now()}`,
        org_id: generateUUID(),
        name,
        status: 'active' as const,
        memberCount: 0,
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
        createdAt: timestamp, // Keep for UI compatibility
        updatedAt: timestamp  // Keep for UI compatibility
      };
      
      mockOrganizations.push(newOrg);
      res.status(201).json(newOrg);
    } catch (error) {
      res.status(500).json({ message: "Failed to create organization" });
    }
  });

  app.patch("/api/admin/orgs/:id", optionalAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, status } = req.body;
      
      const orgIndex = mockOrganizations.findIndex(org => org.id === id);
      if (orgIndex === -1) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      if (name) {
        // Check for duplicate name
        const existing = mockOrganizations.find(org => 
          org.id !== id && 
          org.name.toLowerCase() === name.toLowerCase() && 
          org.status === 'active'
        );
        
        if (existing) {
          return res.status(409).json({ message: "Organization with this name already exists" });
        }
        
        mockOrganizations[orgIndex].name = name;
      }
      
      if (status) {
        mockOrganizations[orgIndex].status = status;
        // If archiving, set deleted_at
        if (status === 'archived') {
          mockOrganizations[orgIndex].deleted_at = new Date().toISOString();
        }
      }
      
      const timestamp = new Date().toISOString();
      mockOrganizations[orgIndex].updated_at = timestamp;
      mockOrganizations[orgIndex].updatedAt = timestamp; // Keep for UI compatibility
      
      res.json(mockOrganizations[orgIndex]);
    } catch (error) {
      res.status(500).json({ message: "Failed to update organization" });
    }
  });

  app.get("/api/admin/orgs/:id/roles", optionalAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const roles = mockOrgRoles.filter(role => role.orgId === id);
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organization roles" });
    }
  });

  app.post("/api/admin/orgs/:id/roles", optionalAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id, role } = req.body;
      
      // Check if user already has a role in this org
      const existing = mockOrgRoles.find(r => 
        r.orgId === id && r.userId === user_id
      );
      
      if (existing) {
        return res.status(409).json({ message: "User already has a role in this organization" });
      }
      
      const newRole = {
        id: `role-${Date.now()}`,
        orgId: id,
        userId: user_id,
        userEmail: `user${user_id}@example.com`, // In real app, would fetch from user service
        userName: `User ${user_id}`,
        role,
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString() // New field name
      };
      
      mockOrgRoles.push(newRole);
      
      // Update member count
      const org = mockOrganizations.find(o => o.id === id);
      if (org) {
        org.memberCount += 1;
      }
      
      res.status(201).json(newRole);
    } catch (error) {
      res.status(500).json({ message: "Failed to add organization role" });
    }
  });

  app.delete("/api/admin/orgs/:orgId/roles/:bindingId", optionalAuth, async (req, res) => {
    try {
      const { orgId, bindingId } = req.params;
      
      const roleIndex = mockOrgRoles.findIndex(role => 
        role.id === bindingId && role.orgId === orgId
      );
      
      if (roleIndex === -1) {
        return res.status(404).json({ message: "Role not found" });
      }
      
      mockOrgRoles.splice(roleIndex, 1);
      
      // Update member count
      const org = mockOrganizations.find(o => o.id === orgId);
      if (org && org.memberCount > 0) {
        org.memberCount -= 1;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove organization role" });
    }
  });

  app.get("/api/admin/users/:userId/orgs", optionalAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const userRoles = mockOrgRoles.filter(role => role.userId === userId);
      const orgIds = userRoles.map(r => r.orgId);
      const userOrgs = mockOrganizations.filter(org => orgIds.includes(org.id));
      res.json(userOrgs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user organizations" });
    }
  });

  // Exchange connections endpoint
  app.get("/api/exchanges", async (req, res) => {
    try {
      const exchanges = await storage.getAllExchanges();
      res.json(exchanges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exchange connections" });
    }
  });

  // Backtesting endpoints
  app.get("/api/backtests", async (req, res) => {
    try {
      const backtests = await storage.getBacktests();
      res.json(backtests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch backtests" });
    }
  });

  app.post("/api/backtests", async (req, res) => {
    try {
      const backtest = await storage.createBacktest(req.body);
      broadcast({ type: 'backtest_update', action: 'created', backtest });
      res.status(201).json(backtest);
    } catch (error) {
      res.status(500).json({ message: "Failed to create backtest" });
    }
  });

  return httpServer;
}
