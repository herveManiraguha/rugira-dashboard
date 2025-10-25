import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StandardPageLayout } from '@/components/ui/standard-page-layout';
import { EnhancedTable, type ColumnDef } from '@/components/ui/enhanced-table';
import CreateBotModal from '@/components/Modals/CreateBotModal';
import { demoAutomations, type DemoAutomation, type RiskStatus, type ComplianceStatus } from '@/data/demoAutomationData';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Bot,
  Dot,
  Shield,
  Search,
} from 'lucide-react';

type AutomationRow = DemoAutomation & {
  latencySortable: number;
  venueEdgeSortable: number;
};

type ViewMode = 'list' | 'cards';

const statusOptions = [
  { id: 'running', label: 'Running', predicate: (bot: DemoAutomation) => bot.status === 'running' },
  { id: 'stopped', label: 'Stopped', predicate: (bot: DemoAutomation) => bot.status === 'stopped' },
  { id: 'error', label: 'Error', predicate: (bot: DemoAutomation) => bot.status === 'error' },
  { id: 'bx-digital', label: 'BX Digital', predicate: (bot: DemoAutomation) => bot.venue.toLowerCase() === 'bx digital' },
  { id: 'binance', label: 'Binance', predicate: (bot: DemoAutomation) => bot.venue.toLowerCase() === 'binance' },
  { id: 'coinbase', label: 'Coinbase Pro', predicate: (bot: DemoAutomation) => bot.venue.toLowerCase() === 'coinbase pro' },
  { id: 'kraken', label: 'Kraken', predicate: (bot: DemoAutomation) => bot.venue.toLowerCase() === 'kraken' },
  { id: 'bybit', label: 'Bybit', predicate: (bot: DemoAutomation) => bot.venue.toLowerCase() === 'bybit' },
  { id: 'okx', label: 'OKX', predicate: (bot: DemoAutomation) => bot.venue.toLowerCase() === 'okx' },
  { id: 'kucoin', label: 'KuCoin', predicate: (bot: DemoAutomation) => bot.venue.toLowerCase() === 'kucoin' },
  { id: 'gateio', label: 'Gate.io', predicate: (bot: DemoAutomation) => bot.venue.toLowerCase() === 'gate.io' },
];

const riskColors: Record<RiskStatus, string> = {
  OK: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  WARN: 'bg-amber-100 text-amber-800 border border-amber-200',
  HALT: 'bg-red-100 text-red-800 border border-red-200',
};

const complianceColors: Record<ComplianceStatus, string> = {
  PASS: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  WARN: 'bg-amber-50 text-amber-700 border border-amber-200',
  BLOCK: 'bg-red-50 text-red-700 border border-red-200',
};

const statusChipClasses: Record<DemoAutomation['status'], string> = {
  running: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  stopped: 'bg-slate-100 text-slate-600 border border-slate-200',
  error: 'bg-red-100 text-red-700 border border-red-200',
};

const getSignalColor = (value: number) => {
  if (value >= 70) return 'bg-emerald-500';
  if (value >= 40) return 'bg-amber-500';
  if (value > 0) return 'bg-orange-500';
  return 'bg-slate-300';
};

