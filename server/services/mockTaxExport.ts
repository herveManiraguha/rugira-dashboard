import PDFDocument from "pdfkit";
import type { TaxComputationResult, CostBasisMethod } from "./mockTaxEngine";

export interface ExportOptions {
  costBasis: CostBasisMethod;
  baseCurrency: string;
  startDate?: string;
  endDate?: string;
  jurisdiction?: string;
}

export function buildTaxCsv(result: TaxComputationResult): string {
  const lines: string[] = [];
  const header = `"Generated with Rugira mock data","Generated At","${result.metadata.generatedAt}"`;
  lines.push(header);
  lines.push(
    `"Summary","Realized Gains (${result.metadata.baseCurrency})","${result.realizedGains
      .reduce((acc, gain) => acc + gain.gainLoss, 0)
      .toFixed(2)}","Income (${result.metadata.baseCurrency})","${result.income
      .reduce((acc, item) => acc + item.valueInBase, 0)
      .toFixed(2)}"`
  );
  lines.push("\nRealized Gains");
  lines.push("timestamp,venue,asset,quantity,proceeds,cost_basis,gain_loss");
  result.realizedGains.forEach((gain) => {
    lines.push(
      [
        gain.timestamp,
        gain.venue,
        gain.asset,
        gain.quantity,
        gain.proceeds.toFixed(2),
        gain.costBasis.toFixed(2),
        gain.gainLoss.toFixed(2),
      ].join(",")
    );
  });

  lines.push("\nIncome Events");
  lines.push("timestamp,venue,type,asset,amount,value_in_base");
  result.income.forEach((income) => {
    lines.push(
      [
        income.timestamp,
        income.venue,
        income.type,
        income.asset,
        income.amount,
        income.valueInBase.toFixed(2),
      ].join(",")
    );
  });

  lines.push("\nOpen Lots");
  lines.push(
    "acquired_at,venue,asset,original_quantity,remaining_quantity,acquisition_value"
  );
  result.lots.forEach((lot) => {
    lines.push(
      [
        lot.acquisitionTimestamp,
        lot.venue,
        lot.asset,
        lot.quantity,
        lot.remainingQuantity,
        lot.acquisitionValue.toFixed(2),
      ].join(",")
    );
  });

  return lines.join("\n");
}

export async function buildTaxPdf(
  result: TaxComputationResult,
  options: ExportOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Rugira Tax Report (Mock Data)")
      .moveDown(0.5);

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#d97706")
      .text("Generated with mock data. Figures are illustrative only.")
      .fillColor("#000000")
      .moveDown();

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Report Details")
      .moveDown(0.2);
    const addKV = (label: string, value: string | number) => {
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`${label}: `, { continued: true })
        .font("Helvetica")
        .text(String(value))
        .moveDown(0.1);
    };
    addKV("Generated At", result.metadata.generatedAt);
    addKV("Cost Basis", result.metadata.costBasis);
    addKV("Base Currency", result.metadata.baseCurrency);
    addKV("Jurisdiction", options.jurisdiction || "Mock");
    addKV("Transactions Evaluated", result.transactionsEvaluated);
    doc.moveDown();

    const realizedTotal = result.realizedGains.reduce(
      (acc, gain) => acc + gain.gainLoss,
      0
    );
    const incomeTotal = result.income.reduce(
      (acc, income) => acc + income.valueInBase,
      0
    );

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Summary")
      .moveDown(0.2);
    addKV(`Realized Gains (${result.metadata.baseCurrency})`, realizedTotal.toFixed(2));
    addKV(`Income (${result.metadata.baseCurrency})`, incomeTotal.toFixed(2));
    doc.moveDown();

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Top Realized Gains")
      .moveDown(0.2);
    doc.font("Helvetica");
    result.realizedGains.slice(0, 8).forEach((gain) => {
      doc
        .fontSize(11)
        .text(
          `${new Date(gain.timestamp).toLocaleString("en-CH")}: ${gain.asset} @ ${gain.venue} — ` +
            `${gain.gainLoss.toFixed(2)} ${result.metadata.baseCurrency}`
        )
        .moveDown(0.1);
    });
    doc.moveDown();

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Income Events")
      .moveDown(0.2);
    result.income.slice(0, 8).forEach((income) => {
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          `${income.type.replace("_", " ").toUpperCase()} | ${income.asset} | ${income.venue} | ` +
            `${income.valueInBase.toFixed(2)} ${result.metadata.baseCurrency}`
        )
        .moveDown(0.1);
    });
    doc.moveDown();

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Holdings Snapshot")
      .moveDown(0.2);
    result.holdings.slice(0, 10).forEach((holding) => {
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          `${holding.venue} | ${holding.asset} | ${holding.quantity.toFixed(6)} ` +
            `= ${holding.valueInBase.toFixed(2)} ${result.metadata.baseCurrency}`
        )
        .moveDown(0.1);
    });

    doc.end();
  });
}
