import React from 'react';
import { Restaurant } from '../../types/index.ts';
import { StarRating } from '../common/Badge.tsx';
import { Clock, Bike } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Banner Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.banner_image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Overlay gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Closed or Pure Veg tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {!restaurant.is_open && (
            <span className="bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
              Currently Closed
            </span>
          )}
          {restaurant.is_pure_veg && (
            <span className="bg-emerald-600/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              PURE VEG
            </span>
          )}
        </div>

        {/* Delivery Time & Fee badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{restaurant.delivery_time_min} mins</span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Bike className="w-3.5 h-3.5 text-orange-300" />
            <span>₹{restaurant.delivery_fee} Delivery</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <StarRating rating={restaurant.rating} count={restaurant.rating_count} />
          </div>

          <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">
            {restaurant.cuisines}
          </p>

          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {restaurant.address}, {restaurant.city}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>₹{restaurant.cost_for_two} for two</span>
          <span className="text-orange-600 font-bold group-hover:underline">View Menu →</span>
        </div>
      </div>
    </div>
  );
};
