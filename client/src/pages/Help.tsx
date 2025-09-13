import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Book, 
  Search, 
  MessageCircle, 
  FileText, 
  Video,
  ExternalLink,
  Mail,
  Phone,
  Clock
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: 'getting-started' | 'trading' | 'technical' | 'account';
}

interface GuideItem {
  title: string;
  description: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  type: 'article' | 'video' | 'tutorial';
}

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs: FAQItem[] = [
    {
      question: "What venues are supported?",
      answer: "Rugira supports two types of venues: Crypto Exchanges (Binance, Coinbase Pro, Kraken, Bybit, OKX, KuCoin) with direct API connectivity, and Tokenized Venues including BX Digital (via InCore participant), SDX (via member broker), Taurus TDX (OTF), and Issuer Platforms like Securitize and Franklin for RWA funds. Each venue has specific connectivity requirements and eligibility criteria.",
      category: 'getting-started'
    },
    {
      question: "How does drop-copy/T+0 reconciliation work?",
      answer: "Drop-copy provides real-time trade confirmations directly from the venue, enabling T+0 (same-day) reconciliation. For tokenized venues like BX Digital, Rugira receives execution reports via FIX drop-copy, automatically matching them against your orders to ensure all trades are properly accounted for within the same trading day. This provides immediate confirmation and reduces settlement risk.",
      category: 'technical'
    },
    {
      question: "What does 'Route via InCore (participant)' mean?",
      answer: "Orders are sent via InCore's participant connectivity to access tokenized venues. Rugira does not provide custody - your assets remain with your chosen custodian while we handle order routing and execution through InCore's infrastructure.",
      category: 'trading'
    },
    {
      question: "How do I create my first trading bot?",
      answer: "To create your first trading bot, navigate to the Bots section, click 'Create Bot', select a strategy template, configure your parameters, and connect to a venue. Start with paper trading to test your configuration before going live.",
      category: 'getting-started'
    },
    {
      question: "How do I interpret the performance metrics?",
      answer: "Key metrics include Total P&L (profit/loss), Sharpe Ratio (risk-adjusted returns), Maximum Drawdown (largest peak-to-trough decline), Win Rate (percentage of profitable trades), and Average Trade Duration.",
      category: 'trading'
    },
    {
      question: "My bot stopped working. What should I check?",
      answer: "First, check the Monitoring section for system alerts. Verify your exchange API keys are valid and have sufficient permissions. Check for compliance alerts that may have paused trading. Review the bot's logs for specific error messages.",
      category: 'technical'
    },
    {
      question: "How do I run a backtest?",
      answer: "Go to the Backtesting section, click 'New Backtest', select your strategy, choose a date range, set initial capital, and click 'Start Backtest'. Results will show performance metrics and equity curves for the selected period.",
      category: 'trading'
    }
  ];

  const guides: GuideItem[] = [
    {
      title: "Getting Started with Rugira",
      description: "Complete setup guide from account creation to your first profitable bot",
      category: 'beginner',
      estimatedTime: "15 minutes",
      type: 'tutorial'
    },
    {
      title: "Understanding Trading Strategies",
      description: "Deep dive into arbitrage, grid trading, and momentum strategies",
      category: 'intermediate',
      estimatedTime: "30 minutes",
      type: 'article'
    },
    {
      title: "Risk Management Best Practices",
      description: "How to set stop losses, position sizing, and portfolio management",
      category: 'intermediate',
      estimatedTime: "20 minutes",
      type: 'video'
    },
    {
      title: "Advanced Strategy Development",
      description: "Create custom strategies and optimize parameters",
      category: 'advanced',
      estimatedTime: "45 minutes",
      type: 'tutorial'
    },
    {
      title: "API Integration Guide",
      description: "Connect exchanges securely and troubleshoot common issues",
      category: 'intermediate',
      estimatedTime: "25 minutes",
      type: 'article'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryBadge = (category: string) => {
    const colors = {
      'getting-started': 'bg-green-100 text-green-800',
      'trading': 'bg-blue-100 text-blue-800',
      'technical': 'bg-red-100 text-red-800',
      'account': 'bg-purple-100 text-purple-800',
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[category as keyof typeof colors]}>{category}</Badge>;
  };

  const getTypeIcon = (type: GuideItem['type']) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'tutorial': return <Book className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600">Find answers, guides, and get support for your trading journey</p>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides & Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center space-x-2">
                        <span>{faq.question}</span>
                        {getCategoryBadge(faq.category)}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(guide.type)}
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      {getCategoryBadge(guide.category)}
                      <Badge variant="outline">{guide.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{guide.estimatedTime}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Live Chat Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Get instant help from our support team. Available 24/7 for urgent trading issues.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600">Support agents online</span>
                </div>
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Send us detailed questions or feedback. We typically respond within 2-4 hours.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>General Support: support@rugira.ch</div>
                  <div>Technical Issues: tech@rugira.ch</div>
                  <div>Business Inquiries: business@rugira.ch</div>
                </div>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Support Hours & Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Regular Support Hours</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Monday - Friday: 6:00 AM - 10:00 PM CET</div>
                    <div>Saturday - Sunday: 8:00 AM - 6:00 PM CET</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Emergency Trading Support</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>24/7 availability for critical trading issues</div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>+41 XX XXX XX XX (Emergency only)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}