import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { ExchangeIcon } from '@/components/ui/exchange-icon';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AddExchangeModal from '@/components/Exchange/AddExchangeModal';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Plus,
  RefreshCw,
  Unlink,
  AlertTriangle,
  Clock,
  Shield,
  TrendingUp,
  DollarSign,
  Grid3X3,
  List,
  MoreHorizontal,
  Search,
  FileText,
  ExternalLink,
  Info,
  CheckCircle,
  XCircle,
  Send,
  Activity
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Types
interface ExchangeData {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastSync: string;
  tradingFees: {
    maker: number;
    taker: number;
  };
  apiLimits: {
    used: number;
    total: number;
  };
  balance: {
    total: number;
    available: number;
    currency: string;
  };
  supportedPairs: number;
  activeBots: number;
  logo: string;
  features: string[];
}

interface TokenizedVenueData {
  id: string;
  name: string;
  subtitle: string;
  venueType: string;
  connectivity: string;
  routeVia: string;
  eligibility: string;
  status: string;
  description?: string;
  actions: string[];
  footnote?: string;
  logo?: string;
}

interface InstrumentData {
  isin: string;
  name: string;
  type: string;
  currency: string;
  tick: number;
}

// Mock data for crypto exchanges
const mockExchanges: ExchangeData[] = [
  {
    id: '1',
    name: 'Binance',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    tradingFees: { maker: 0.1, taker: 0.1 },
    apiLimits: { used: 450, total: 1200 },
    balance: { total: 12450.32, available: 8921.45, currency: 'USDT' },
    supportedPairs: 1800,
    activeBots: 4,
    logo: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/binance.svg',
    features: ['Spot Trading', 'Futures', 'Margin', 'Options', 'P2P', 'Staking']
  },
  {
    id: '2',
    name: 'Coinbase Pro',
    status: 'connected',
    lastSync: '2024-01-15T10:29:00Z',
    tradingFees: { maker: 0.5, taker: 0.5 },
    apiLimits: { used: 120, total: 1000 },
    balance: { total: 5620.78, available: 4150.23, currency: 'USD' },
    supportedPairs: 180,
    activeBots: 2,
    logo: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/coinbase.svg',
    features: ['Spot Trading', 'Institutional', 'Advanced Trading', 'API Access']
  },
  {
    id: '3',
    name: 'Kraken',
    status: 'error',
    lastSync: '2024-01-15T09:45:00Z',
    tradingFees: { maker: 0.16, taker: 0.26 },
    apiLimits: { used: 0, total: 720 },
    balance: { total: 0, available: 0, currency: 'EUR' },
    supportedPairs: 220,
    activeBots: 0,
    logo: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/kraken.svg',
    features: ['Spot Trading', 'Futures', 'Margin', 'Staking', 'DeFi']
  },
  {
    id: '4',
    name: 'Bybit',
    status: 'connected',
    lastSync: '2024-01-15T10:25:00Z',
    tradingFees: { maker: 0.1, taker: 0.1 },
    apiLimits: { used: 280, total: 600 },
    balance: { total: 3420.15, available: 2890.67, currency: 'USDT' },
    supportedPairs: 400,
    activeBots: 3,
    logo: 'https://assets.coingecko.com/markets/images/698/small/bybit_spot.png',
    features: ['Spot Trading', 'Futures', 'Options', 'Copy Trading', 'NFT']
  },
  {
    id: '5',
    name: 'OKX',
    status: 'connected',
    lastSync: '2024-01-15T10:28:00Z',
    tradingFees: { maker: 0.08, taker: 0.1 },
    apiLimits: { used: 340, total: 1000 },
    balance: { total: 7850.92, available: 6120.45, currency: 'USDT' },
    supportedPairs: 500,
    activeBots: 5,
    logo: 'https://assets.coingecko.com/markets/images/96/small/WeChat_Image_20220117220452.png',
    features: ['Spot Trading', 'Futures', 'Options', 'DeFi', 'Web3 Wallet']
  },
  {
    id: '6',
    name: 'KuCoin',
    status: 'connected',
    lastSync: '2024-01-15T10:31:00Z',
    tradingFees: { maker: 0.1, taker: 0.1 },
    apiLimits: { used: 189, total: 800 },
    balance: { total: 2940.78, available: 2100.45, currency: 'USDT' },
    supportedPairs: 700,
    activeBots: 2,
    logo: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/kucoin.svg',
    features: ['Spot Trading', 'Futures', 'Margin', 'P2P', 'Lending']
  }
];

