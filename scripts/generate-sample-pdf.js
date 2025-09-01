import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the PDF document
const doc = new PDFDocument({
  size: 'A4',
  margin: 50,
  info: {
    Title: 'Rugira Monthly Performance Report (Sample)',
    Author: 'Rugira AG',
    Subject: 'Monthly Performance Report - Simulated Data',
    Keywords: 'trading, performance, report, sample'
  }
});

// Pipe to file
const outputPath = path.join(__dirname, '../public/samples/rugira_monthly_performance_report_sample.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// Helper functions
function addTitle(text, size = 24) {
  doc.fontSize(size)
     .font('Helvetica-Bold')
     .fillColor('#2c3e50')
     .text(text, { align: 'center' });
  doc.moveDown();
}

function addSubtitle(text, size = 16) {
  doc.fontSize(size)
     .font('Helvetica-Bold')
     .fillColor('#34495e')
     .text(text);
  doc.moveDown(0.5);
}

function addParagraph(text, size = 11) {
  doc.fontSize(size)
     .font('Helvetica')
     .fillColor('#000000')
     .text(text, { align: 'justify' });
  doc.moveDown();
}

function addBullet(text) {
  const indent = 30;
  doc.fontSize(11)
     .font('Helvetica')
     .fillColor('#000000')
     .text('• ', doc.x, doc.y, { continued: true })
     .text(text, doc.x + 10, doc.y);
  doc.moveDown(0.5);
}

function addKeyValue(key, value, valueColor = '#000000') {
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .fillColor('#34495e')
     .text(key + ': ', { continued: true })
     .font('Helvetica')
     .fillColor(valueColor)
     .text(value);
  doc.moveDown(0.5);
}

function addTable(headers, rows) {
  const startX = 50;
  let currentY = doc.y;
  const columnWidth = 100;
  
  // Headers
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#34495e');
  headers.forEach((header, i) => {
    doc.text(header, startX + (i * columnWidth), currentY, { width: columnWidth - 5 });
  });
  
  currentY += 20;
  doc.moveTo(startX, currentY).lineTo(startX + (headers.length * columnWidth), currentY).stroke();
  currentY += 5;
  
  // Rows
  doc.fontSize(10).font('Helvetica').fillColor('#000000');
  rows.forEach(row => {
    row.forEach((cell, i) => {
      const color = cell.toString().startsWith('-') ? '#dc3545' : 
                   cell.toString().startsWith('+') ? '#28a745' : '#000000';
      doc.fillColor(color);
      doc.text(cell.toString(), startX + (i * columnWidth), currentY, { width: columnWidth - 5 });
    });
    currentY += 18;
  });
  
  doc.y = currentY + 10;
}

function addPageBreak() {
  doc.addPage();
}

function addFooter(text) {
  doc.fontSize(9)
     .font('Helvetica')
     .fillColor('#7f8c8d')
     .text(text, 50, doc.page.height - 50, { align: 'center' });
}

// Get current date
const currentDate = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const currentMonth = monthNames[currentDate.getMonth()];
const currentYear = currentDate.getFullYear();

// Cover Page
addTitle('Rugira', 36);
addTitle('Monthly Performance Report', 28);
doc.moveDown(2);
addTitle('(Sample / Simulated Data)', 18);
doc.moveDown(3);

doc.fontSize(14)
   .font('Helvetica')
   .fillColor('#34495e')
   .text(`Period: Last 12 months ending ${currentMonth} ${currentYear}`, { align: 'center' });
doc.moveDown(2);

doc.fontSize(12)
   .font('Helvetica')
   .fillColor('#7f8c8d')
   .text('Rugira AG · Zug, Switzerland', { align: 'center' });

addFooter('Simulated data for demonstration purposes only');

// Executive Summary
addPageBreak();
addTitle('Executive Summary', 20);

addKeyValue('Starting Equity', 'CHF 100,000.00');
addKeyValue('Ending Equity', 'CHF 105,247.32', '#28a745');
addKeyValue('Net Return', '+5.2% (vs last month +2.8%)', '#28a745');
addKeyValue('Volatility (ann.)', '7.9%');
addKeyValue('Sharpe Ratio', '1.42');
addKeyValue('Max Drawdown', '-8.3%', '#dc3545');
doc.moveDown();

addKeyValue('Total Trades', '247');
addKeyValue('Active Strategies', '3');
addKeyValue('Connected Venues', '5');
addKeyValue("Today's P&L", 'USD 1,247.83', '#28a745');
doc.moveDown();

doc.fontSize(10)
   .font('Helvetica')
   .fillColor('#7f8c8d')
   .text('Note: Simulated data for demonstration; non-custodial software; no investment advice. Mixed currencies shown (USD/CHF).', 
         { align: 'left' });

addFooter('Simulated data for demonstration purposes only');

// Performance Overview
addPageBreak();
addTitle('Performance Overview', 20);

addSubtitle('Monthly Returns (Last 12 Months)');
const monthlyReturns = [
  ['Month', 'Return %', 'Cumulative %'],
  ['Feb 2024', '+0.8%', '+0.8%'],
  ['Mar 2024', '-1.2%', '-0.4%'],
  ['Apr 2024', '+1.5%', '+1.1%'],
  ['May 2024', '+0.3%', '+1.4%'],
  ['Jun 2024', '+2.1%', '+3.5%'],
  ['Jul 2024', '-0.5%', '+3.0%'],
  ['Aug 2024', '+0.9%', '+3.9%'],
  ['Sep 2024', '+1.3%', '+5.2%'],
  ['Oct 2024', '-0.8%', '+4.4%'],
  ['Nov 2024', '+0.6%', '+5.0%'],
  ['Dec 2024', '+0.4%', '+5.4%'],
  ['Jan 2025', '-0.2%', '+5.2%']
];
addTable(monthlyReturns[0], monthlyReturns.slice(1));

doc.moveDown();
addParagraph('The portfolio showed consistent performance over the past 12 months, with positive returns in 8 out of 12 months. The strongest performance was recorded in June 2024 (+2.1%), while the largest monthly loss was in March 2024 (-1.2%).');

addFooter('Simulated data for demonstration purposes only');

// Risk Metrics & Limits
addPageBreak();
addTitle('Risk Metrics & Limits', 20);

addSubtitle('Current Risk Metrics');
addKeyValue('Daily VaR (95%)', 'CHF 1,234.56');
addKeyValue('Realized Volatility', '7.9% annualized');
addKeyValue('Max Single-Day Loss', 'CHF -2,156.78', '#dc3545');
addKeyValue('Average Position Size', 'CHF 15,234.00');
doc.moveDown();

addSubtitle('Risk Guardrails Configured');
addBullet('Stop-Loss/Take-Profit: ENABLED');
addBullet('Daily Drawdown Cap: ENABLED (Max 3%)');
addBullet('Kill-Switch: ENABLED');
addBullet('Position Limits: ACTIVE');
doc.moveDown();

addSubtitle('Risk Limit Breaches');
addParagraph('0 risk-limit breaches recorded in the reporting period. All automated risk controls functioned as configured.');

addFooter('Simulated data for demonstration purposes only');

// Strategy & Venue Breakdowns
addPageBreak();
addTitle('Performance Breakdowns', 20);

addSubtitle('By Strategy');
const strategyData = [
  ['Strategy', 'P&L', 'Hit Ratio', 'Trades'],
  ['Grid Trading', '+2.1%', '62%', '98'],
  ['Momentum', '+3.4%', '58%', '87'],
  ['Arbitrage', '-0.3%', '71%', '62']
];
addTable(strategyData[0], strategyData.slice(1));

doc.moveDown();
addSubtitle('By Venue');
const venueData = [
  ['Venue', 'Volume %', 'Fees Paid', 'Avg Slippage'],
  ['Binance', '52%', 'CHF 234.56', '2.1 bps'],
  ['Coinbase Pro', '28%', 'CHF 156.78', '1.8 bps'],
  ['OKX', '20%', 'CHF 98.45', '2.5 bps']
];
addTable(venueData[0], venueData.slice(1));

addFooter('Simulated data for demonstration purposes only');

// Trading & Fees Summary
addPageBreak();
addTitle('Trading & Fees Summary', 20);

addSubtitle('Order Statistics');
addKeyValue('Total Orders', '524');
addKeyValue('Fill Ratio', '89.3%');
addKeyValue('Maker Orders', '67%');
addKeyValue('Taker Orders', '33%');
doc.moveDown();

addSubtitle('Fee Analysis');
addKeyValue('Total Fees Paid', 'CHF 489.79');
addKeyValue('Effective Fee Rate', '4.2 bps');
addKeyValue('Slippage (avg)', '2.1 bps');
addKeyValue('Implementation Shortfall', '6.3 bps');

addFooter('Simulated data for demonstration purposes only');

// Compliance & Audit
addPageBreak();
addTitle('Compliance & Audit', 20);

addSubtitle('Data Integrity');
addParagraph('All trading actions are tenant-scoped, time-stamped with millisecond precision, and fully exportable. See the accompanying Audit Extract sample CSV for detailed transaction-level data.');
doc.moveDown();

addSubtitle('Data Lineage');
addBullet('All timestamps in UTC');
addBullet('Hash-chain verification implemented');
addBullet('Daily root hashes computed');
addBullet('Full audit trail maintained');
doc.moveDown();

addSubtitle('Compliance Status');
addParagraph('No compliance violations detected during the reporting period. All KYT (Know Your Transaction) checks passed successfully.');

addFooter('Simulated data for demonstration purposes only');

// Disclaimers & Methodology
addPageBreak();
addTitle('Disclaimers & Methodology', 20);

addSubtitle('Important Disclaimers');
addBullet('This report contains SIMULATED DATA for demonstration purposes only');
addBullet('Not financial advice or investment recommendations');
addBullet('Non-custodial execution - user maintains full control');
addBullet('Past performance does not indicate future results');
addBullet('All figures are indicative only');
doc.moveDown();

addSubtitle('Methodology Notes');
addBullet('Returns calculated using time-weighted methodology');
addBullet('FX conversions: Values shown in USD/CHF using single EOD FX rate');
addBullet('Fees include trading fees, not platform subscription costs');
addBullet('Slippage measured as difference between decision price and execution price');
doc.moveDown();

addSubtitle('Data Quality');
addParagraph('This sample report demonstrates the format and content of actual performance reports. In production, all data would be sourced from authenticated trading venues and verified through our audit system.');

addFooter('Simulated data for demonstration purposes only - © 2025 Rugira AG');

// Finalize the PDF
doc.end();

console.log('PDF generated successfully at:', outputPath);