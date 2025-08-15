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
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const currentSrc = target.src;
    
    // Try fallback URL if primary fails
    const exchangeKey = name.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '');
    const fallbackUrl = EXCHANGE_LOGOS_FALLBACK[exchangeKey as keyof typeof EXCHANGE_LOGOS_FALLBACK];
    
    if (fallbackUrl && currentSrc !== fallbackUrl) {
      target.src = fallbackUrl;
    } else {
      // Hide image and show fallback icon
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
        src={logo} 
        alt={`${name} logo`}
        className={`${sizeClasses[size]} object-contain`}
        onError={handleImageError}
      />
      <TrendingUp className={`${sizeClasses[size]} text-gray-600 hidden`} />
    </div>
  );
}

// Official exchange logos from authenticated sources with fallbacks
export const EXCHANGE_LOGOS = {
  binance: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/binance-logo-icon.svg',
  coinbase: 'https://brandfetch.com/api/v2/assets/id6U73G7r1/v1/logomark/size/512',
  kraken: 'https://logotyp.us/files/kraken.svg',
  bybit: 'https://altcoinsbox.com/wp-content/uploads/2023/01/bybit-logo.svg',
  okx: 'https://altcoinsbox.com/wp-content/uploads/2023/01/okx-logo.svg',
  kucoin: 'https://altcoinsbox.com/wp-content/uploads/2023/01/kucoin-logo.svg',
  huobi: 'https://altcoinsbox.com/wp-content/uploads/2023/01/huobi-logo.svg',
  gate: 'https://altcoinsbox.com/wp-content/uploads/2023/01/gate.io-logo.svg',
  bitfinex: 'https://altcoinsbox.com/wp-content/uploads/2023/01/bitfinex-logo.svg',
  gemini: 'https://altcoinsbox.com/wp-content/uploads/2023/01/gemini-logo.svg',
  ftx: 'https://cryptologos.cc/logos/ftx-token-ftt-logo.svg',
  crypto_com: 'https://cryptologos.cc/logos/crypto-com-cro-logo.svg',
  mexc: 'https://cryptologos.cc/logos/mexc-global-mexc-logo.svg',
  bitget: 'https://cryptologos.cc/logos/bitget-token-bgb-logo.svg'
} as const;

// Fallback logos for better reliability
export const EXCHANGE_LOGOS_FALLBACK = {
  binance: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg',
  coinbase: 'https://cryptologos.cc/logos/coinbase-coin-logo.svg',
  kraken: 'https://cryptologos.cc/logos/kraken-kraken-logo.svg',
  bybit: 'https://cryptologos.cc/logos/bybit-token-bit-logo.svg',
  okx: 'https://cryptologos.cc/logos/okex-okb-logo.svg',
  kucoin: 'https://cryptologos.cc/logos/kucoin-token-kcs-logo.svg',
  huobi: 'https://cryptologos.cc/logos/huobi-token-ht-logo.svg',
  gate: 'https://cryptologos.cc/logos/gate-gt-logo.svg',
  bitfinex: 'https://cryptologos.cc/logos/bitfinex-leo-logo.svg',
  gemini: 'https://cryptologos.cc/logos/gemini-dollar-gusd-logo.svg'
} as const;