// Mock data for tokenized venues
const tokenizedVenues: TokenizedVenueData[] = [
  {
    id: 'bx-digital',
    name: 'BX Digital (via InCore)',
    subtitle: 'Tokenized Venue — routed via InCore (participant)',
    venueType: 'DLT-TF',
    connectivity: 'FIX + Drop-copy',
    routeVia: 'InCore (participant)',
    eligibility: 'Pro/Inst',
    status: 'Pilot-ready (Paper)',
    actions: ['Open Venue', 'Docs'],
    footnote: 'Orders routed via InCore participant connectivity; Rugirinka enforces pre-trade limits and reconciles via drop-copy (T+0).'
  },
  {
    id: 'sdx',
    name: 'SDX (via member broker)',
    subtitle: 'Tokenized Venue — routed via member broker',
    venueType: 'Exchange + CSD',
    connectivity: 'FIX + Drop-copy',
    routeVia: 'Member broker',
    eligibility: 'Pro/Inst',
    status: 'Coming soon (Paper)',
    actions: ['Open Venue']
  },
  {
    id: 'taurus-tdx',
    name: 'Taurus TDX (OTF)',
    subtitle: 'Tokenized Venue — OTF',
    venueType: 'OTF',
    connectivity: 'API/FIX',
    routeVia: 'Partner bank/broker',
    eligibility: 'Pro/Retail',
    status: 'Partner route (Paper)',
    actions: ['Open Venue']
  }
];

const issuerPlatforms = [
  {
    id: 'securitize',
    name: 'Securitize',
    example: 'e.g., BUIDL',
    venueType: 'Issuer Platform',
    connectivity: 'API',
    routeVia: 'Custodian/bank',
    eligibility: 'Qualified/Pro',
    status: 'Issuer-led (external)'
  },
  {
    id: 'franklin',
    name: 'Franklin',
    example: 'BENJI',
    venueType: 'Issuer Platform',
    connectivity: 'API',
    routeVia: 'Custodian/bank',
    eligibility: 'Qualified/Pro',
    status: 'Issuer-led (external)'
  }
];

// Mock instruments for tokenized venues
const mockInstruments: InstrumentData[] = [
  { isin: 'ISIN-TEST-001', name: 'Alpha Equity Token', type: 'Equity', currency: 'CHF', tick: 0.01 },
  { isin: 'ISIN-TEST-002', name: 'Bravo Bond Token 2028', type: 'Bond', currency: 'CHF', tick: 0.01 },
  { isin: 'ISIN-TEST-003', name: 'Charlie Fund Token', type: 'Fund', currency: 'CHF', tick: 0.01 }
];

