import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDemoMode } from '@/contexts/DemoContext';
import {
  demoConsoleData,
  demoAutomations,
  type DemoConsoleData,
  type DemoVenueRoute,
  type DemoGuardrails,
} from '@/data/demoAutomationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
} from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock4,
  Command as CommandIcon,
  Layers,
  Play,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CreateBotModal from '@/components/Modals/CreateBotModal';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

type TradeAction = 'buy' | 'sell' | 'reduce' | 'hedge' | 'pause' | 'resume';

type RiskCheckStatus = 'PASS' | 'WARN';

interface ParsedTicket {
  rawCommand: string;
  action: TradeAction;
  pair?: string;
  asset?: string;
  sizePercent?: number;
  stopLossPercent?: number;
  takeProfitPercent?: number;
  routeMode: 'auto' | 'manual';
  requestedRoute?: string;
  resolvedRoute?: DemoVenueRoute | null;
  guardrailNotes: string[];
  riskCheck: RiskCheckStatus;
  summary: string;
  botReference?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  command: string;
  action: string;
  route: string;
  size: string;
  risk: RiskCheckStatus;
  compliance: 'PASS' | 'WARN';
  notes: string;
}

const guardrailBadge: Record<RiskCheckStatus, string> = {
  PASS: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  WARN: 'bg-amber-50 text-amber-800 border border-amber-200',
};

const COMMAND_SUGGESTIONS = [
  'buy BTC/USDT 1.8% sl=1.2% tp=2.4% route=auto',
  'sell BTC/USDT 1.0% sl=1.0% tp=2.0% route=binance',
  'reduce pos:BTC 0.8%',
  'hedge pos:BTC 1.2% via-perp',
  'pause bot:Alpha Grid Bot',
  'resume bot:beta-arbitrage',
];

const initialAuditEntries: AuditEntry[] = [
  {
    id: 'audit-001',
    timestamp: format(new Date(), 'HH:mm:ss'),
    actor: 'Pilot Assist (Demo)',
    command: 'System start — sandboxed',
    action: 'INIT',
    route: '—',
    size: '—',
    risk: 'PASS',
    compliance: 'PASS',
    notes: 'Loaded console state for Demo tenant.',
  },
];

function findRoute(routeIdOrName: string | undefined, matrix: DemoConsoleData['venueMatrix']): DemoVenueRoute | null {
  if (!routeIdOrName) return null;
  const normalized = routeIdOrName.trim().toLowerCase();
  return (
    matrix.find(route => route.id.toLowerCase() === normalized) ||
    matrix.find(route => route.name.toLowerCase() === normalized) ||
    null
  );
}

function pickAutoRoute(matrix: DemoConsoleData['venueMatrix']): DemoVenueRoute {
  const recommended = matrix.find(route => route.recommended);
  if (recommended) return recommended;
  return matrix.reduce((best, current) => (current.routeScore > best.routeScore ? current : best), matrix[0]);
}

function evaluateGuardrails(
  ticket: ParsedTicket,
  guardrails: DemoGuardrails,
): { notes: string[]; status: RiskCheckStatus } {
  const notes: string[] = [];

  if (ticket.sizePercent !== undefined && guardrails.sizePercent !== undefined) {
    if (ticket.sizePercent > guardrails.sizePercent) {
      notes.push(`Size ${ticket.sizePercent.toFixed(2)}% exceeds guardrail ${guardrails.sizePercent.toFixed(2)}%.`);
    }
  }

  if (ticket.stopLossPercent !== undefined && guardrails.stopLossPercent !== undefined) {
    if (guardrails.stopLossPercent === 0 && ticket.stopLossPercent > 0) {
      notes.push('Stop-loss enabled while guardrail default is 0% (disabled).');
    } else if (ticket.stopLossPercent > guardrails.stopLossPercent) {
      notes.push(`Stop-loss ${ticket.stopLossPercent.toFixed(2)}% above guardrail ${guardrails.stopLossPercent.toFixed(2)}%.`);
    }
  }

  if (ticket.takeProfitPercent !== undefined && guardrails.takeProfitPercent !== undefined) {
    if (ticket.takeProfitPercent < guardrails.takeProfitPercent) {
      notes.push(`Take-profit ${ticket.takeProfitPercent.toFixed(2)}% tighter than baseline ${guardrails.takeProfitPercent.toFixed(2)}%.`);
    }
  }

  const status: RiskCheckStatus = notes.length > 0 ? 'WARN' : 'PASS';
  return { notes, status };
}

