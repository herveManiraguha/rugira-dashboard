import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StandardPageLayout } from "@/components/ui/standard-page-layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type {
  MockVenueTransaction,
  MockFxRate,
  MockMarketPrice,
} from "@shared/mockData";
import {
  AlertTriangle,
  Database,
  PiggyBank,
  RefreshCw,
  Shield,
  TrendingUp,
  Wallet,
  Download,
  FileText,
} from "lucide-react";

type IncomeType = "staking_reward" | "interest" | "airdrop";

interface HoldingsSnapshotRecord {
  venue: string;
  asset: string;
  quantity: number;
  valueInBase: number;
  capturedAt: string;
}

interface RealizedGainRecord {
  id: string;
  transactionId: string;
  venue: string;
  asset: string;
  quantity: number;
  proceeds: number;
  costBasis: number;
  gainLoss: number;
  currency: string;
  timestamp: string;
  lotBreakdown: Array<{
    lotId: string;
    quantity: number;
    costBasisPortion: number;
  }>;
}

interface IncomeRecord {
  id: string;
  transactionId: string;
  venue: string;
  asset: string;
  amount: number;
  valueInBase: number;
  currency: string;
  timestamp: string;
  type: IncomeType;
}

interface TaxLotRecord {
  id: string;
  venue: string;
  asset: string;
  quantity: number;
  remainingQuantity: number;
  acquisitionPrice: number;
  acquisitionValue: number;
  acquisitionCurrency: string;
  acquisitionTimestamp: string;
  sourceTransactionId: string;
}

interface TaxEnginePayload {
  metadata: {
    generatedAt: string;
    costBasis: string;
    baseCurrency: string;
    filters: {
      startDate?: string;
      endDate?: string;
      venues?: string[];
    };
  };
  lots: TaxLotRecord[];
  realizedGains: RealizedGainRecord[];
  income: IncomeRecord[];
  holdings: HoldingsSnapshotRecord[];
  fxRates: MockFxRate[];
  marketPrices: MockMarketPrice[];
  transactionsEvaluated: number;
}

interface TaxSyncStatus {
  status: "idle" | "running";
  lastRunAt: string | null;
  nextRunAt: string | null;
  intervalMs: number;
  lastSummary: {
    realizedGains: number;
    income: number;
    baseCurrency: string;
    holdingsValue: number;
    transactionsEvaluated: number;
  } | null;
  runHistory: Array<{ runAt: string; realizedGains: number; income: number }>;
  options: {
    costBasis: string;
    baseCurrency: string;
  };
}

interface TaxPreviewResponse {
  metadata: {
    requestedAt: string;
    reportType: string;
    jurisdiction: string;
    startDate: string | null;
    endDate: string | null;
    venues: string[];
    costBasis: string;
    baseCurrency: string;
  };
  summary: {
    totalTransactions: number;
    totalVenues: number;
    realizedGains: number;
    feesPaid: number;
    incomeEvents: number;
    incomeValue: number;
  };
  holdingsSnapshot: HoldingsSnapshotRecord[];
  fxRates: MockFxRate[];
  marketPrices: MockMarketPrice[];
  sampleTransactions: MockVenueTransaction[];
  engine: TaxEnginePayload;
}

interface PaginatedTransactionResponse {
  items: MockVenueTransaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
  appliedFilters: Record<string, unknown>;
}

interface HoldingsResponse {
  items: HoldingsSnapshotRecord[];
  asOf: string | null;
  appliedFilters: Record<string, unknown>;
}

interface FxRatesResponse {
  items: MockFxRate[];
  appliedFilters: Record<string, unknown>;
}

const years = ["2025", "2024", "2023", "2022"];
const jurisdictions = [
  { value: "CH", label: "Switzerland (CH)" },
  { value: "EU", label: "European Union (EU)" },
];

const costBasisOptions = [
  { value: "FIFO", label: "FIFO" },
  { value: "LIFO", label: "LIFO" },
  { value: "HIFO", label: "HIFO" },
];

