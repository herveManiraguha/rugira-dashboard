import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";

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

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date(),
      services: {
        api: "operational",
        database: "operational", 
        orchestrator: "operational"
      }
    });
  });

  // Bots endpoints
  app.get("/api/bots", async (req, res) => {
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

  // Server-Sent Events for real-time updates
  app.get("/api/stream", (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
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

  // Exchange connections endpoint
  app.get("/api/exchanges", async (req, res) => {
    try {
      const exchanges = await storage.getExchangeConnections();
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
