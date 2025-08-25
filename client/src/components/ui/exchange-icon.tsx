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

// Official exchange logos from cryptologos.cc - reliable source
export const EXCHANGE_LOGOS = {
  binance: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg',
  coinbase: 'https://cryptologos.cc/logos/coinbase-coin-logo.svg',
  kraken: 'https://cryptologos.cc/logos/kraken-logo.svg',
  bybit: 'https://cryptologos.cc/logos/bybit-logo.svg',
  okx: 'https://cryptologos.cc/logos/okx-logo.svg',
  kucoin: 'https://cryptologos.cc/logos/kucoin-shares-kcs-logo.svg',
  huobi: 'https://cryptologos.cc/logos/huobi-token-ht-logo.svg',
  gate: 'https://cryptologos.cc/logos/gateio-logo.svg',
  bitfinex: 'https://cryptologos.cc/logos/bitfinex-logo.svg',
  gemini: 'https://cryptologos.cc/logos/gemini-dollar-gusd-logo.svg',
  mexc: 'https://cryptologos.cc/logos/mexc-logo.svg',
  crypto_com: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.svg',
  bitget: 'https://cryptologos.cc/logos/bitget-token-bgb-logo.svg',
  whitebit: 'https://cryptologos.cc/logos/whitebit-logo.svg',
  coinex: 'https://cryptologos.cc/logos/coinex-token-cet-logo.svg',
  phemex: 'https://cryptologos.cc/logos/phemex-token-pt-logo.svg',
  deribit: 'https://cryptologos.cc/logos/deribit-logo.svg',
  bittrex: 'https://cryptologos.cc/logos/bittrex-logo.svg',
  poloniex: 'https://cryptologos.cc/logos/poloniex-logo.svg',
  bitmex: 'https://cryptologos.cc/logos/bitmex-logo.svg',
  upbit: 'https://cryptologos.cc/logos/upbit-logo.svg',
  bithumb: 'https://cryptologos.cc/logos/bithumb-logo.svg',
  bitflyer: 'https://cryptologos.cc/logos/bitflyer-logo.svg',
  lbank: 'https://cryptologos.cc/logos/lbank-logo.svg',
  probit: 'https://cryptologos.cc/logos/probit-logo.svg',
  bitstamp: 'https://cryptologos.cc/logos/bitstamp-logo.svg'
} as const;

// Fallback logos - same as primary for consistency
export const EXCHANGE_LOGOS_FALLBACK = {
  binance: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg',
  coinbase: 'https://cryptologos.cc/logos/coinbase-coin-logo.svg',
  kraken: 'https://cryptologos.cc/logos/kraken-logo.svg',
  bybit: 'https://cryptologos.cc/logos/bybit-logo.svg',
  okx: 'https://cryptologos.cc/logos/okx-logo.svg',
  kucoin: 'https://cryptologos.cc/logos/kucoin-shares-kcs-logo.svg',
  huobi: 'https://cryptologos.cc/logos/huobi-token-ht-logo.svg',
  gate: 'https://cryptologos.cc/logos/gateio-logo.svg',
  bitfinex: 'https://cryptologos.cc/logos/bitfinex-logo.svg',
  gemini: 'https://cryptologos.cc/logos/gemini-dollar-gusd-logo.svg',
  mexc: 'https://cryptologos.cc/logos/mexc-logo.svg',
  crypto_com: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.svg',
  bitget: 'https://cryptologos.cc/logos/bitget-token-bgb-logo.svg',
  whitebit: 'https://cryptologos.cc/logos/whitebit-logo.svg',
  coinex: 'https://cryptologos.cc/logos/coinex-token-cet-logo.svg',
  phemex: 'https://cryptologos.cc/logos/phemex-token-pt-logo.svg',
  deribit: 'https://cryptologos.cc/logos/deribit-logo.svg',
  bittrex: 'https://cryptologos.cc/logos/bittrex-logo.svg',
  poloniex: 'https://cryptologos.cc/logos/poloniex-logo.svg',
  bitmex: 'https://cryptologos.cc/logos/bitmex-logo.svg',
  upbit: 'https://cryptologos.cc/logos/upbit-logo.svg',
  bithumb: 'https://cryptologos.cc/logos/bithumb-logo.svg',
  bitflyer: 'https://cryptologos.cc/logos/bitflyer-logo.svg',
  lbank: 'https://cryptologos.cc/logos/lbank-logo.svg',
  probit: 'https://cryptologos.cc/logos/probit-logo.svg',
  bitstamp: 'https://cryptologos.cc/logos/bitstamp-logo.svg'
} as const;