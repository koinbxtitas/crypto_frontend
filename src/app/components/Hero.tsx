'use client';

import { Bitcoin, TrendingUp, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CryptoData {
  name: string;
  symbol: string;
  icon: string;
  price: string;
}

interface PriceMap {
  [key: string]: string;
}

export default function Hero() {
  const [currentPrices, setCurrentPrices] = useState<PriceMap>({});

  const cryptoData: CryptoData[] = [
    { name: 'Neur Network', symbol: 'CNF', icon: '🔗', price: '$2.45' },
    { name: 'Amyl', symbol: 'AMI', icon: '🌟', price: '$0.89' },
    { name: 'Bitcoin Cash', symbol: 'BCH', icon: '💰', price: '$245.67' },
    { name: 'Tether', symbol: 'USDT', icon: '💵', price: '$1.00' },
    { name: 'Bitcoin', symbol: 'BTC', icon: '₿', price: '$43,250' },
    { name: 'Happy birthday coin', symbol: 'HBDC', icon: '🎂', price: '$0.12' },
    { name: 'Pollux Coin', symbol: 'POX', icon: '⭐', price: '$1.56' },
    { name: 'Zillion', symbol: 'ZIL', icon: '💎', price: '$0.034' },
  ];

  const cryptoData2: CryptoData[] = [
    { name: 'Haven', symbol: 'XHV', icon: '🏠', price: '$4.23' },
    { name: 'Schilling-Coin', symbol: 'SCH', icon: '🪙', price: '$0.67' },
    { name: 'SafePal', symbol: 'SFP', icon: '🔐', price: '$0.85' },
    { name: 'Chainlink Coin', symbol: 'LINKC', icon: '🔗', price: '$14.82' },
    { name: 'Yoc App', symbol: 'YOCAPP', icon: '📱', price: '$0.23' },
    { name: 'Toncoin', symbol: 'TON', icon: '💙', price: '$2.18' },
    { name: 'Royalcoin', symbol: 'ROLC', icon: '👑', price: '$5.94' },
  ];

  const features = [
    { icon: Shield, text: 'FIU Registered & Compliant' },
    { icon: Zap, text: 'Instant Transactions' },
    { icon: TrendingUp, text: 'Real-time Market Data' }
  ];

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrices((prev: PriceMap) => {
        const newPrices: PriceMap = { ...prev };
        [...cryptoData, ...cryptoData2].forEach((crypto: CryptoData) => {
          if (Math.random() > 0.7) { // 30% chance to update each price
            const currentPrice = parseFloat(crypto.price.replace('$', '').replace(',', ''));
            const change = (Math.random() - 0.5) * 0.02; // ±1% change
            const newPrice = currentPrice * (1 + change);
            newPrices[crypto.symbol] = `$${newPrice.toLocaleString(undefined, {
              minimumFractionDigits: crypto.price.includes('.') ? (crypto.price.split('.')[1]?.length || 2) : 0,
              maximumFractionDigits: crypto.price.includes('.') ? (crypto.price.split('.')[1]?.length || 2) : 0
            })}`;
          }
        });
        return newPrices;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getPriceColor = (symbol: string, originalPrice: string): string => {
    const currentPrice = currentPrices[symbol];
    if (!currentPrice) return 'text-green-500';
    
    const original = parseFloat(originalPrice.replace('$', '').replace(',', ''));
    const current = parseFloat(currentPrice.replace('$', '').replace(',', ''));
    
    if (current > original) return 'text-green-500';
    if (current < original) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 pt-16 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
        {/* Trust Indicators */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm">
                <IconComponent size={16} className="text-blue-600" />
                <span className="hidden sm:inline">{feature.text}</span>
              </div>
            );
          })}
        </div>

        {/* Main Heading with enhanced typography */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Your Gateway</span>
          <span className="text-gray-900"> to Seamless</span>
          <br />
          <span className="text-gray-900">Crypto Trading</span>
        </h1>

        {/* Enhanced Subtitle */}
        <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
          Join over <span className="font-semibold text-blue-600">2M+</span> traders on India's most trusted crypto platform.
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          We are <a href="#" className="text-blue-600 underline hover:text-blue-700 transition-colors">FIU registered & 100% compliant</a> with Indian regulations.
        </p>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Start Trading Now
          </button>
          <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 border border-gray-200 transition-colors">
            View Demo
          </button>
        </div>

        {/* Enhanced Floating Crypto Icons - Top Row */}
        <div className="relative mb-8">
          <div className="flex justify-center items-center space-x-4 overflow-hidden">
            <div className="animate-scroll flex space-x-6">
              {[...cryptoData, ...cryptoData].map((crypto, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg border border-gray-100 whitespace-nowrap hover:shadow-xl transition-all duration-200 hover:scale-105 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">{crypto.icon}</span>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 text-sm">{crypto.name}</span>
                      <span className="text-gray-400 text-xs">{crypto.symbol}</span>
                    </div>
                    <span className={`text-xs font-medium ${getPriceColor(crypto.symbol, crypto.price)}`}>
                      {currentPrices[crypto.symbol] || crypto.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Floating Crypto Icons - Bottom Row */}
        <div className="relative">
          <div className="flex justify-center items-center space-x-4 overflow-hidden">
            <div className="animate-scroll-reverse flex space-x-6">
              {[...cryptoData2, ...cryptoData2].map((crypto, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg border border-gray-100 whitespace-nowrap hover:shadow-xl transition-all duration-200 hover:scale-105 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">{crypto.icon}</span>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 text-sm">{crypto.name}</span>
                      <span className="text-gray-400 text-xs">{crypto.symbol}</span>
                    </div>
                    <span className={`text-xs font-medium ${getPriceColor(crypto.symbol, crypto.price)}`}>
                      {currentPrices[crypto.symbol] || crypto.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">₹50,000Cr+</div>
            <div className="text-gray-600">Trading Volume</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">2M+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">350+</div>
            <div className="text-gray-600">Cryptocurrencies</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 35s linear infinite;
        }
      `}</style>
    </div>
  );
}