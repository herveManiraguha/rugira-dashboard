import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-6 focus:left-6 bg-brand-red text-white px-3 py-2 rounded z-50 text-sm font-medium"
      data-testid="skip-link"
    >
      {children}
    </a>
  );
}