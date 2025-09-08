import React from 'react';
import { TrendingUp } from 'lucide-react';

// Import local exchange logos that we have successfully downloaded
import binanceLogo from '@/assets/exchanges/binance.svg';
import coinbaseLogo from '@/assets/exchanges/coinbase.svg';
import kucoinLogo from '@/assets/exchanges/kucoin.svg';
import genericLogo from '@/assets/exchanges/generic.svg';

interface ExchangeIconProps {
  name: string;
  logo?: string;
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

// Map of exchange names to local logo imports
// Using only successfully downloaded logos, others use generic fallback
export const EXCHANGE_LOGOS: Record<string, string> = {
  binance: binanceLogo,
  coinbase: coinbaseLogo,
  kucoin: kucoinLogo,
  // All other exchanges use the generic logo
  kraken: genericLogo,
  bybit: genericLogo,
  okx: genericLogo,
  huobi: genericLogo,
  gate: genericLogo,
  bitfinex: genericLogo,
  gemini: genericLogo,
  crypto_com: genericLogo,
  bitget: genericLogo,
  mexc: genericLogo,
  whitebit: genericLogo,
  coinex: genericLogo,
  phemex: genericLogo,
  deribit: genericLogo,
  bittrex: genericLogo,
  poloniex: genericLogo,
  bitmex: genericLogo,
  upbit: genericLogo,
  bithumb: genericLogo,
  bitflyer: genericLogo,
  lbank: genericLogo,
  probit: genericLogo,
  bitstamp: genericLogo,
  // Tokenized venues
  'bx_digital': genericLogo,
  'sdx': genericLogo,
  'taurus': genericLogo,
  'securitize': genericLogo,
  'franklin': genericLogo
};

// Fallback to generic logo for any exchange not in the map
export const EXCHANGE_LOGOS_FALLBACK = genericLogo;

export function ExchangeIcon({ name, logo, size = 'md', className = '' }: ExchangeIconProps) {
  // Normalize exchange name to match our keys
  const exchangeKey = name.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/\./g, '')
    .replace(/-/g, '_');
  
  // Try to use the provided logo first, then fall back to our local assets
  const logoSrc = logo || 
                  EXCHANGE_LOGOS[exchangeKey] || 
                  genericLogo;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    // If the logo fails to load, use the generic fallback
    if (target.src !== genericLogo) {
      target.src = genericLogo;
    } else {
      // If even the generic logo fails, hide image and show icon
      target.style.display = 'none';
      const fallback = target.nextElementSibling as HTMLElement;
      if (fallback) {
        fallback.classList.remove('hidden');
      }
    }
  };

  return (
    <div className={`${containerSizes[size]} bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden ${className}`}>
      <img 
        src={logoSrc} 
        alt={`${name} logo`}
        className={`${sizeClasses[size]} object-contain`}
        onError={handleImageError}
      />
      <TrendingUp className={`${sizeClasses[size]} text-gray-600 hidden`} />
    </div>
  );
}