import React from "react";
import { Route, Switch } from "wouter";
import "./index.css";

// Simple page components
function Overview() {
  return (
    <div className="min-h-screen bg-bg-1 font-inter p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.svg" alt="Rugira" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-900">Rugira Trading Dashboard</h1>
              <p className="text-text-500">Professional trading bot management</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <span className="text-xs font-medium text-brand-green">+12.5%</span>
            </div>
            <h3 className="text-sm font-medium text-text-500 mb-1">Total P/L (24h)</h3>
            <p className="text-2xl font-bold text-text-900">$4,247.32</p>
            <div className="mt-2 text-xs text-text-500">vs. yesterday</div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <div className="feature-icon">
                <i className="fas fa-robot"></i>
              </div>
            </div>
            <h3 className="text-sm font-medium text-text-500 mb-1">Active Bots</h3>
            <p className="text-2xl font-bold text-text-900">3</p>
            <div className="mt-2 text-xs text-text-500">All systems operational</div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <div className="feature-icon">
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
            <h3 className="text-sm font-medium text-text-500 mb-1">Order Success Rate</h3>
            <p className="text-2xl font-bold text-text-900">98.7%</p>
            <div className="mt-2 text-xs text-text-500">247/250 orders filled</div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <div className="feature-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
            </div>
            <h3 className="text-sm font-medium text-text-500 mb-1">P95 Latency</h3>
            <p className="text-2xl font-bold text-text-900">125ms</p>
            <div className="mt-2 text-xs text-text-500">Within SLA targets</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card-rounded p-6">
            <h3 className="text-lg font-semibold text-text-900 mb-4">Equity Curve</h3>
            <div className="h-64 bg-bg-1 rounded-rugira flex items-center justify-center text-text-500">
              <div className="text-center">
                <i className="fas fa-chart-area text-4xl mb-2"></i>
                <p>Portfolio performance over time</p>
              </div>
            </div>
          </div>

          <div className="card-rounded p-6">
            <h3 className="text-lg font-semibold text-text-900 mb-4">Drawdown Analysis</h3>
            <div className="h-64 bg-bg-1 rounded-rugira flex items-center justify-center text-text-500">
              <div className="text-center">
                <i className="fas fa-chart-line text-4xl mb-2"></i>
                <p>Maximum drawdown: -2.1%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card-rounded">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-text-900">Live Trading Activity</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="table-row px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="status-indicator status-online"></span>
                  <div>
                    <p className="text-sm font-medium text-text-900">Alpha Bot executed BTC-USDT trade</p>
                    <p className="text-xs text-text-500">BUY 0.05 BTC at $43,250</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-brand-green">+$127.50</p>
                  <p className="text-xs text-text-500">5 minutes ago</p>
                </div>
              </div>
            </div>

            <div className="table-row px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="status-indicator status-online"></span>
                  <div>
                    <p className="text-sm font-medium text-text-900">Beta Bot profit target reached</p>
                    <p className="text-xs text-text-500">ETH-USDT position closed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-brand-green">+$89.25</p>
                  <p className="text-xs text-text-500">10 minutes ago</p>
                </div>
              </div>
            </div>

            <div className="table-row px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="status-indicator status-warning"></span>
                  <div>
                    <p className="text-sm font-medium text-text-900">High volatility detected</p>
                    <p className="text-xs text-text-500">BTC-USDT spread increased to 0.8%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text-500">Alert</p>
                  <p className="text-xs text-text-500">15 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bots() {
  return (
    <div className="min-h-screen bg-bg-1 font-inter p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-900 mb-8">Bot Management</h1>
        <div className="card-rounded p-6">
          <p className="text-text-500">Bot management interface coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={Overview} />
        <Route path="/bots" component={Bots} />
        <Route>
          <Overview />
        </Route>
      </Switch>
    </div>
  );
}

export default App;