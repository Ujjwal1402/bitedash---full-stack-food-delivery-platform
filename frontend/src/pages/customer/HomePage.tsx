import React, { useState, useEffect } from 'react';
import { Restaurant } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../store/AuthContext.tsx';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard.tsx';
import { RestaurantCardSkeleton } from '../../components/common/Skeleton.tsx';
import { Sparkles, Utensils, Flame, Search, ArrowRight, ShieldCheck, Zap, User } from 'lucide-react';
import { ASSET_IMAGES } from '../../assets/images/index.ts';

interface HomePageProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onNavigateSearch: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectRestaurant,
  onNavigateSearch,
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const cuisinesList = ['All', 'Pizza', 'Italian', 'Biryani', 'Indian', 'Sushi', 'Japanese', 'Healthy'];

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cuisineFilter && cuisineFilter !== 'All') params.append('cuisine', cuisineFilter);
      if (pureVegOnly) params.append('is_pure_veg', 'true');
      if (sortBy) params.append('sort', sortBy);

      const res: any = await api.get(`/restaurants?${params.toString()}`);
      if (res.data?.restaurants) {
        setRestaurants(res.data.restaurants);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [cuisineFilter, pureVegOnly, sortBy]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner Section with Photo Background */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-6 sm:p-12 shadow-xl shadow-orange-500/10">
        <img
          src={ASSET_IMAGES.heroBanner}
          alt="Culinary feast spread"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none"
        />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/30">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Lightning Fast Hyper-Local Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Craving greatness? <br />
            <span className="text-amber-200">Delivered hot & fast.</span>
          </h1>

          <p className="text-sm sm:text-base text-orange-100 font-medium">
            Explore authentic wood-fired pizzas, royal dum biryanis, fresh sashimi rolls, and pure-veg bowls from the city's finest kitchens.
          </p>

          {/* Quick Search & Combined Auth Action */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNavigateSearch}
              className="flex items-center justify-between gap-3 bg-white text-slate-800 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-orange-500" />
                <span>Search dishes or try Gemini AI Food Sommelier</span>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </button>

            {!isAuthenticated && onOpenAuth && (
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-white px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="hidden lg:block absolute right-12 bottom-8 opacity-90">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-white max-w-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-200">
              <Sparkles className="w-4 h-4" />
              <span>AI Sommelier Active</span>
            </div>
            <p className="text-xs text-orange-100">
              Personalized dish recommendations powered by Google Gemini API.
            </p>
          </div>
        </div>
      </section>

      {/* Combined Auth Dashboard Card (When Not Logged In) */}
      {!isAuthenticated && onOpenAuth && (
        <section className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-200/80 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Welcome to BiteDash! Access full features with 1-click
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Login or create an account to save delivery addresses, redeem coupons, and track live food deliveries.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Login / Sign Up</span>
          </button>
        </section>
      )}

      {/* Visual Craving Spotlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Trending Craving Spotlights</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Handcrafted dishes curated from master kitchens</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          <div
            onClick={() => setCuisineFilter(cuisineFilter === 'Pizza' ? '' : 'Pizza')}
            className={`cursor-pointer group relative rounded-2xl overflow-hidden border transition-all hover:shadow-lg ${
              cuisineFilter === 'Pizza' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200'
            }`}
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <img
                src={ASSET_IMAGES.pizza}
                alt="Wood-fired artisanal pizza"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 bg-white">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Artisan Italian</span>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">Wood-Fired Pizza</h3>
            </div>
          </div>

          <div
            onClick={() => setCuisineFilter(cuisineFilter === 'Biryani' ? '' : 'Biryani')}
            className={`cursor-pointer group relative rounded-2xl overflow-hidden border transition-all hover:shadow-lg ${
              cuisineFilter === 'Biryani' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200'
            }`}
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <img
                src={ASSET_IMAGES.biryani}
                alt="Royal dum biryani"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 bg-white">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Royal Heritage</span>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">Saffron Dum Biryani</h3>
            </div>
          </div>

          <div
            onClick={() => setCuisineFilter(cuisineFilter === 'Sushi' ? '' : 'Sushi')}
            className={`cursor-pointer group relative rounded-2xl overflow-hidden border transition-all hover:shadow-lg ${
              cuisineFilter === 'Sushi' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200'
            }`}
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <img
                src={ASSET_IMAGES.sushi}
                alt="Fresh sushi and sashimi platter"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 bg-white">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Japanese Craft</span>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">Fresh Sushi Platter</h3>
            </div>
          </div>

          <div
            onClick={() => setCuisineFilter(cuisineFilter === 'Healthy' ? '' : 'Healthy')}
            className={`cursor-pointer group relative rounded-2xl overflow-hidden border transition-all hover:shadow-lg ${
              cuisineFilter === 'Healthy' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200'
            }`}
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <img
                src={ASSET_IMAGES.burger}
                alt="Gourmet smash burger meal"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 bg-white">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">American Gourmet</span>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">Smash Burger & Fries</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Quick Filter Chips */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-orange-500" />
            <span>Popular Cuisines</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {cuisinesList.map((c) => {
            const isActive = (c === 'All' && !cuisineFilter) || cuisineFilter === c;
            return (
              <button
                key={c}
                onClick={() => setCuisineFilter(c === 'All' ? '' : c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Restaurant Listing with Filters & Sorting */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span>Top Restaurants in Metro City</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {restaurants.length} gourmet kitchens delivering to you
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Pure Veg Toggle */}
            <button
              onClick={() => setPureVegOnly(!pureVegOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                pureVegOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${pureVegOnly ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span>Pure Veg</span>
            </button>

            {/* Sorting Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="rating">Top Rated (★)</option>
              <option value="delivery_time">Fastest Delivery</option>
              <option value="cost_low">Cost: Low to High</option>
              <option value="cost_high">Cost: High to Low</option>
            </select>
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <RestaurantCardSkeleton key={k} />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
            <p className="text-base font-bold text-slate-800">No restaurants match your filters.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the pure veg toggle or cuisine selection.</p>
            <button
              onClick={() => {
                setCuisineFilter('');
                setPureVegOnly(false);
                setSortBy('rating');
              }}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => onSelectRestaurant(restaurant)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
