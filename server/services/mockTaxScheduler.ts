import { runMockTaxEngine, type CostBasisMethod, type TaxComputationResult } from "./mockTaxEngine";

export type TaxSyncStatus = {
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
    costBasis: CostBasisMethod;
    baseCurrency: string;
  };
};

const DEFAULT_INTERVAL_MS = 60_000;

let status: TaxSyncStatus = {
  status: "idle",
  lastRunAt: null,
  nextRunAt: null,
  intervalMs: DEFAULT_INTERVAL_MS,
  lastSummary: null,
  runHistory: [],
  options: {
    costBasis: "FIFO",
    baseCurrency: "CHF",
  },
};

let timer: NodeJS.Timeout | null = null;

function computeSummary(result: TaxComputationResult) {
  const realizedGains = result.realizedGains.reduce(
    (acc, gain) => acc + gain.gainLoss,
    0
  );
  const income = result.income.reduce(
    (acc, item) => acc + item.valueInBase,
    0
  );
  const holdingsValue = result.holdings.reduce(
    (acc, item) => acc + item.valueInBase,
    0
  );

  return {
    realizedGains,
    income,
    baseCurrency: result.metadata.baseCurrency,
    holdingsValue,
    transactionsEvaluated: result.transactionsEvaluated,
  };
}

function performSync() {
  status.status = "running";
  const runAt = new Date();
  const result = runMockTaxEngine(status.options);
  const summary = computeSummary(result);

  status.lastRunAt = runAt.toISOString();
  status.nextRunAt = new Date(runAt.getTime() + status.intervalMs).toISOString();
  status.lastSummary = summary;
  status.runHistory = [
    { runAt: status.lastRunAt, realizedGains: summary.realizedGains, income: summary.income },
    ...status.runHistory,
  ].slice(0, 10);
  status.status = "idle";
}

export function startMockTaxScheduler(intervalMs: number = DEFAULT_INTERVAL_MS) {
  status.intervalMs = intervalMs;
  if (!timer) {
    performSync();
    timer = setInterval(performSync, intervalMs);
  }
  return status;
}

export function getMockTaxStatus(): TaxSyncStatus {
  return status;
}

export function triggerManualTaxSync() {
  performSync();
  return status;
}
