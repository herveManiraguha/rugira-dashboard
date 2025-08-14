import React from "react";

interface RugiraLogoProps {
  size?: number;
  className?: string;
}

export default function RugiraLogo({ size = 32, className = "" }: RugiraLogoProps) {
  return (
    <svg 
      viewBox="0 0 160 160" 
      xmlns="http://www.w3.org/2000/svg" 
      aria-label="Rugira logo"
      width={size}
      height={size}
      className={className}
    >
      {/* Define mask so cross punches a hole through red fill */}
      <defs>
        <mask id="crossMask">
          {/* everything in mask is white = visible */}
          <rect width="160" height="160" fill="white"/>
          {/* cross area painted black -> becomes transparent hole */}
          <rect x="65" y="50" width="30" height="60" fill="black"/>
          <rect x="50" y="65" width="60" height="30" fill="black"/>
        </mask>
      </defs>

      {/* Filled shield, masked to reveal cross in negative space */}
      <path 
        d="M80 10 L130 30 V90 a50 50 0 0 1 -100 0 V30 Z"
        fill="#E10600" 
        stroke="#E10600" 
        strokeWidth="8" 
        strokeLinejoin="round"
        mask="url(#crossMask)"
      />

      {/* Inyambo horns */}
      <path 
        d="M30 90 Q15 45 55 20" 
        fill="none" 
        stroke="#E10600" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
      <path 
        d="M130 90 Q145 45 105 20" 
        fill="none" 
        stroke="#E10600" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
    </svg>
  );
}