import {
  mockVenueTransactions,
  mockVenueBalanceSnapshots,
  MockVenueTransaction,
  MockVenueBalanceSnapshot,
  MockFxRate,
  mockFxRates,
  MockMarketPrice,
  mockMarketPrices,
} from "../../shared/mockData";

export type CostBasisMethod = "FIFO" | "LIFO" | "HIFO";

interface TaxEngineOptions {
  costBasis: CostBasisMethod;
  baseCurrency: string;
  startDate?: string;
  endDate?: string;
  venues?: string[];
}

interface TaxLot {
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
  type: "staking_reward" | "interest" | "airdrop";
}

interface HoldingsSnapshotRecord {
  venue: string;
  asset: string;
  quantity: number;
  valueInBase: number;
  capturedAt: string;
}

export interface TaxComputationResult {
  metadata: {
    generatedAt: string;
    costBasis: CostBasisMethod;
    baseCurrency: string;
    filters: {
      startDate?: string;
      endDate?: string;
      venues?: string[];
    };
  };
  lots: TaxLot[];
  realizedGains: RealizedGainRecord[];
  income: IncomeRecord[];
  holdings: HoldingsSnapshotRecord[];
  fxRates: MockFxRate[];
  marketPrices: MockMarketPrice[];
  transactionsEvaluated: number;
}

function filterTransactions(
  transactions: MockVenueTransaction[],
  options: TaxEngineOptions
) {
  const { startDate, endDate, venues } = options;
  let filtered = [...transactions];

  if (venues && venues.length) {
    const lower = venues.map((v) => v.toLowerCase());
    filtered = filtered.filter((txn) => lower.includes(txn.venue.toLowerCase()));
  }

  if (startDate) {
    const start = new Date(startDate).getTime();
    filtered = filtered.filter(
      (txn) => new Date(txn.venueTimestamp).getTime() >= start
    );
  }

  if (endDate) {
    const end = new Date(endDate).getTime();
    filtered = filtered.filter(
      (txn) => new Date(txn.venueTimestamp).getTime() <= end
    );
  }

  return filtered.sort(
    (a, b) =>
      new Date(a.venueTimestamp).getTime() - new Date(b.venueTimestamp).getTime()
  );
}

function convertToBase(
  value: number,
  currency: string,
  baseCurrency: string,
  timestamp: string,
  fallbackRates: MockFxRate[]
) {
  if (currency.toUpperCase() === baseCurrency.toUpperCase()) {
    return value;
  }

  const rate =
    fallbackRates.find(
      (fx) =>
        fx.baseCurrency.toUpperCase() === currency.toUpperCase() &&
        fx.quoteCurrency.toUpperCase() === baseCurrency.toUpperCase()
    )?.rate ?? 1;

  return value * rate;
}

function sortLots(lots: TaxLot[], costBasis: CostBasisMethod): TaxLot[] {
  switch (costBasis) {
    case "FIFO":
      return lots.sort(
        (a, b) =>
          new Date(a.acquisitionTimestamp).getTime() -
          new Date(b.acquisitionTimestamp).getTime()
      );
    case "LIFO":
      return lots.sort(
        (a, b) =>
          new Date(b.acquisitionTimestamp).getTime() -
          new Date(a.acquisitionTimestamp).getTime()
      );
    case "HIFO":
      return lots.sort((a, b) => b.acquisitionPrice - a.acquisitionPrice);
    default:
      return lots;
  }
}

