import React from 'react';

interface OctagonXProps {
  className?: string;
  size?: number;
  filled?: boolean;
}

export const OctagonX: React.FC<OctagonXProps> = ({ className, size = 24, filled = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Octagon outline */}
      <path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z" />
      {/* X inside - more prominent and centered */}
      <path d="M16 8l-8 8" strokeWidth={filled ? "3" : "2.5"} stroke={filled ? "white" : "currentColor"} />
      <path d="M8 8l8 8" strokeWidth={filled ? "3" : "2.5"} stroke={filled ? "white" : "currentColor"} />
    </svg>
  );
};

export default OctagonX;