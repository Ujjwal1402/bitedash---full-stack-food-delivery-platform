import React, { useState, useEffect } from 'react';
import { Restaurant, MenuItem, Review } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { MenuItemCard } from '../../components/restaurant/MenuItemCard.tsx';
import { StarRating } from '../../components/common/Badge.tsx';
import { Clock, Bike, MapPin, ArrowLeft, MessageSquare, Star } from 'lucide-react';
import { Button } from '../../components/common/Button.tsx';

interface RestaurantDetailPageProps {
  restaurantIdOrSlug: string | number;
  onBack: () => void;
}

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({
  restaurantIdOrSlug,
  onBack,
}) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res: any = await api.get(`/restaurants/${restaurantIdOrSlug}`);
        if (res.data?.restaurant) {
          setRestaurant(res.data.restaurant);
          // fetch reviews
          const revRes: any = await api.get(`/reviews/restaurant/${res.data.restaurant.id}`);
          if (revRes.data?.reviews) {
            setReviews(revRes.data.reviews);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [restaurantIdOrSlug]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading chef's menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Restaurant not found</h3>
        <Button variant="primary" size="sm" className="mt-4" onClick={onBack}>
          Back to Restaurants
        </Button>
      </div>
    );
  }

  // Filter categories and menu items
  const categories = restaurant.categories || [];
  const allItems: MenuItem[] = categories.flatMap((c) => c.items || []);

  const filteredItems = allItems.filter((item) => {
    if (activeCategory !== 'all' && item.category_id !== activeCategory) return false;
    if (vegOnly && !item.is_veg) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all restaurants</span>
      </button>

      {/* Restaurant Header Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-100">
          <img
            src={restaurant.banner_image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Restaurant Details Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StarRating rating={restaurant.rating} count={restaurant.rating_count} />
              {restaurant.is_pure_veg && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  PURE VEG
                </span>
              )}
              {!restaurant.is_open && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  CURRENTLY CLOSED
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{restaurant.name}</h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">{restaurant.description}</p>
          </div>
        </div>

        {/* Quick Meta Stats Row */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>{restaurant.address}, {restaurant.city}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{restaurant.delivery_time_min} mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-orange-500" />
              <span>₹{restaurant.delivery_fee} delivery</span>
            </div>
            <span className="font-bold text-slate-800">₹{restaurant.cost_for_two} for two</span>
          </div>
        </div>
      </div>

      {/* Menu Categories Navigation Tabs */}
      <div className="sticky top-18 z-30 bg-slate-50/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center justify-between border-b border-slate-200 gap-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            All Items ({allItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.name} ({cat.items?.length || 0})
            </button>
          ))}
        </div>

        {/* Veg Only Toggle */}
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shrink-0 ${
            vegOnly
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${vegOnly ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          <span>Veg Only</span>
        </button>
      </div>

      {/* Menu Items Grid */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <p className="text-sm font-bold text-slate-700">No dishes found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 mt-12">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Customer Reviews ({reviews.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <StarRating rating={restaurant.rating} count={restaurant.rating_count} />
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No reviews yet. Be the first to order and review {restaurant.name}!
          </p>
        ) : (
          <div className="space-y-4 divide-y divide-slate-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{rev.user_name || 'Verified Customer'}</span>
                  <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{rev.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