const columns: ColumnDef<AutomationRow>[] = [
  {
    id: 'name',
    header: 'Automation',
    accessorKey: 'name',
    sortable: true,
    cell: (row) => (
      <div className="flex items-center gap-3 min-w-0">
        <Bot className="h-4 w-4 text-slate-400 flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-medium text-sm text-slate-900 truncate">{row.name}</div>
          <div className="text-xs text-slate-500 truncate">{row.strategy}</div>
        </div>
      </div>
    ),
    priority: 'high',
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    sortable: true,
    cell: (row) => (
      <span className={cn('inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium capitalize', statusChipClasses[row.status])}>
        <Dot className="h-4 w-4" />
        {row.status}
      </span>
    ),
    priority: 'high',
  },
  {
    id: 'signalNow',
    header: 'Signal Now',
    accessorKey: 'signalNow',
    sortable: true,
    cell: (row) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-20 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', getSignalColor(row.signalNow))}
            style={{ width: `${Math.max(Math.min(row.signalNow, 100), 0)}%` }}
          />
        </div>
        <span className="text-sm font-medium text-slate-700">{row.signalNow}</span>
      </div>
    ),
    priority: 'medium',
  },
  {
    id: 'riskStatus',
    header: 'Risk',
    accessorKey: 'riskStatus',
    sortable: true,
    cell: (row) => (
      <span className={cn('inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold', riskColors[row.riskStatus])}>
        <Shield className="h-3.5 w-3.5" />
        {row.riskStatus}
      </span>
    ),
    priority: 'high',
  },
  {
    id: 'latencyP50',
    header: 'Latency (p50)',
    accessorKey: 'latencySortable',
    sortable: true,
    cell: (row) => (
      <span className="text-sm text-slate-700">
        {row.latencyP50 !== undefined ? `${row.latencyP50} ms` : '—'}
      </span>
    ),
    priority: 'medium',
  },
  {
    id: 'venue',
    header: 'Venue',
    accessorKey: 'venue',
    sortable: true,
    cell: (row) => (
      <div className="min-w-0">
        <div className="font-medium text-sm text-slate-900 truncate">{row.venue}</div>
        <div className="text-xs text-slate-500 truncate">{row.pair}</div>
      </div>
    ),
    priority: 'medium',
  },
  {
    id: 'routeVia',
    header: 'Route via',
    accessorKey: 'routeVia',
    sortable: true,
    cell: (row) => <span className="text-sm text-slate-700">{row.routeVia}</span>,
    priority: 'low',
  },
  {
    id: 'venueEdgeBps',
    header: 'Venue Edge (bps)',
    accessorKey: 'venueEdgeSortable',
    sortable: true,
    cell: (row) => (
      <span className={cn(
        'text-sm font-medium',
        row.venueEdgeBps !== undefined
          ? row.venueEdgeBps >= 0
            ? 'text-emerald-600'
            : 'text-red-600'
          : 'text-slate-500'
      )}>
        {row.venueEdgeBps !== undefined
          ? `${row.venueEdgeBps >= 0 ? '+' : ''}${row.venueEdgeBps.toFixed(1)}`
          : '—'}
      </span>
    ),
    priority: 'medium',
  },
  {
    id: 'nextAction',
    header: 'Next Action',
    accessorKey: 'nextAction',
    sortable: true,
    cell: (row) => <span className="text-sm text-slate-700">{row.nextAction}</span>,
    priority: 'medium',
  },
  {
    id: 'pnl24h',
    header: '24h P&L',
    accessorKey: 'pnl24h',
    sortable: true,
    cell: (row) => (
      <span className={cn(
        'text-sm font-semibold',
        row.pnl24h > 0 ? 'text-emerald-600' :
        row.pnl24h < 0 ? 'text-red-600' :
        'text-slate-600'
      )}>
        CHF {row.pnl24h > 0 ? `+${row.pnl24h.toFixed(2)}` : row.pnl24h.toFixed(2)}
      </span>
    ),
    priority: 'medium',
  },
  {
    id: 'totalPnl',
    header: 'Total P&L',
    accessorKey: 'totalPnl',
    sortable: true,
    cell: (row) => (
      <span className={cn(
        'text-sm font-semibold',
        row.totalPnl > 0 ? 'text-emerald-600' :
        row.totalPnl < 0 ? 'text-red-600' :
        'text-slate-600'
      )}>
        CHF {row.totalPnl > 0 ? `+${row.totalPnl.toFixed(2)}` : row.totalPnl.toFixed(2)}
      </span>
    ),
    priority: 'medium',
  },
  {
    id: 'uptime',
    header: 'Uptime',
    accessorKey: 'uptime',
    sortable: true,
    cell: (row) => <span className="text-sm text-slate-700">{row.uptime}</span>,
    priority: 'low',
  },
];

function useAutomationFilters(view: DemoAutomation[], search: string, activeFilters: string[]) {
  return useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = view.filter((automation) => {
      const matchesSearch = !normalizedSearch || [
        automation.name,
        automation.strategy,
        automation.venue,
        automation.pair,
        automation.signalSummary,
        automation.riskStatus,
        automation.complianceStatus,
      ].some(value => value?.toLowerCase().includes(normalizedSearch));

      if (!matchesSearch) {
        return false;
      }

      if (activeFilters.length === 0) {
        return true;
      }

      return activeFilters.some(filterId => {
        const option = statusOptions.find(option => option.id === filterId);
        return option ? option.predicate(automation) : false;
      });
    });

    return filtered;
  }, [view, search, activeFilters]);
}

export default function AutomationsDemo() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredAutomations = useAutomationFilters(demoAutomations, searchTerm, activeFilters);

  const tableRows: AutomationRow[] = useMemo(
    () =>
      filteredAutomations.map(automation => ({
        ...automation,
        latencySortable: automation.latencyP50 ?? Number.MAX_SAFE_INTEGER,
        venueEdgeSortable: automation.venueEdgeBps ?? Number.MIN_SAFE_INTEGER,
      })),
    [filteredAutomations],
  );

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId],
    );
  };

  return (
    <>
      <StandardPageLayout
        title="Automations"
        subtitle="Hands-free strategies with trader-grade context for discretionary decisions."
        viewMode={viewMode === 'cards' ? 'cards' : 'list'}
        onViewModeChange={(mode) => setViewMode(mode === 'cards' ? 'cards' : 'list')}
        showViewModes
        actionButton={{
          label: 'Create Automation',
          onClick: () => setIsCreateModalOpen(true),
        }}
        additionalControls={
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search automations..."
                className="pl-9 h-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {statusOptions.map(option => (
            <Badge
              key={option.id}
              variant={activeFilters.includes(option.id) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer px-3 py-1.5 rounded-full flex items-center gap-2',
                activeFilters.includes(option.id) ? 'bg-slate-900 text-white' : 'hover:bg-slate-100',
              )}
              onClick={() => toggleFilter(option.id)}
            >
              {option.label}
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="px-3"
              onClick={() => setActiveFilters([])}
            >
              Clear
            </Button>
          )}
        </div>

        {viewMode === 'cards' ? (
          <AutomationCards automations={filteredAutomations} />
        ) : (
          <EnhancedTable
            data={tableRows}
            columns={columns}
            enableSearch={false}
            enableFilters={false}
            pageSize={8}
            className="mt-4"
          />
        )}
      </StandardPageLayout>

      <CreateBotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}

