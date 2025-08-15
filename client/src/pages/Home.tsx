import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, TrendingUp, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import logoSvg from "@/assets/logo.svg";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation('/login?next=/overview');
  };

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-[#1B7A46]" />,
      title: 'Advanced Trading Bots',
      description: 'Automated trading strategies with real-time market analysis'
    },
    {
      icon: <Shield className="w-8 h-8 text-[#E10600]" />,
      title: 'Enterprise Security',
      description: 'Bank-grade security with comprehensive compliance monitoring'
    },
    {
      icon: <Zap className="w-8 h-8 text-[#1B7A46]" />,
      title: 'Real-time Performance',
      description: 'Live trading data and performance analytics dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={logoSvg} alt="Rugira" className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rugira</h1>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Trading Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://rugira.ch" 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Back to rugira.ch</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <Button onClick={handleLogin} className="bg-[#E10600] hover:bg-[#C10500] text-white">
                Log In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Professional Trading
            <span className="block text-[#E10600]">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Rugira's advanced trading dashboard provides institutional-grade bot management, 
            real-time monitoring, and comprehensive compliance tools for professional traders.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-[#E10600] hover:bg-[#C10500] text-white px-8 py-4 text-lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => window.open('https://rugira.ch', '_blank')}
              className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Trading?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join professional traders who trust Rugira for their automated trading strategies.
            Access advanced bots, real-time monitoring, and enterprise-grade security.
          </p>
          <Button 
            size="lg" 
            onClick={handleLogin}
            className="bg-[#1B7A46] hover:bg-[#166B3C] text-white px-12 py-4 text-lg"
          >
            Access Dashboard
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <a href="https://rugira.ch/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Privacy Policy
              </a>
              <a href="https://rugira.ch/terms" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Terms of Service
              </a>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-[#1B7A46] rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">App Status: Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}