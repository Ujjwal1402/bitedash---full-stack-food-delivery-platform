import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
};

export const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-4/5" />
        <div className="flex justify-between pt-2 border-t border-slate-100">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};
