import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runMockTaxEngine } from "../server/services/mockTaxEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "../public/samples");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const doc = new PDFDocument({
  size: "A4",
  margin: 50,
  info: {
    Title: "Rugira Tax Report Preview (Sample)",
    Author: "Rugira AG",
    Subject: "Illustrative tax report generated from mock data",
  },
});

const outputPath = path.join(
  OUTPUT_DIR,
  "rugira_tax_report_preview_sample.pdf"
);
doc.pipe(fs.createWriteStream(outputPath));

function addHeading(text) {
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text(text, { align: "left" })
    .moveDown(0.5);
}

function addSubHeading(text) {
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(text)
    .moveDown(0.25);
}

function addParagraph(text) {
  doc
    .fontSize(11)
    .font("Helvetica")
    .text(text, { align: "justify" })
    .moveDown(0.5);
}

function addKeyValue(label, value) {
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(`${label}: `, { continued: true })
    .font("Helvetica")
    .text(value)
    .moveDown(0.1);
}

function addTable(headers, rows) {
  const startX = doc.x;
  let y = doc.y;
  const columnWidth =
    (doc.page.width - doc.page.margins.left - doc.page.margins.right) /
    headers.length;

  doc.font("Helvetica-Bold");
  headers.forEach((header, index) => {
    doc.text(header, startX + index * columnWidth, y, {
      width: columnWidth,
      continued: false,
    });
  });

  doc.moveDown(0.5);
  y = doc.y;
  doc.font("Helvetica");
  rows.forEach((row) => {
    row.forEach((cell, index) => {
      doc.text(String(cell), startX + index * columnWidth, y, {
        width: columnWidth,
        continued: false,
      });
    });
    y += 16;
    doc.moveTo(startX, y - 4)
      .lineTo(
        startX + columnWidth * headers.length,
        y - 4
      )
      .strokeColor("#efefef")
      .stroke()
      .moveDown(0.2);
  });

  doc.moveDown();
}

const engine = runMockTaxEngine({
  costBasis: "FIFO",
  baseCurrency: "CHF",
});

addHeading("Rugira Tax Report Preview (Sample)");
addParagraph(
  "This illustrative report highlights how Rugira aggregates venue data, "
);

addSubHeading("Report Metadata");
addKeyValue("Generated at", engine.metadata.generatedAt);
addKeyValue("Cost basis", engine.metadata.costBasis);
addKeyValue(
  "Base currency",
  engine.metadata.baseCurrency.toUpperCase()
);
addKeyValue(
  "Transactions evaluated",
  engine.transactionsEvaluated.toLocaleString("en-CH")
);

doc.moveDown(0.5);
doc
  .fontSize(11)
  .font("Helvetica")
  .fillColor("#d97706")
  .text(
    "Generated with mock data for demonstration purposes only.",
    { align: "left" }
  )
  .fillColor("#000000")
  .moveDown();

addSubHeading("Realized Gains (Sample)");
addTable(
  ["Timestamp", "Venue", "Asset", "Quantity", "P&L (CHF)"],
  engine.realizedGains.slice(0, 6).map((gain) => [
    new Date(gain.timestamp).toLocaleString("en-CH"),
    gain.venue,
    gain.asset,
    gain.quantity.toFixed(4),
    gain.gainLoss.toFixed(2),
  ])
);

addSubHeading("Income Events (Sample)");
addTable(
  ["Timestamp", "Venue", "Type", "Asset", "Value (CHF)"],
  engine.income.slice(0, 6).map((income) => [
    new Date(income.timestamp).toLocaleString("en-CH"),
    income.venue,
    income.type.replace("_", " "),
    income.asset,
    income.valueInBase.toFixed(2),
  ])
);

addSubHeading("Holdings Snapshot");
addTable(
  ["Venue", "Asset", "Quantity", "Value (CHF)", "Captured"],
  engine.holdings.slice(0, 8).map((holding) => [
    holding.venue,
    holding.asset,
    holding.quantity.toFixed(6),
    holding.valueInBase.toFixed(2),
    new Date(holding.capturedAt).toLocaleDateString("en-CH"),
  ])
);

doc.moveDown();
addParagraph(
  "For compliance: the event log above is derived from the in-memory mock tax engine. "
);

doc.end();
console.log(`Sample tax PDF written to: ${outputPath}`);
