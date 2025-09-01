import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Target, Clock, CheckCircle, XCircle } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoContext";
import SampleExportModal from "@/components/Demo/SampleExportModal";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

export default function Reports() {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedBot, setSelectedBot] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const { isDemoMode, isReadOnly } = useDemoMode();

  const performanceMetrics = {
    roi: '12.4%',
    sharpe: '1.84',
    maxDrawdown: '-3.2%',
    winRate: '68.4%',
    totalTrades: '1,247',
    avgLatency: '125ms'
  };

  // Generate bot performance comparison data
  const botPerformanceData = [
    { name: 'Alpha Arbitrage', pnl: 1247.32, trades: 247, winRate: 68.4 },
    { name: 'Beta Grid', pnl: -89.45, trades: 156, winRate: 45.2 },
    { name: 'Gamma Momentum', pnl: 892.15, trades: 189, winRate: 72.1 },
    { name: 'Delta Mean Rev.', pnl: 567.89, trades: 134, winRate: 58.9 },
    { name: 'Epsilon Scalping', pnl: 2134.56, trades: 567, winRate: 61.3 },
    { name: 'Zeta Swing', pnl: 445.78, trades: 78, winRate: 69.2 },
    { name: 'Eta HF', pnl: 1876.23, trades: 423, winRate: 64.8 },
    { name: 'Theta Cross', pnl: 334.12, trades: 89, winRate: 55.1 }
  ];

  // Generate cumulative returns over time
  const generateCumulativeReturns = () => {
    const data = [];
    let cumulativeReturn = 10000; // Starting with $10,000
    const days = dateRange === '24h' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    
    for (let i = 0; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Generate realistic daily returns with some volatility
      const dailyReturn = (Math.random() - 0.45) * 0.05; // Slight positive bias
      cumulativeReturn *= (1 + dailyReturn);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(cumulativeReturn * 100) / 100,
        return: Math.round(((cumulativeReturn / 10000 - 1) * 100) * 100) / 100
      });
    }
    return data;
  };

  const cumulativeReturnsData = generateCumulativeReturns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Performance analysis and operational metrics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          {/* Performance KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">ROI</p>
                    <p className="text-lg font-bold text-green-600">{performanceMetrics.roi}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Sharpe Ratio</p>
                    <p className="text-lg font-bold">{performanceMetrics.sharpe}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-xs text-gray-500">Max Drawdown</p>
                    <p className="text-lg font-bold text-red-600">{performanceMetrics.maxDrawdown}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Win Rate</p>
                    <p className="text-lg font-bold">{performanceMetrics.winRate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Total Trades</p>
                    <p className="text-lg font-bold">{performanceMetrics.totalTrades}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Avg Latency</p>
                    <p className="text-lg font-bold">{performanceMetrics.avgLatency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Bot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={botPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'pnl' ? `$${Number(value).toFixed(2)}` : `${value}`,
                          name === 'pnl' ? 'P&L' : name === 'trades' ? 'Trades' : 'Win Rate %'
                        ]}
                      />
                      <Bar 
                        dataKey="pnl" 
                        fill="#16a34a"
                        name="pnl"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cumulative Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cumulativeReturnsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                      />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: any) => [`$${value.toFixed(2)}`, 'Portfolio Value']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#e10600" 
                        fill="#e10600" 
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">98.7%</div>
                  <p className="text-sm text-gray-500">1,234/1,251 orders filled</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>P95 Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">125ms</div>
                  <p className="text-sm text-gray-500">Within SLA targets</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">0.03%</div>
                  <p className="text-sm text-gray-500">3 errors in 10,000 operations</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* T+0 Reconciliation Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>T+0 Reconciliation</CardTitle>
                <Select defaultValue="bx-digital">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Venue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bx-digital">BX Digital (via InCore)</SelectItem>
                    <SelectItem value="sdx">SDX (via member broker)</SelectItem>
                    <SelectItem value="taurus-tdx">Taurus TDX (OTF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">1</div>
                  <p className="text-sm text-gray-600">Matched</p>
                  <Badge variant="outline" className="mt-2">Paper</Badge>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-600">0</div>
                  <p className="text-sm text-gray-600">Unmatched</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <p className="text-sm text-gray-600">Match Rate</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/samples/rugira_audit_extract_sample.csv';
                    link.download = 'rugira_audit_extract_sample.csv';
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV (Sample)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Value at Risk (VaR)</Label>
                  <div className="text-2xl font-bold text-red-600">$2,450</div>
                  <p className="text-sm text-gray-500">95% confidence, 1-day horizon</p>
                </div>
                <div>
                  <Label>Position Concentration</Label>
                  <div className="text-2xl font-bold">67%</div>
                  <p className="text-sm text-gray-500">Largest position as % of portfolio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SampleExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
}