function createLotsFromTransactions(
  transactions: MockVenueTransaction[],
  options: TaxEngineOptions
): {
  lots: TaxLot[];
  realized: RealizedGainRecord[];
  income: IncomeRecord[];
} {
  const lots: TaxLot[] = [];
  const realized: RealizedGainRecord[] = [];
  const income: IncomeRecord[] = [];

  for (const txn of transactions) {
    const baseAsset = txn.baseAsset;
    const baseCurrency = options.baseCurrency;

    if (txn.type === "trade" && txn.side === "buy") {
      const unitPrice = txn.price || 0;
      const acquisitionValue = convertToBase(
        (txn.price || 0) * txn.quantity,
        txn.quoteAsset,
        baseCurrency,
        txn.venueTimestamp,
        mockFxRates
      );

      lots.push({
        id: `${txn.id}-lot`,
        venue: txn.venue,
        asset: baseAsset,
        quantity: txn.quantity,
        remainingQuantity: txn.quantity,
        acquisitionPrice: unitPrice,
        acquisitionValue,
        acquisitionCurrency: baseCurrency,
        acquisitionTimestamp: txn.venueTimestamp,
        sourceTransactionId: txn.id,
      });
    } else if (txn.type === "transfer_in") {
      const unitPrice =
        (txn.price || 0) > 0 ? txn.price! : (txn.grossValue || 0) / (txn.quantity || 1);
      const acquisitionValue = convertToBase(
        txn.grossValue,
        txn.quoteAsset,
        baseCurrency,
        txn.venueTimestamp,
        mockFxRates
      );
      lots.push({
        id: `${txn.id}-lot`,
        venue: txn.venue,
        asset: baseAsset,
        quantity: txn.quantity,
        remainingQuantity: txn.quantity,
        acquisitionPrice: unitPrice,
        acquisitionValue,
        acquisitionCurrency: baseCurrency,
        acquisitionTimestamp: txn.venueTimestamp,
        sourceTransactionId: txn.id,
      });
    } else if (txn.type === "staking_reward" || txn.type === "interest" || txn.type === "airdrop") {
      const amountBase = convertToBase(
        txn.netValue,
        txn.quoteAsset,
        baseCurrency,
        txn.venueTimestamp,
        mockFxRates
      );
      income.push({
        id: `${txn.id}-income`,
        transactionId: txn.id,
        venue: txn.venue,
        asset: baseAsset,
        amount: txn.quantity,
        valueInBase: amountBase,
        currency: baseCurrency,
        timestamp: txn.venueTimestamp,
        type: txn.type,
      });

      lots.push({
        id: `${txn.id}-lot`,
        venue: txn.venue,
        asset: baseAsset,
        quantity: txn.quantity,
        remainingQuantity: txn.quantity,
        acquisitionPrice: (txn.netValue || 0) / (txn.quantity || 1),
        acquisitionValue: amountBase,
        acquisitionCurrency: baseCurrency,
        acquisitionTimestamp: txn.venueTimestamp,
        sourceTransactionId: txn.id,
      });
    } else if (txn.type === "trade" && txn.side === "sell") {
      let quantityRemaining = txn.quantity;
      const proceeds = convertToBase(
        txn.netValue,
        txn.quoteAsset,
        baseCurrency,
        txn.venueTimestamp,
        mockFxRates
      );
      const candidateLots = sortLots(
        lots.filter(
          (lot) =>
            lot.asset === baseAsset &&
            lot.venue.toLowerCase() === txn.venue.toLowerCase() &&
            lot.remainingQuantity > 0
        ),
        options.costBasis
      );

      const lotBreakdown: RealizedGainRecord["lotBreakdown"] = [];
      let costBasisTotal = 0;

      for (const lot of candidateLots) {
        if (quantityRemaining <= 0) break;

        const quantityToUse = Math.min(lot.remainingQuantity, quantityRemaining);
        const lotCostPerUnit =
          lot.acquisitionValue / (lot.quantity || 1);
        const costPortion = lotCostPerUnit * quantityToUse;

        lot.remainingQuantity -= quantityToUse;
        quantityRemaining -= quantityToUse;
        costBasisTotal += costPortion;
        lotBreakdown.push({
          lotId: lot.id,
          quantity: quantityToUse,
          costBasisPortion: costPortion,
        });
      }

      realized.push({
        id: `${txn.id}-gain`,
        transactionId: txn.id,
        venue: txn.venue,
        asset: baseAsset,
        quantity: txn.quantity,
        proceeds,
        costBasis: costBasisTotal,
        gainLoss: proceeds - costBasisTotal,
        currency: baseCurrency,
        timestamp: txn.venueTimestamp,
        lotBreakdown,
      });
    }
  }

  return { lots, realized, income };
}

export function runMockTaxEngine(
  options: TaxEngineOptions
): TaxComputationResult {
  const transactions = filterTransactions(mockVenueTransactions, options);
  const { lots, realized, income } = createLotsFromTransactions(
    transactions,
    options
  );

  const holdings = mockVenueBalanceSnapshots
    .filter((snap) => {
      if (options.venues && options.venues.length) {
        return options.venues
          .map((v) => v.toLowerCase())
          .includes(snap.venue.toLowerCase());
      }
      return true;
    })
    .map<HoldingsSnapshotRecord>((snap) => ({
      venue: snap.venue,
      asset: snap.asset,
      quantity: snap.total,
      valueInBase: snap.valueInBase,
      capturedAt: snap.capturedAt,
    }));

  const appliedFxRates = mockFxRates.filter((rate) => {
    if (!options.startDate && !options.endDate) return true;
    const ts = new Date(rate.capturedAt).getTime();
    const afterStart = options.startDate
      ? ts >= new Date(options.startDate).getTime()
      : true;
    const beforeEnd = options.endDate
      ? ts <= new Date(options.endDate).getTime()
      : true;
    return afterStart && beforeEnd;
  });

  const appliedMarketPrices = mockMarketPrices.filter((price) => {
    if (!options.startDate && !options.endDate) return true;
    const ts = new Date(price.capturedAt).getTime();
    const afterStart = options.startDate
      ? ts >= new Date(options.startDate).getTime()
      : true;
    const beforeEnd = options.endDate
      ? ts <= new Date(options.endDate).getTime()
      : true;
    return afterStart && beforeEnd;
  });

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      costBasis: options.costBasis,
      baseCurrency: options.baseCurrency,
      filters: {
        startDate: options.startDate,
        endDate: options.endDate,
        venues: options.venues,
      },
    },
    lots,
    realizedGains: realized,
    income,
    holdings,
    fxRates: appliedFxRates,
    marketPrices: appliedMarketPrices,
    transactionsEvaluated: transactions.length,
  };
}
