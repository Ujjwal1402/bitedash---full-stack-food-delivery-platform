import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-orange-50 text-orange-700 border-orange-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium border rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StarRating: React.FC<{ rating: number; count?: number; showNumber?: boolean }> = ({
  rating,
  count,
  showNumber = true,
}) => {
  return (
    <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">
      <span>★</span>
      {showNumber && <span>{Number(rating).toFixed(1)}</span>}
      {count !== undefined && <span className="text-emerald-100 font-normal">({count})</span>}
    </div>
  );
};
