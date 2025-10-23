import fs from "fs";
import path from "path";
import {
  mockVenueTransactions,
  mockVenueBalanceSnapshots,
  mockFxRates,
  mockMarketPrices,
} from "../../shared/mockData";

const OUTPUT_DIR = path.join(process.cwd(), "public", "samples");
const FILE_NAME = "mock-tax-data.json";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const payload = {
  generatedAt: new Date().toISOString(),
  transactions: mockVenueTransactions,
  balances: mockVenueBalanceSnapshots,
  fxRates: mockFxRates,
  marketPrices: mockMarketPrices,
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, FILE_NAME),
  JSON.stringify(payload, null, 2)
);

console.log(
  `Mock tax data exported to ${path.join(OUTPUT_DIR, FILE_NAME)}`
);
