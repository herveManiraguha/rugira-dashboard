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

// Official exchange logos from multiple reliable CDN sources
export const EXCHANGE_LOGOS = {
  binance: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/binance.svg',
  coinbase: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/coinbase.svg',
  kraken: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/kraken.svg',
  bybit: 'https://assets.coingecko.com/markets/images/698/small/bybit_spot.png',
  okx: 'https://assets.coingecko.com/markets/images/96/small/WeChat_Image_20220117220452.png',
  kucoin: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/kucoin.svg',
  huobi: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/huobi.svg',
  gate: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/gate.svg',
  bitfinex: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/bitfinex.svg',
  gemini: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/gemini.svg',
  mexc: 'https://assets.coingecko.com/markets/images/409/small/MEXC.png',
  crypto_com: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/crypto-com.svg',
  bitget: 'https://assets.coingecko.com/markets/images/540/small/Bitget.png',
  whitebit: 'https://assets.coingecko.com/markets/images/418/small/white_bit.png',
  coinex: 'https://assets.coingecko.com/markets/images/53/small/coinex.png',
  phemex: 'https://assets.coingecko.com/markets/images/331/small/Phemex_logo_circle.png',
  deribit: 'https://assets.coingecko.com/markets/images/85/small/deribit.png',
  bittrex: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/bittrex.svg',
  poloniex: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/poloniex.svg',
  bitmex: 'https://assets.coingecko.com/markets/images/378/small/BitMEX.png',
  upbit: 'https://assets.coingecko.com/markets/images/117/small/upbit.png',
  bithumb: 'https://assets.coingecko.com/markets/images/6/small/bithumb_BI.png',
  bitflyer: 'https://assets.coingecko.com/markets/images/5/small/bitflyer.jpg',
  lbank: 'https://assets.coingecko.com/markets/images/118/small/LBank_logo.png',
  probit: 'https://assets.coingecko.com/markets/images/132/small/logo_1_47668.png',
  bitstamp: 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptofonts@1.0.0/SVG/bitstamp.svg'
} as const;

// Fallback logos - alternative CDN sources
export const EXCHANGE_LOGOS_FALLBACK = {
  binance: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
  coinbase: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/89.png',
  kraken: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/24.png',
  bybit: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/521.png',
  okx: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/294.png',
  kucoin: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/311.png',
  huobi: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/102.png',
  gate: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/302.png',
  bitfinex: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/37.png',
  gemini: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/151.png',
  mexc: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/518.png',
  crypto_com: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/558.png',
  bitget: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/520.png',
  whitebit: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/524.png',
  coinex: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/137.png',
  phemex: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/441.png',
  deribit: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/179.png',
  bittrex: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/22.png',
  poloniex: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/16.png',
  bitmex: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/157.png',
  upbit: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/351.png',
  bithumb: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/200.png',
  bitflyer: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/13.png',
  lbank: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/383.png',
  probit: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/376.png',
  bitstamp: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/70.png'
} as const;