function parseCommand(input: string, consoleData: DemoConsoleData, guardrails: DemoGuardrails): ParsedTicket | { error: string } {
  const command = input.trim();
  if (!command) {
    return { error: 'Enter a command to begin.' };
  }

  const normalized = command.toLowerCase();
  const matrix = consoleData.venueMatrix;

  const buySellMatch = normalized.match(/^(buy|sell)\s+([a-z0-9/-]+)\s+([\d.]+)%\s*(.*)$/i);
  if (buySellMatch) {
    const [, actionRaw, pairRaw, sizeRaw, rest] = buySellMatch;
    const action = actionRaw as TradeAction;
    const pair = pairRaw.toUpperCase();
    const sizePercent = parseFloat(sizeRaw);
    let stopLossPercent: number | undefined;
    let takeProfitPercent: number | undefined;
    let routeMode: 'auto' | 'manual' = 'auto';
    let requestedRoute: string | undefined;

    if (rest) {
      rest
        .split(/\s+/)
        .filter(Boolean)
        .forEach(token => {
          if (token.startsWith('sl=')) {
            stopLossPercent = parseFloat(token.replace('sl=', '').replace('%', ''));
          } else if (token.startsWith('tp=')) {
            takeProfitPercent = parseFloat(token.replace('tp=', '').replace('%', ''));
          } else if (token.startsWith('route=')) {
            const value = token.replace('route=', '');
            if (value && value !== 'auto') {
              routeMode = 'manual';
              requestedRoute = value;
            }
          }
        });
    }

    const resolvedRoute = routeMode === 'auto'
      ? pickAutoRoute(matrix)
      : findRoute(requestedRoute, matrix);

    if (routeMode === 'manual' && !resolvedRoute) {
      return { error: `Route "${requestedRoute}" not found in connected venues.` };
    }

    const baseTicket: ParsedTicket = {
      rawCommand: command,
      action,
      pair,
      sizePercent: Number.isFinite(sizePercent) ? sizePercent : undefined,
      stopLossPercent: Number.isFinite(stopLossPercent ?? NaN) ? stopLossPercent : undefined,
      takeProfitPercent: Number.isFinite(takeProfitPercent ?? NaN) ? takeProfitPercent : undefined,
      routeMode,
      requestedRoute,
      resolvedRoute: resolvedRoute ?? null,
      guardrailNotes: [],
      riskCheck: 'PASS',
      summary: `${action.toUpperCase()} ${pair} • ${sizePercent.toFixed(2)}%`,
    };

    const evaluation = evaluateGuardrails(baseTicket, guardrails);
    baseTicket.guardrailNotes = evaluation.notes;
    baseTicket.riskCheck = evaluation.status;

    return baseTicket;
  }

  const reduceMatch = normalized.match(/^reduce\s+pos:([a-z0-9-]+)\s+([\d.]+)%$/i);
  if (reduceMatch) {
    const [, assetRaw, sizeRaw] = reduceMatch;
    const sizePercent = parseFloat(sizeRaw);

    return {
      rawCommand: command,
      action: 'reduce',
      asset: assetRaw.toUpperCase(),
      sizePercent: Number.isFinite(sizePercent) ? sizePercent : undefined,
      routeMode: 'auto',
      requestedRoute: undefined,
      resolvedRoute: pickAutoRoute(matrix),
      guardrailNotes: sizePercent > guardrails.haltAfterLosses ? [] : [],
      riskCheck: 'PASS',
      summary: `REDUCE ${assetRaw.toUpperCase()} • ${sizePercent.toFixed(2)}%`,
    };
  }

  const hedgeMatch = normalized.match(/^hedge\s+pos:([a-z0-9-]+)\s+([\d.]+)%\s+via-perp$/i);
  if (hedgeMatch) {
    const [, assetRaw, sizeRaw] = hedgeMatch;
    const sizePercent = parseFloat(sizeRaw);

    const baseTicket: ParsedTicket = {
      rawCommand: command,
      action: 'hedge',
      asset: assetRaw.toUpperCase(),
      sizePercent: Number.isFinite(sizePercent) ? sizePercent : undefined,
      routeMode: 'manual',
      requestedRoute: 'perp',
      resolvedRoute: pickAutoRoute(matrix),
      guardrailNotes: [],
      riskCheck: 'PASS',
      summary: `HEDGE ${assetRaw.toUpperCase()} • ${sizePercent.toFixed(2)}% via perp`,
    };

    const evaluation = evaluateGuardrails(baseTicket, guardrails);
    baseTicket.guardrailNotes = evaluation.notes;
    baseTicket.riskCheck = evaluation.status;

    return baseTicket;
  }

  const botMatch = normalized.match(/^(pause|resume)\s+bot:(.+)$/i);
  if (botMatch) {
    const [, actionRaw, botRefRaw] = botMatch;
    const action = actionRaw as TradeAction;
    const botReference = botRefRaw.trim();

    return {
      rawCommand: command,
      action,
      routeMode: 'auto',
      requestedRoute: undefined,
      resolvedRoute: null,
      guardrailNotes: [],
      riskCheck: 'PASS',
      summary: `${action.toUpperCase()} ${botReference}`,
      botReference,
    };
  }

  return { error: 'Command not recognized. Refer to the grammar hints.' };
}