function AutomationCards({ automations }: { automations: DemoAutomation[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {automations.map(automation => (
        <Card key={automation.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    {automation.name}
                  </CardTitle>
                  <span className={cn(
                    'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                    statusChipClasses[automation.status],
                  )}>
                    <Dot className="h-4 w-4" />
                    {automation.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {automation.strategy} • {automation.venue} • {automation.pair}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Signal</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-2 w-14 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', getSignalColor(automation.signalNow))}
                      style={{ width: `${Math.max(Math.min(automation.signalNow, 100), 0)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {automation.signalNow}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{automation.signalSummary}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <section>
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Performance</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    'px-2 py-0.5 text-xs font-semibold border-0',
                    automation.totalPnl >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
                  )}
                >
                  {automation.totalPnl >= 0 ? 'Profitable' : 'Loss'}
                </Badge>
              </header>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">24h P&L</p>
                  <p className={cn(
                    'mt-1 text-base font-semibold',
                    automation.pnl24h > 0 ? 'text-emerald-600' :
                    automation.pnl24h < 0 ? 'text-red-600' :
                    'text-slate-600',
                  )}>
                    CHF {automation.pnl24h > 0 ? `+${automation.pnl24h.toFixed(2)}` : automation.pnl24h.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total P&L</p>
                  <p className={cn(
                    'mt-1 text-base font-semibold',
                    automation.totalPnl > 0 ? 'text-emerald-600' :
                    automation.totalPnl < 0 ? 'text-red-600' :
                    'text-slate-600',
                  )}>
                    CHF {automation.totalPnl > 0 ? `+${automation.totalPnl.toFixed(2)}` : automation.totalPnl.toFixed(2)}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Risk &amp; Execution</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    'px-2 py-0.5 text-xs font-semibold',
                    riskColors[automation.riskStatus],
                  )}
                >
                  <Shield className="h-3.5 w-3.5 mr-1" />
                  {automation.riskStatus} · Score {automation.riskScore}
                </Badge>
              </header>
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Drawdown</p>
                  <p className="mt-1 font-semibold text-slate-900">{automation.drawdownPercent.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Consecutive Losses</p>
                  <p className="mt-1 font-semibold text-slate-900">{automation.consecutiveLosses}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Latency (p50/p95)</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {automation.latencyP50 !== undefined && automation.latencyP95 !== undefined
                      ? `${automation.latencyP50} / ${automation.latencyP95} ms`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Venue Edge</p>
                  <p className={cn(
                    'mt-1 font-semibold',
                    automation.venueEdgeBps !== undefined
                      ? automation.venueEdgeBps >= 0
                        ? 'text-emerald-600'
                        : 'text-red-600'
                      : 'text-slate-600',
                  )}>
                    {automation.venueEdgeBps !== undefined
                      ? `${automation.venueEdgeBps >= 0 ? '+' : ''}${automation.venueEdgeBps.toFixed(1)} bps`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Next Action</p>
                  <p className="mt-1 font-semibold text-slate-900">{automation.nextAction}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Budget Utilization</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {automation.budgetUtilizationPercent.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Badge
                  variant="outline"
                  className={cn(
                    'px-2 py-1 text-xs font-semibold',
                    complianceColors[automation.complianceStatus],
                  )}
                >
                  Compliance: {automation.complianceStatus}
                  {automation.complianceStatus !== 'PASS' && automation.complianceReason ? ` · ${automation.complianceReason}` : ''}
                </Badge>
                {automation.rejectRatePercent !== undefined && (
                  <Badge variant="outline" className="text-xs text-slate-600">
                    Rejects {automation.rejectRatePercent.toFixed(2)}%
                  </Badge>
                )}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Uptime</p>
                <p className="mt-1 font-semibold text-slate-900">{automation.uptime}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Last Trade</p>
                <p className="mt-1 font-semibold text-slate-900">{automation.lastTrade ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Signal Trend</p>
                <p className="mt-1 font-semibold text-slate-900">{automation.signalTrend}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Route</p>
                <p className="mt-1 font-semibold text-slate-900">{automation.routeVia}</p>
              </div>
            </section>

            {automation.status === 'error' && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-3 py-2 rounded-lg text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Automation halted pending operator review.</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
