import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, Home, Bot, TrendingUp, Building2, Shield, FileText, FlaskConical, Activity, Settings, HelpCircle, Command } from "lucide-react";
import { useBotsStore } from "../../stores";
import { useDemoMode } from "@/contexts/DemoContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();
  const { activeBotCount } = useBotsStore();
  const { isDemoMode } = useDemoMode();
  
  const isActive = (path: string) => {
    return location === path;
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Overview' },
    { path: '/venues', icon: Building2, label: 'Venues' },
    { path: '/strategies', icon: TrendingUp, label: 'Strategies' },
    { path: '/backtesting', icon: FlaskConical, label: 'Backtesting' },
    { path: '/bots', icon: Bot, label: 'Automations', badge: activeBotCount },
    ...(isDemoMode ? [{ path: '/console', icon: Command, label: 'Console (Pilot-Assist)' }] : []),
    { path: '/monitoring', icon: Activity, label: 'Monitoring' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/compliance', icon: Shield, label: 'Compliance', badge: 2 },
    { path: '/admin', icon: Settings, label: 'Admin' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          data-testid="mobile-menu-backdrop"
        />
      )}
      
      {/* Slide-out Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        data-testid="mobile-menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Rugira</h2>
              <p className="text-xs text-gray-500">Trading Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="button-close-mobile-menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-full pb-20">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(item.path) 
                        ? 'bg-brand-red text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        isActive(item.path) 
                          ? 'bg-white text-brand-red' 
                          : 'bg-brand-red text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
