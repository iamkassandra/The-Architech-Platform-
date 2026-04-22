
import React from 'react';

interface BrandIconProps {
  className?: string;
}

const BrandIcon: React.FC<BrandIconProps> = ({ 
  className = "w-8 h-8"
}) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="ghost-mask">
          <rect width="100" height="100" fill="white" />
          <circle cx="38" cy="48" r="8" fill="black" />
          <circle cx="62" cy="48" r="8" fill="black" />
        </mask>
      </defs>
      
      {/* Background Red for Eyes */}
      <circle cx="38" cy="48" r="8" fill="#630A1F" style={{ fill: 'var(--color-red)' }} />
      <circle cx="62" cy="48" r="8" fill="#630A1F" style={{ fill: 'var(--color-red)' }} />

      {/* Ghost Body with Masked Eyes */}
      <path
        d="M20 45C20 28.4315 33.4315 15 50 15C66.5685 15 80 28.4315 80 45V75C80 80.5228 75.5228 85 70 85C64.4772 85 60 80.5228 55 75C50 69.4772 45 69.4772 40 75C35 80.5228 30.5228 85 25 85C19.4772 85 20 80.5228 20 75V45Z"
        fill="white"
        mask="url(#ghost-mask)"
      />
    </svg>
  );
};

export default BrandIcon;
