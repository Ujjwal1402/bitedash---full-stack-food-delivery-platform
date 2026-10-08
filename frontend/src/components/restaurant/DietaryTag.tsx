import React from 'react';

export const DietaryTag: React.FC<{ isVeg: boolean; className?: string }> = ({
  isVeg,
  className = '',
}) => {
  return (
    <div
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 ${
        isVeg ? 'border-emerald-600' : 'border-rose-700'
      } ${className}`}
    >
      {isVeg ? (
        <span className="w-2 h-2 rounded-full bg-emerald-600" />
      ) : (
        <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-rose-700" />
      )}
    </div>
  );
};
