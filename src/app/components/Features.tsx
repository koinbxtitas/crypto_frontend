'use client';

import { Bitcoin, DollarSign, PieChart, Smartphone, TrendingUp, Lock, Shield, Zap, Users, Headphones } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Bitcoin,
      title: "150+ Cryptocurrencies",
      description: "Trade Bitcoin, Ethereum, and all major altcoins with advanced charting tools and real-time market data."
    },
    {
      icon: DollarSign,
      title: "Lowest Fees",
      description: "Industry-leading fees starting from 0.1% with additional volume discounts and zero hidden charges."
    },
    {
      icon: PieChart,
      title: "Smart Portfolio",
      description: "AI-powered portfolio management with automated rebalancing and comprehensive risk analysis tools."
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Native iOS and Android apps with full trading capabilities, push notifications, and seamless sync."
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Professional trading tools with technical indicators, market insights, and real-time data feeds."
    },
    {
      icon: Lock,
      title: "Institutional Grade Security",
      description: "Cold storage, multi-sig wallets, comprehensive insurance coverage, and bank-grade encryption."
    }
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Professional trading tools designed for both beginners and experts. 
            Start with simple buys and graduate to advanced strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center mb-6 transition-all duration-300">
                    <IconComponent className="text-blue-600 group-hover:text-white w-7 h-7 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-24">
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join over 500,000 users who trust KoinBX for their cryptocurrency trading needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Create Free Account
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 hover:border-gray-400 px-8 py-4 rounded-lg font-semibold transition-colors">
                Explore Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
