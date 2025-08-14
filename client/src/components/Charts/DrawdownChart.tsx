import React from "react";

export default function DrawdownChart() {
  const maxDrawdown = -2.1;

  return (
    <div className="card-rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-900" data-testid="text-chart-title">
          Drawdown Analysis
        </h3>
        <span className="text-sm text-text-500" data-testid="text-max-drawdown">
          Max: {maxDrawdown}%
        </span>
      </div>
      <div className="h-64 bg-bg-1 rounded-rugira flex items-center justify-center text-text-500" data-testid="chart-placeholder">
        <div className="text-center">
          <i className="fas fa-chart-line text-4xl mb-2"></i>
          <p>Drawdown chart</p>
          <p className="text-xs">Chart.js integration needed</p>
        </div>
      </div>
    </div>
  );
}