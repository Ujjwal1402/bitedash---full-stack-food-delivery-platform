import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { MenuItem, Restaurant } from '../../types/index.ts';
import { Search, ArrowLeft } from 'lucide-react';
import { AiFoodSommelier } from '../../components/search/AiFoodSommelier.tsx';
import { MenuItemCard } from '../../components/restaurant/MenuItemCard.tsx';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard.tsx';

interface SearchPageProps {
  onBack: () => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onBack, onSelectRestaurant }) => {
  const [query, setQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      setRestaurants([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const itemRes: any = await api.get(`/menu/search?q=${encodeURIComponent(query)}&veg=${vegOnly}`);
        if (itemRes.data?.items) {
          setItems(itemRes.data.items);
        }

        const restRes: any = await api.get(`/restaurants?search=${encodeURIComponent(query)}&is_pure_veg=${vegOnly}`);
        if (restRes.data?.restaurants) {
          setRestaurants(restRes.data.restaurants);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, vegOnly]);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Back button and Search input */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for restaurants, biryani, pizzas, rolls, burgers..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden shadow-xs"
          />
        </div>

        {/* Pure Veg filter chip */}
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`px-4 py-3 rounded-2xl text-xs font-bold border transition-colors shrink-0 ${
            vegOnly
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Pure Veg
        </button>
      </div>

      {/* AI Food Sommelier Recommendation Widget */}
      <AiFoodSommelier
        onSelectRestaurant={async (id) => {
          try {
            const res: any = await api.get(`/restaurants/${id}`);
            if (res.data?.restaurant) onSelectRestaurant(res.data.restaurant);
          } catch (e) {
            console.error(e);
          }
        }}
      />

      {/* Search results */}
      {query.trim().length > 0 && (
        <div className="space-y-8 animate-in fade-in">
          {/* Matching Restaurants */}
          {restaurants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-900 text-base">Matching Restaurants</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {restaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} onClick={() => onSelectRestaurant(r)} />
                ))}
              </div>
            </div>
          )}

          {/* Matching Dishes */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-base">
              Dishes matching "{query}" ({items.length})
            </h3>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Searching menu items...</div>
            ) : items.length === 0 && restaurants.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <p className="text-sm font-bold text-slate-800">No dishes found matching "{query}"</p>
                <p className="text-xs text-slate-400 mt-1">Try another keyword or ask the AI Sommelier above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    restaurant={{ id: item.restaurant_id, name: item.restaurant_name || 'Restaurant' } as any}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
