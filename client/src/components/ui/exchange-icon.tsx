import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ExchangeIconProps {
  name: string;
  logo: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12'
};

const containerSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14'
};

export function ExchangeIcon({ name, logo, size = 'md', className = '' }: ExchangeIconProps) {
  return (
    <div className={`${containerSizes[size]} bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden ${className}`}>
      <img 
        src={logo} 
        alt={`${name} logo`}
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback to icon if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) {
            fallback.classList.remove('hidden');
          }
        }}
      />
      <TrendingUp className={`${sizeClasses[size]} text-gray-600 hidden`} />
    </div>
  );
}

// Popular exchange logos for reference
export const EXCHANGE_LOGOS = {
  binance: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg',
  coinbase: 'https://cryptologos.cc/logos/coinbase-coin-logo.svg',
  kraken: 'https://cryptologos.cc/logos/kraken-kraken-logo.svg',
  bybit: 'https://cryptologos.cc/logos/bybit-token-bit-logo.svg',
  okx: 'https://cryptologos.cc/logos/okex-okb-logo.svg',
  kucoin: 'https://cryptologos.cc/logos/kucoin-token-kcs-logo.svg',
  huobi: 'https://cryptologos.cc/logos/huobi-token-ht-logo.svg',
  gate: 'https://cryptologos.cc/logos/gate-gt-logo.svg',
  bitfinex: 'https://cryptologos.cc/logos/bitfinex-leo-logo.svg',
  gemini: 'https://cryptologos.cc/logos/gemini-dollar-gusd-logo.svg',
  ftx: 'https://cryptologos.cc/logos/ftx-token-ftt-logo.svg',
  crypto_com: 'https://cryptologos.cc/logos/crypto-com-cro-logo.svg',
  mexc: 'https://cryptologos.cc/logos/mexc-global-mexc-logo.svg',
  bitget: 'https://cryptologos.cc/logos/bitget-token-bgb-logo.svg'
} as const;