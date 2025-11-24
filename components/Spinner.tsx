import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-slate-700 border-t-primary',
    secondary: 'border-slate-700 border-t-accent-ia',
    white: 'border-slate-700 border-t-white'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-4 
          rounded-full 
          animate-spin
        `}
        style={{
          borderTopWidth: '4px',
          borderRightWidth: '4px',
          borderBottomWidth: '4px',
          borderLeftWidth: '4px',
          borderTopStyle: 'solid',
          borderRightStyle: 'solid',
          borderBottomStyle: 'solid',
          borderLeftStyle: 'solid'
        }}
      >
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
};

export default Spinner;