const formatCurrency = (value: number, currency = "CHF") =>
  new Intl.NumberFormat("en-CH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export default function TaxCenter() {
  const [jurisdiction, setJurisdiction] = useState("CH");
  const [taxYear, setTaxYear] = useState(() =>
    String(new Date().getFullYear())
  );
  const [costBasis, setCostBasis] = useState("FIFO");
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<MockVenueTransaction[]>([]);
  const [holdings, setHoldings] = useState<HoldingsSnapshotRecord[]>([]);
  const [fxRates, setFxRates] = useState<MockFxRate[]>([]);
  const [preview, setPreview] = useState<TaxPreviewResponse | null>(null);
  const [taxStatus, setTaxStatus] = useState<TaxSyncStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [showRawPayload, setShowRawPayload] = useState(false);

  const baseCurrency = preview?.metadata.baseCurrency ?? "CHF";

  const availableVenues = useMemo(() => {
    const venues = new Set<string>();
    transactions.forEach((txn) => venues.add(txn.venue));
    holdings.forEach((holding) => venues.add(holding.venue));
    preview?.metadata.venues
      .filter((venue) => venue !== "All")
      .forEach((venue) => venues.add(venue));
    return Array.from(venues);
  }, [transactions, holdings, preview?.metadata.venues]);

  const fetchTaxData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = `${taxYear}-01-01T00:00:00Z`;
      const endDate = `${taxYear}-12-31T23:59:59Z`;
      const params = new URLSearchParams({
        jurisdiction,
        startDate,
        endDate,
        costBasis,
        baseCurrency,
      });

      if (selectedVenues.length > 0) {
        params.set("venues", selectedVenues.join(","));
      }

      const query = params.toString();

      const [transactionsRes, holdingsRes, fxRes, previewRes, statusRes] =
        await Promise.all([
          fetch(`/api/tax/transactions?${query}`),
          fetch(`/api/tax/holdings?${query}`),
          fetch(`/api/tax/fx-rates?${query}`),
          fetch(`/api/tax/reports/preview?${query}`),
          fetch(`/api/tax/status`),
        ]);

      if (!transactionsRes.ok) {
        throw new Error("Failed to load transactions");
      }
      if (!holdingsRes.ok) {
        throw new Error("Failed to load holdings");
      }
      if (!fxRes.ok) {
        throw new Error("Failed to load FX rates");
      }
      if (!previewRes.ok) {
        throw new Error("Failed to load report preview");
      }
      if (!statusRes.ok) {
        throw new Error("Failed to load tax status");
      }

      const transactionsJson =
        (await transactionsRes.json()) as PaginatedTransactionResponse;
      const holdingsJson = (await holdingsRes.json()) as HoldingsResponse;
      const fxJson = (await fxRes.json()) as FxRatesResponse;
      const previewJson = (await previewRes.json()) as TaxPreviewResponse;
      const statusJson = (await statusRes.json()) as TaxSyncStatus;

      setTransactions(transactionsJson.items);
      setHoldings(holdingsJson.items);
      setFxRates(fxJson.items);
      setPreview(previewJson);
      setTaxStatus(statusJson);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [
    jurisdiction,
    taxYear,
    selectedVenues,
    costBasis,
    baseCurrency,
  ]);

  useEffect(() => {
    fetchTaxData();
  }, [fetchTaxData]);

  const reconciliationWarnings = useMemo(() => {
    if (!preview) return [];
    const warnings: Array<{ title: string; description: string }> = [];

    const manualTransfers = transactions.filter(
      (txn) =>
        txn.type === "transfer_in" && txn.source !== "rugira_bot"
    );
    if (manualTransfers.length) {
      warnings.push({
        title: "Manual transfers detected",
        description: `${manualTransfers.length} transfer(s) were imported from external sources. Verify they are internal moves to avoid taxable events.`,
      });
    }

    const unmatchedLots =
      preview.engine?.lots.filter(
        (lot) =>
          lot.remainingQuantity === lot.quantity &&
          lot.sourceTransactionId.includes("transfer")
      ).length ?? 0;

    if (unmatchedLots) {
      warnings.push({
        title: "Unclassified cost basis lots",
        description: `${unmatchedLots} lot(s) originated from transfers and still need cost-basis confirmation.`,
      });
    }

    const zeroBreakdown =
      preview.engine?.realizedGains.filter(
        (gain) => gain.lotBreakdown.length === 0
      ).length ?? 0;
    if (zeroBreakdown) {
      warnings.push({
        title: "Gains without lot attribution",
        description: `${zeroBreakdown} realized trade(s) could not be matched to acquisition lots. Check cost basis rules or missing imports.`,
      });
    }

    return warnings;
  }, [preview, transactions]);

  const totalHoldingsValue = useMemo(
    () =>
      holdings.reduce((acc, snapshot) => acc + snapshot.valueInBase, 0),
    [holdings]
  );

  const realizedTop = useMemo(
    () =>
      preview?.engine.realizedGains
        .slice(0, 5)
        .sort((a, b) => Math.abs(b.gainLoss) - Math.abs(a.gainLoss)) ?? [],
    [preview]
  );

  const incomeTop = useMemo(
    () =>
      preview?.engine.income
        .slice(0, 5)
        .sort((a, b) => b.valueInBase - a.valueInBase) ?? [],
    [preview]
  );

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort(
          (a, b) =>
            new Date(b.venueTimestamp).getTime() -
            new Date(a.venueTimestamp).getTime()
        )
        .slice(0, 10),
    [transactions]
  );

  const handleVenueToggle = (venue: string, checked: boolean) => {
    setSelectedVenues((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, venue]));
      }
      return prev.filter((item) => item !== venue);
    });
  };

  const buildExportUrl = (format: "csv" | "pdf") => {
    const startDate = `${taxYear}-01-01T00:00:00Z`;
    const endDate = `${taxYear}-12-31T23:59:59Z`;
    const params = new URLSearchParams({
      jurisdiction,
      startDate,
      endDate,
      costBasis,
      baseCurrency,
    });
    if (selectedVenues.length > 0) {
      params.set("venues", selectedVenues.join(","));
    }
    return `/api/tax/reports/export.${format}?${params.toString()}`;
  };

  const handleExport = (format: "csv" | "pdf") => {
    const url = buildExportUrl(format);
    window.open(url, "_blank", "noopener");
  };

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      await fetch("/api/tax/status/run", { method: "POST" });
      await fetchTaxData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to trigger sync";
      setError(message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <StandardPageLayout
      title="Tax Center"
      subtitle="Prepare regulatory-ready summaries across all connected venues."
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={fetchTaxData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh data
        </Button>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("csv")}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSV Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("pdf")}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  PDF Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Jurisdiction
              </span>
              <Select
                value={jurisdiction}
                onValueChange={(value) => setJurisdiction(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {jurisdictions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Tax year
              </span>
              <Select value={taxYear} onValueChange={(value) => setTaxYear(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tax year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Cost basis
              </span>
              <Select
                value={costBasis}
                onValueChange={(value) => setCostBasis(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cost basis" />
                </SelectTrigger>
                <SelectContent>
                  {costBasisOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Venues
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedVenues.length > 0
                      ? `${selectedVenues.length} selected`
                      : "All venues"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {availableVenues.length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No venues detected
                    </div>
                  )}
                  {availableVenues.map((venue) => (
                    <DropdownMenuCheckboxItem
                      key={venue}
                      checked={selectedVenues.includes(venue)}
                      onCheckedChange={(checked) =>
                        handleVenueToggle(venue, Boolean(checked))
                      }
                    >
                      {venue}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Alert>
            <AlertTitle>Loading data</AlertTitle>
            <AlertDescription>
              Fetching mock tax transactions, holdings, and conversions…
            </AlertDescription>
          </Alert>
        )}

        <Alert variant="secondary" className="border-dashed border-amber-300 bg-amber-50">
          <AlertTitle>Demo data notice</AlertTitle>
          <AlertDescription>
            All tax numbers shown here are generated from mock data to illustrate the reporting flow.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Background sync status</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Scheduler refreshes the mock ledger every {(taxStatus?.intervalMs ?? 60000) / 1000} seconds.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={taxStatus?.status === "running" ? "outline" : "secondary"}
                className={taxStatus?.status === "running" ? "border-amber-400 text-amber-500" : ""}
              >
                {taxStatus?.status === "running" ? "Running" : "Idle"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSync}
                disabled={syncing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                Sync now
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Last run</p>
              <p className="text-sm font-semibold">
                {taxStatus?.lastRunAt ? formatDate(taxStatus.lastRunAt) : "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Next run</p>
              <p className="text-sm font-semibold">
                {taxStatus?.nextRunAt ? formatDate(taxStatus.nextRunAt) : "Scheduled"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Realized gains</p>
              <p className="text-sm font-semibold text-emerald-600">
                {formatCurrency(taxStatus?.lastSummary?.realizedGains ?? 0, baseCurrency)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Income captured</p>
              <p className="text-sm font-semibold text-blue-600">
                {formatCurrency(taxStatus?.lastSummary?.income ?? 0, baseCurrency)}
              </p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Failed to load tax data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm text-muted-foreground">
                Realized gains
              </CardTitle>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                {formatCurrency(preview?.summary.realizedGains ?? 0, baseCurrency)}
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm text-muted-foreground">
                Taxable income
              </CardTitle>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <PiggyBank className="h-5 w-5 text-blue-500" />
                {formatCurrency(preview?.summary.incomeValue ?? 0, baseCurrency)}
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm text-muted-foreground">
                Fees captured
              </CardTitle>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Shield className="h-5 w-5 text-amber-500" />
                {formatCurrency(preview?.summary.feesPaid ?? 0, baseCurrency)}
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm text-muted-foreground">
                Holdings value
              </CardTitle>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Wallet className="h-5 w-5 text-purple-500" />
                {formatCurrency(totalHoldingsValue, baseCurrency)}
              </div>
            </CardHeader>
          </Card>
        </div>

        {reconciliationWarnings.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
                Reconciliation warnings
              </CardTitle>
              <Badge variant="outline">
                {reconciliationWarnings.length} item(s)
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {reconciliationWarnings.map((warning, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium text-gray-800">
                    {warning.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {warning.description}
                  </p>
                  {index < reconciliationWarnings.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top realized gains</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Highest impact disposals in {taxYear}
                </p>
              </div>
              <Badge variant="secondary">{realizedTop.length} rows</Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead className="text-right">Gain</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {realizedTop.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.asset}</TableCell>
                      <TableCell>{item.venue}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            item.gainLoss >= 0 ? "text-emerald-600" : "text-red-600"
                          }
                        >
                          {formatCurrency(item.gainLoss, baseCurrency)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {realizedTop.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-6">
                        No realized gains recorded for the selected period.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Income events</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Staking and interest captured automatically
                </p>
              </div>
              <Badge variant="secondary">{incomeTop.length} rows</Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeTop.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="capitalize">{item.type.replace("_", " ")}</TableCell>
                      <TableCell>{item.venue}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.valueInBase, baseCurrency)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {incomeTop.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-6">
                        No taxable income detected for the selected period.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Holdings snapshot</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {preview?.metadata.endDate
                    ? `As of ${formatDate(preview.metadata.endDate)}`
                    : "Latest balance import"}
                </p>
              </div>
              <Badge variant="secondary">{holdings.length} assets</Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Venue</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdings.map((holding) => (
                    <TableRow key={`${holding.venue}-${holding.asset}`}>
                      <TableCell>{holding.venue}</TableCell>
                      <TableCell>{holding.asset}</TableCell>
                      <TableCell className="text-right">
                        {holding.quantity.toLocaleString("en-CH", {
                          maximumFractionDigits: 8,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(holding.valueInBase, baseCurrency)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {holdings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">
                        No holdings snapshot available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>FX reference rates</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Rates applied when converting to {baseCurrency}
                </p>
              </div>
              <Badge variant="secondary">{fxRates.length} entries</Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pair</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Captured</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fxRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {rate.baseCurrency}/{rate.quoteCurrency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {rate.rate.toLocaleString("en-CH", {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 6,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatDate(rate.capturedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {fxRates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-6">
                        No FX data available for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent taxable events</CardTitle>
              <p className="text-sm text-muted-foreground">
                Snapshot of the last 10 transactions in scope
              </p>
            </div>
            <Badge variant="secondary">
              {preview?.summary.totalTransactions ?? 0} total in period
            </Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Value ({baseCurrency})</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{formatDate(txn.venueTimestamp)}</TableCell>
                    <TableCell>{txn.venue}</TableCell>
                    <TableCell className="capitalize">{txn.type.replace("_", " ")}</TableCell>
                    <TableCell>{txn.baseAsset}</TableCell>
                    <TableCell className="text-right">
                      {txn.quantity.toLocaleString("en-CH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(
                        txn.quoteConversion?.value ?? txn.netValue ?? 0,
                        baseCurrency
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-6">
                      No transactions available for the current selection.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-3">
            <Database className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Engine diagnostics</CardTitle>
              <p className="text-sm text-muted-foreground">
                Demonstrates the in-memory tax engine outputs for auditability.
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Cost basis</p>
              <p className="text-lg font-semibold">{preview?.metadata.costBasis}</p>
              <p className="text-xs text-muted-foreground">
                Evaluated {preview?.engine.transactionsEvaluated ?? 0} transactions
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Open lots</p>
              <p className="text-lg font-semibold">
                {preview
                  ? preview.engine.lots.filter((lot) => lot.remainingQuantity > 0)
                      .length
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">
                Remaining inventory awaiting disposal
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Income lots</p>
              <p className="text-lg font-semibold">
                {preview?.engine.income.length ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">
                Captured as ordinary income in base currency
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Raw payloads</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use this view to walk through the API data during demos.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show raw JSON</span>
              <Switch
                checked={showRawPayload}
                onCheckedChange={setShowRawPayload}
              />
            </div>
          </CardHeader>
          {showRawPayload && (
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Report preview</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs">
{JSON.stringify(preview, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Tax status</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs">
{JSON.stringify(taxStatus, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Transactions (first 20)</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-xs">
{JSON.stringify(transactions.slice(0, 20), null, 2)}
                </pre>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </StandardPageLayout>
  );
}
