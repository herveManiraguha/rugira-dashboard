import React, { useState } from "react";

export default function EquityChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('1D');
  
  const periods = [
    { label: '1D', value: '1D' },
    { label: '7D', value: '7D' },
    { label: '30D', value: '30D' }
  ];

  return (
    <div className="card-rounded p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-900" data-testid="text-chart-title">
          Equity Curve
        </h3>
        <div className="flex space-x-2">
          {periods.map((period) => (
            <button 
              key={period.value}
              className={`text-xs px-3 py-1 rounded-rugira ${
                selectedPeriod === period.value 
                  ? 'bg-brand-red text-white' 
                  : 'text-text-500 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedPeriod(period.value)}
              data-testid={`button-period-${period.value}`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 bg-bg-1 rounded-rugira flex items-center justify-center text-text-500" data-testid="chart-placeholder">
        <div className="text-center">
          <i className="fas fa-chart-area text-4xl mb-2"></i>
          <p>Equity curve chart</p>
          <p className="text-xs">Chart.js integration needed</p>
        </div>
      </div>
    </div>
  );
}