export default function Venues() {
  const [exchanges, setExchanges] = useState(mockExchanges);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<TokenizedVenueData | null>(null);
  const [venueSheetOpen, setVenueSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { toast } = useToast();

  const handleConnect = (exchangeId: string) => {
    console.log('Connecting to venue:', exchangeId);
  };

  const handleDisconnect = (exchangeId: string) => {
    console.log('Disconnecting from venue:', exchangeId);
  };

  const handleRefresh = (exchangeId: string) => {
    console.log('Refreshing venue data:', exchangeId);
  };

  const handleAddExchange = async (data: any) => {
    console.log('Adding venue:', data);
    setIsAddModalOpen(false);
    toast({
      title: "Venue Added",
      description: "Successfully connected to new venue."
    });
  };

  const handleOpenVenue = (venue: TokenizedVenueData) => {
    setSelectedVenue(venue);
    setVenueSheetOpen(true);
  };

  const handleSendTestOrder = () => {
    // Simulate test order
    toast({
      title: "Test Order Sent (Paper)",
      description: "Pre-trade check passed → FIX NewOrderSingle → ExecutionReport (filled) → Drop-copy confirmed"
    });
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'connecting':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Venue Connections"
        description="Venues lists all routable markets. Tokenized venues are accessed directly or via a participant (e.g., InCore). Rugirinka applies pre-trade limits, audit logging, and drop-copy/T+0 reconciliation where available."
        actions={
          <div className="flex gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="px-3"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} variant="default" className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Venue
            </Button>
          </div>
        }
      />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['CEX', 'DLT-TF', 'OTF', 'Exchange+CSD', 'Issuer Platform'].map(filter => (
            <Badge
              key={filter}
              variant={selectedFilters.includes(filter) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* Crypto Exchanges Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Crypto Exchanges</h2>
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exchanges.map((exchange) => (
            <Card key={exchange.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ExchangeIcon name={exchange.name} logo={exchange.logo} className="w-10 h-10" />
                    <div>
                      <CardTitle className="text-base">{exchange.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(exchange.status)}
                        <span className="text-xs text-gray-500">
                          {exchange.status === 'connected' ? 'Connected' : 
                           exchange.status === 'error' ? 'Error' :
                           exchange.status === 'connecting' ? 'Connecting' : 'Disconnected'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRefresh(exchange.id)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDisconnect(exchange.id)}
                      >
                        <Unlink className="h-4 w-4 mr-2" />
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Balance</div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-gray-600">Total</span>
                          <span className="font-semibold text-gray-900">{exchange.balance.total.toLocaleString()} {exchange.balance.currency}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-gray-600">Available</span>
                          <span className="text-sm text-gray-700">{exchange.balance.available.toLocaleString()} {exchange.balance.currency}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">API Usage</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(exchange.apiLimits.used / exchange.apiLimits.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {exchange.apiLimits.used}/{exchange.apiLimits.total}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div>
                        <div className="text-xs text-gray-500">Maker Fee</div>
                        <div className="text-sm font-medium text-gray-900">{exchange.tradingFees.maker}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Taker Fee</div>
                        <div className="text-sm font-medium text-gray-900">{exchange.tradingFees.taker}%</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-gray-500">Last sync: {formatDate(exchange.lastSync)}</span>
                      <span className="text-xs font-medium text-gray-700">{exchange.activeBots} active bots</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Active Bots</TableHead>
                  <TableHead>API Usage</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchanges.map((exchange) => (
                  <TableRow key={exchange.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ExchangeIcon name={exchange.name} logo={exchange.logo} className="w-8 h-8" />
                        <span className="font-medium">{exchange.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(exchange.status)}
                        <span className="text-sm">
                          {exchange.status === 'connected' ? 'Connected' : 
                           exchange.status === 'error' ? 'Error' :
                           exchange.status === 'connecting' ? 'Connecting' : 'Disconnected'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{exchange.balance.total.toLocaleString()} {exchange.balance.currency}</div>
                        <div className="text-gray-500">Available: {exchange.balance.available.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>{exchange.activeBots} active bots</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(exchange.apiLimits.used / exchange.apiLimits.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {exchange.apiLimits.used}/{exchange.apiLimits.total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Maker: {exchange.tradingFees.maker}%</div>
                        <div>Taker: {exchange.tradingFees.taker}%</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(exchange.lastSync)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRefresh(exchange.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDisconnect(exchange.id)}
                            className="text-red-600"
                          >
                            <Unlink className="h-4 w-4 mr-2" />
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Tokenized Venues Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tokenized Venues</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokenizedVenues.map((venue) => (
            <Card key={venue.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="space-y-2">
                  <CardTitle className="text-base">{venue.name}</CardTitle>
                  <p className="text-xs text-gray-500">{venue.subtitle}</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      Venue type: {venue.venueType}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {venue.connectivity}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Route via: {venue.routeVia}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {venue.eligibility}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {venue.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {venue.footnote && (
                    <p className="text-xs text-gray-600 italic">{venue.footnote}</p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleOpenVenue(venue)}
                    >
                      Open Venue
                    </Button>
                    {venue.actions.includes('Docs') && (
                      <Button size="sm" variant="ghost">
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Issuer Platforms Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Issuer Platforms (RWA Funds)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issuerPlatforms.map((platform) => (
                  <div key={platform.id} className="p-3 border rounded-lg space-y-2">
                    <div className="font-medium text-sm">
                      {platform.name} <span className="text-gray-500 font-normal">({platform.example})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {platform.venueType}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {platform.connectivity}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Route: {platform.routeVia}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {platform.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full">
                  Learn more
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Venue Details Sheet */}
      <Sheet open={venueSheetOpen} onOpenChange={setVenueSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedVenue && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedVenue.name}</SheetTitle>
                <SheetDescription>{selectedVenue.subtitle}</SheetDescription>
              </SheetHeader>
              
              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
                  <TabsTrigger value="instruments">Instruments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Venue Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Venue Type</span>
                          <span>{selectedVenue.venueType}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Trading Hours</span>
                          <span>Per venue calendar</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Status</span>
                          <Badge variant="outline">{selectedVenue.status}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Eligibility</h4>
                      <p className="text-sm text-gray-600">
                        Pro/Institutional; ISIN allow-list; no leverage; limit-only.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Routing Policy</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>• Order types: Limit/Day only</p>
                        <p>• Max notional/order: CHF 1,000 (Paper)</p>
                        <p>• Daily turnover cap: 0.6× AUC</p>
                        <p>• Throttle: 1/sec</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="connectivity" className="space-y-4">
                  <div className="space-y-3">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        FIX connectivity established (Paper mode)
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">SenderCompID</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">RUGIRA-SIM</code>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">TargetCompID</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">BX-SIM</code>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Heartbeats</span>
                        <span className="text-green-600">OK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Gap</span>
                        <span>0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last HB</span>
                        <span>00:00:07</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recent Logs</h4>
                      <div className="bg-gray-50 p-2 rounded text-xs font-mono space-y-1">
                        <p className="text-gray-600">2024-12-29 08:34:45 ExecutionReport ClOrdID=TEST001 Status=Filled</p>
                        <p className="text-gray-600">2024-12-29 08:34:44 NewOrderSingle ClOrdID=TEST001 Symbol=ISIN-TEST-001</p>
                        <p className="text-gray-600">2024-12-29 08:34:40 Drop-copy Reconciliation Complete Matched=1</p>
                        <p className="text-gray-600">2024-12-29 08:34:35 Heartbeat SeqNum=1234</p>
                        <p className="text-gray-600">2024-12-29 08:34:30 Logon Success</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="instruments" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Available Instruments</h4>
                      <Badge variant="outline">3 instruments</Badge>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ISIN</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Currency</TableHead>
                          <TableHead>Tick</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockInstruments.map((instrument) => (
                          <TableRow key={instrument.isin}>
                            <TableCell className="font-mono text-xs">{instrument.isin}</TableCell>
                            <TableCell className="text-sm">{instrument.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {instrument.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{instrument.currency}</TableCell>
                            <TableCell>{instrument.tick}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleSendTestOrder}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send test order (Paper)
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Exchange/Venue Modal */}
      <AddExchangeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExchange}
      />
    </div>
  );
}