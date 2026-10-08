import React from 'react';
import { MenuItem, Restaurant } from '../../types/index.ts';
import { useCart } from '../../store/CartContext.tsx';
import { DietaryTag } from './DietaryTag.tsx';
import { Plus, Minus, Star } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  restaurant: Restaurant;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, restaurant }) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.menu_item_id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(
      {
        menu_item_id: item.id,
        restaurant_id: restaurant.id,
        name: item.name,
        price: Number(item.price),
        image_url: item.image_url,
        is_veg: item.is_veg,
        quantity: 1,
      },
      restaurant
    );
  };

  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-xs transition-all">
      {/* Left Item Details */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <DietaryTag isVeg={item.is_veg} />
          {item.is_best_seller && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              Bestseller
            </span>
          )}
        </div>

        <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h4>

        <div className="flex items-baseline gap-2">
          <span className="font-bold text-sm text-slate-800">₹{item.price}</span>
          {item.original_price && Number(item.original_price) > Number(item.price) && (
            <span className="text-xs text-slate-400 line-through">₹{item.original_price}</span>
          )}
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
      </div>

      {/* Right Image & Add Button */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="w-28 h-24 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Add Button or Counter */}
        <div className="absolute -bottom-2">
          {!item.is_available ? (
            <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold px-3 py-1 rounded-lg uppercase shadow-xs">
              Sold Out
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-white border border-orange-500 text-orange-600 rounded-lg shadow-md font-bold text-xs overflow-hidden">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="px-2.5 py-1 hover:bg-orange-50 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 select-none">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="px-2.5 py-1 hover:bg-orange-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-500 text-orange-600 font-bold text-xs uppercase px-5 py-1.5 rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
