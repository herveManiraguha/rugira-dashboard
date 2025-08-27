import React from 'react';

interface OctagonXProps {
  className?: string;
  size?: number;
}

export const OctagonX: React.FC<OctagonXProps> = ({ className, size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Octagon outline */}
      <path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z" />
      {/* X inside */}
      <path d="M15 9l-6 6" />
      <path d="M9 9l6 6" />
    </svg>
  );
};

export default OctagonX;