function formatRouteLabel(route?: DemoVenueRoute | null, mode: 'auto' | 'manual' = 'auto') {
  if (!route) {
    return mode === 'auto' ? 'Auto routing' : 'Manual route pending';
  }
  return `${route.name} (${route.routeScore})`;
}

function formatSize(ticket: ParsedTicket) {
  if (ticket.sizePercent === undefined) return '—';
  return `${ticket.sizePercent.toFixed(2)}%`;
}

export default function Console() {
  const { isDemoMode } = useDemoMode();
  const { toast } = useToast();
  const [selectedPair, setSelectedPair] = useState(demoConsoleData.defaultPair);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [currentTicket, setCurrentTicket] = useState<ParsedTicket | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(initialAuditEntries);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [promotionTicket, setPromotionTicket] = useState<ParsedTicket | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (!isDemoMode) return;
        setPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isDemoMode]);

  const pairOptions = useMemo(() => {
    const uniquePairs = new Set<string>([demoConsoleData.defaultPair]);
    demoAutomations.forEach(bot => uniquePairs.add(bot.pair));
    return Array.from(uniquePairs);
  }, []);

  const handleParse = useCallback((input: string) => {
    const result = parseCommand(input, demoConsoleData, demoConsoleData.guardrails);
    if ('error' in result) {
      setParseError(result.error);
      setCurrentTicket(null);
      return;
    }

    setParseError(null);
    setCurrentTicket(result);
    setPaletteOpen(false);
    setCommandInput('');
  }, []);

  const handleSimulate = () => {
    if (!currentTicket) return;

    const routeName = formatRouteLabel(currentTicket.resolvedRoute, currentTicket.routeMode);
    const sizeLabel = formatSize(currentTicket);
    const timestamp = format(new Date(), 'HH:mm:ss');
    const risk = currentTicket.riskCheck;
    const compliance: 'PASS' | 'WARN' = 'PASS';
    const notes = currentTicket.guardrailNotes.length > 0
      ? currentTicket.guardrailNotes.join(' ')
      : 'Guardrails: PASS · Compliance: PASS';

    const entry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp,
      actor: 'Operator (Demo)',
      command: currentTicket.rawCommand,
      action: currentTicket.summary,
      route: routeName,
      size: sizeLabel,
      risk,
      compliance,
      notes,
    };

    setAuditEntries(prev => [entry, ...prev]);
    toast({
      title: 'Simulation complete',
      description: `${currentTicket.summary} via ${routeName}. Risk check ${risk}.`,
    });
    setPromotionTicket(currentTicket);
  };

  const handleCancelTicket = () => {
    setCurrentTicket(null);
    setParseError(null);
  };

  const openPromotionModal = () => {
    setIsCreateModalOpen(true);
  };

  if (!isDemoMode) {
    return (
      <div className="max-w-3xl mx-auto mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Console (Pilot-Assist)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>This cockpit is available in Demo mode only.</p>
            <p className="text-sm text-muted-foreground">
              Switch to the Demo tenant to interact with simulated orders, decision support, and the audit trail without touching live venues.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Console (Pilot-Assist)</h1>
            <p className="text-sm text-slate-600 max-w-2xl mt-2">
              Decision support across Strategy → Risk → Execution → Compliance. All actions here remain in the Demo sandbox—no live orders are dispatched.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-dashed border-emerald-500 text-emerald-600 bg-emerald-50">
              Demo sandbox
            </Badge>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setPaletteOpen(true)}
            >
              <CommandIcon className="h-4 w-4" />
              Open Command Palette
              <span className="text-xs font-mono bg-slate-900 text-white rounded px-1 py-0.5">⌘/Ctrl + K</span>
            </Button>
          </div>
        </header>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                Live Pair Context
                <ChevronRight className="h-4 w-4 text-slate-400" />
                Strategy → Risk → Execution → Compliance
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Choose the working pair and monitor stacked signals before acting.
              </p>
            </div>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                {pairOptions.map(pair => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="border border-slate-200 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-700 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    Signal Stack — Why now?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {demoConsoleData.signalStack.map((signal, index) => (
                    <div key={`${signal.model}-${index}`} className="border border-slate-100 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-800">{signal.model}</span>
                        <span className="text-xs text-slate-500 uppercase">Updated {signal.updated}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{signal.summary}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                          Strength {signal.strength}
                        </Badge>
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                          Confidence {signal.confidence}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-700 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    Pre-trade Sanity — Can I trade?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Free balance</span>
                    <span className="font-semibold">{demoConsoleData.preTrade.freeBalance}</span>
                  </div>
                  <div>
                    <p className="font-medium text-xs uppercase text-slate-500 mb-1">Exposure</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(demoConsoleData.preTrade.exposure).map(([asset, value]) => (
                        <div key={asset} className="flex justify-between text-sm">
                          <span>{asset}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Open orders</span>
                    <span className="font-semibold">{demoConsoleData.preTrade.openOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Funding rate</span>
                    <span className="font-semibold">{demoConsoleData.preTrade.fundingRatePercent?.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API throttle remaining</span>
                    <span className="font-semibold">{demoConsoleData.preTrade.apiThrottleRemaining}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Risk gate</span>
                    <Badge variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700">
                      {demoConsoleData.preTrade.riskGate}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-xs uppercase text-slate-500 mb-1">Messages</p>
                    <ul className="space-y-1 text-xs">
                      {demoConsoleData.preTrade.messages.map(message => (
                        <li key={message} className="flex items-start gap-2">
                          <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 mt-0.5" />
                          <span>{message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-700 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-500" />
                    Guardrails — How much?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Size</span>
                    <span className="font-semibold">{demoConsoleData.guardrails.sizePercent.toFixed(2)}% equity</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stop-loss</span>
                    <span className="font-semibold">{demoConsoleData.guardrails.stopLossPercent.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Take-profit</span>
                    <span className="font-semibold">{demoConsoleData.guardrails.takeProfitPercent.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max daily loss</span>
                    <span className="font-semibold">{demoConsoleData.guardrails.maxDailyLossPercent.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Halt after losses</span>
                    <span className="font-semibold">{demoConsoleData.guardrails.haltAfterLosses}</span>
                  </div>
                  <Separator />
                  <p className="text-xs text-slate-500">
                    All guardrails enforced in demo to mimic production kill-switches and escalation flow.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              Venue Matrix — Where to route?
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              Compare connected venues across fees, depth, and slippage to align execution with guardrails.
            </p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase text-slate-500">Venue</TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">Best bid / ask</TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">Top size</TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">Fee (bps)</TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">Slip @10k (bps)</TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">Route score</TableHead>
                  <TableHead className="text-xs uppercase text-slate-500">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoConsoleData.venueMatrix.map(route => (
                  <TableRow
                    key={route.id}
                    className={cn(
                      route.recommended && 'bg-emerald-50/80',
                    )}
                  >
                    <TableCell className="font-medium text-slate-800">
                      {route.name}
                      {route.recommended && (
                        <Badge variant="outline" className="ml-2 text-xs border-emerald-300 text-emerald-700 bg-emerald-100">
                          Recommended
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold text-slate-700">
                          {route.bestBid.toLocaleString()} / {route.bestAsk.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">{route.topLevelSize}</TableCell>
                    <TableCell className="text-sm text-slate-700">{route.feeBps.toFixed(1)}</TableCell>
                    <TableCell className="text-sm text-slate-700">{route.estimatedSlippageBps.toFixed(1)}</TableCell>
                    <TableCell className="text-sm text-slate-700 font-semibold">{route.routeScore}</TableCell>
                    <TableCell className="text-sm text-slate-600">{route.notes ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                  Command Palette
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Use the grammar below. Commands never leave the Demo sandbox.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setPaletteOpen(true)}
                className="gap-2"
              >
                <CommandIcon className="h-4 w-4" />
                Invoke (⌘/Ctrl + K)
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs uppercase text-slate-500 mb-2">Grammar</p>
                <ul className="space-y-1 text-sm">
                  <li><code>buy {'<pair>'} {'<size%>'} sl={'<stop%>'} tp={'<take%>'} route={'<venue|auto>'}</code></li>
                  <li><code>sell {'<pair>'} {'<size%>'} sl={'<stop%>'} tp={'<take%>'} route={'<venue|auto>'}</code></li>
                  <li><code>reduce pos:{'<asset>'} {'<size%>'}</code></li>
                  <li><code>hedge pos:{'<asset>'} {'<size%>'} via-perp</code></li>
                  <li><code>pause bot:{'<id|name>'}</code> / <code>resume bot:{'<id|name>'}</code></li>
                </ul>
              </div>
              {currentTicket ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-700">
                  Ready: {currentTicket.summary}. Route {formatRouteLabel(currentTicket.resolvedRoute, currentTicket.routeMode)}.
                </div>
              ) : parseError ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {parseError}
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Enter a command or pick a suggestion to prefill the trade ticket.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                  Trade Ticket (Demo)
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Parsed command with guardrail checks and routing estimates.
                </p>
              </div>
              {currentTicket && (
                <Badge className={cn('text-xs', guardrailBadge[currentTicket.riskCheck])}>
                  Risk check: {currentTicket.riskCheck}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              {currentTicket ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Action</p>
                      <p className="mt-1 font-semibold text-slate-900">{currentTicket.summary}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Route</p>
                      <p className="mt-1 font-semibold text-slate-900">{formatRouteLabel(currentTicket.resolvedRoute, currentTicket.routeMode)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Sizing</p>
                      <p className="mt-1 font-semibold text-slate-900">{formatSize(currentTicket)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500">Stops &amp; Targets</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        SL {currentTicket.stopLossPercent !== undefined ? `${currentTicket.stopLossPercent.toFixed(2)}%` : '—'} ·
                        TP {currentTicket.takeProfitPercent !== undefined ? `${currentTicket.takeProfitPercent.toFixed(2)}%` : '—'}
                      </p>
                    </div>
                    {currentTicket.resolvedRoute && (
                      <>
                        <div>
                          <p className="text-xs uppercase text-slate-500">Fees</p>
                          <p className="mt-1 font-semibold text-slate-900">{currentTicket.resolvedRoute.feeBps.toFixed(1)} bps</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-500">Slip est.</p>
                          <p className="mt-1 font-semibold text-slate-900">{currentTicket.resolvedRoute.estimatedSlippageBps.toFixed(1)} bps @ 10k</p>
                        </div>
                      </>
                    )}
                  </div>

                  {currentTicket.guardrailNotes.length > 0 ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                      <p className="text-xs font-semibold uppercase">Guardrail review</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {currentTicket.guardrailNotes.map(note => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                      All guardrails satisfied.
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button onClick={handleSimulate} className="gap-2">
                      <Play className="h-4 w-4" />
                      Simulate
                    </Button>
                    <Button variant="outline" onClick={handleCancelTicket}>
                      Cancel
                    </Button>
                    {promotionTicket && promotionTicket.rawCommand === currentTicket.rawCommand && (
                      <Button variant="secondary" onClick={openPromotionModal} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create automation from ticket
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-slate-500">
                  Invoke the command palette to stage a trade ticket. Everything runs in the Demo sandbox.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                Audit Stream
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Append-only log mirroring production audit trail semantics (who / what / when plus guardrail evaluation).
              </p>
            </div>
            <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-600">
              Demo Only — non-persistent
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs uppercase text-slate-500">Time</TableHead>
                    <TableHead className="text-xs uppercase text-slate-500">Actor</TableHead>
                    <TableHead className="text-xs uppercase text-slate-500">Command</TableHead>
                    <TableHead className="text-xs uppercase text-slate-500">Route</TableHead>
                    <TableHead className="text-xs uppercase text-slate-500">Risk</TableHead>
                    <TableHead className="text-xs uppercase text-slate-500">Compliance</TableHead>
                    <TableHead className="text-xs uppercase text-slate-500">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditEntries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-sm text-slate-700">{entry.timestamp}</TableCell>
                      <TableCell className="text-sm text-slate-700">{entry.actor}</TableCell>
                      <TableCell className="text-sm text-slate-700">{entry.command}</TableCell>
                      <TableCell className="text-sm text-slate-700">{entry.route}</TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', guardrailBadge[entry.risk])}>{entry.risk}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          'text-xs',
                          entry.compliance === 'PASS'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700',
                        )}>
                          {entry.compliance}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{entry.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput
          value={commandInput}
          onValueChange={setCommandInput}
          placeholder="Type a trading command…"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (commandInput.trim()) {
                handleParse(commandInput);
              }
            }
          }}
        />
        <CommandList>
          <CommandEmpty>
            {parseError ?? 'No results. Follow the grammar hints.'}
          </CommandEmpty>
          <CommandGroup heading="Suggestions">
            {COMMAND_SUGGESTIONS.map(item => (
              <CommandItem
                key={item}
                onSelect={() => handleParse(item)}
              >
                <ArrowRight className="h-4 w-4 text-slate-400" />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent Audit">
            {auditEntries.slice(0, 3).map(entry => (
              <CommandItem
                key={entry.id}
                onSelect={() => setCommandInput(entry.command)}
              >
                <Clock4 className="h-4 w-4 text-slate-400" />
                {entry.command}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <CreateBotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={() => setIsCreateModalOpen(false)}
        promotionSource={promotionTicket ? {
          name: `${promotionTicket.action.toUpperCase()} ${promotionTicket.pair ?? promotionTicket.asset ?? 'Automation'} (Demo)`,
          strategySlug: promotionTicket.action === 'buy' || promotionTicket.action === 'sell' ? 'momentum' : 'grid-trading',
          sizePercent: promotionTicket.sizePercent ?? demoConsoleData.guardrails.sizePercent,
          stopLossPercent: promotionTicket.stopLossPercent ?? demoConsoleData.guardrails.stopLossPercent,
          pair: promotionTicket.pair ?? demoConsoleData.defaultPair,
        } : undefined}
      />
    </>
  );
}
