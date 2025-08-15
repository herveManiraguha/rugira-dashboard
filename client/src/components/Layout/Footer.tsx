import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>
            Simulated data. Not investment advice. Rugira has no custody of client funds.
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <a 
            href="https://rugira.ch/security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#E10600] flex items-center space-x-1"
            data-testid="link-security"
          >
            <span>Security</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          
          <a 
            href="https://rugira.ch/pricing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#E10600] flex items-center space-x-1"
            data-testid="link-pricing"
          >
            <span>Pricing</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          
          <a 
            href="https://rugira.ch/samples" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#E10600] flex items-center space-x-1"
            data-testid="link-samples"
          >
            <span>Samples</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          
          <a 
            href="https://status.rugira.ch" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#1B7A46] flex items-center space-x-1"
            data-testid="link-status"
          >
            <span>Status</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}