import React, { useState } from 'react';
import { api } from '../../services/api.ts';
import { Sparkles, Utensils, Send, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { DietaryTag } from '../restaurant/DietaryTag.tsx';
import { useCart } from '../../store/CartContext.tsx';
import { showToast } from '../common/Toast.tsx';

export const AiFoodSommelier: React.FC<{ onSelectRestaurant?: (restaurantId: number) => void }> = ({
  onSelectRestaurant,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    explanation: string;
    pairing?: string;
    items: any[];
  } | null>(null);

  const { addItem } = useCart();

  const samplePrompts = [
    'Craving something rich, spicy, and satisfying under ₹400',
    'Healthy, crisp, high-protein pure veg meal',
    'Cheesy wood-fired comfort food with Italian dessert',
  ];

  const handleAsk = async (textToAsk = prompt) => {
    if (!textToAsk.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res: any = await api.post('/menu/ai-discover', { prompt: textToAsk.trim() });
      if (res.data) {
        setResult(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'AI Sommelier is currently busy. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-purple-500/10 border border-orange-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-xl bg-orange-500 text-white shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Gemini AI Food Sommelier
          </h2>
          <p className="text-xs text-slate-500">
            Describe your mood, craving, or dietary preference in plain language.
          </p>
        </div>
      </div>

      {/* Input Box */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Utensils className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="e.g. I need something spicy and comforting after a long day..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 shadow-xs"
          />
        </div>
        <Button
          onClick={() => handleAsk()}
          isLoading={loading}
          variant="primary"
          size="md"
          className="rounded-2xl"
          rightIcon={<Send className="w-4 h-4" />}
        >
          Discover
        </Button>
      </div>

      {/* Suggested chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400">Quick ideas:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setPrompt(p);
              handleAsk(p);
            }}
            className="text-xs bg-white/80 hover:bg-white text-slate-700 hover:text-orange-600 border border-slate-200/80 px-3 py-1 rounded-full transition-colors"
          >
            "{p}"
          </button>
        ))}
      </div>

      {/* AI Recommendation Result */}
      {result && (
        <div className="mt-6 pt-6 border-t border-orange-200/60 animate-in fade-in slide-in-from-top-3">
          <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border border-orange-100 shadow-sm mb-4">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              💡 {result.explanation}
            </p>
            {result.pairing && (
              <div className="mt-2 text-xs font-semibold text-orange-700 bg-orange-50/80 px-3 py-1.5 rounded-lg inline-block">
                ✨ Recommended Pairing: {result.pairing}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {result.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <DietaryTag isVeg={item.is_veg} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase truncate">
                        {item.restaurant_name}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-slate-900">₹{item.price}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  {onSelectRestaurant && (
                    <button
                      onClick={() => onSelectRestaurant(item.restaurant_id)}
                      className="text-[11px] font-semibold text-slate-600 hover:text-orange-600 flex items-center gap-1"
                    >
                      <span>Restaurant</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      addItem(
                        {
                          menu_item_id: item.id,
                          restaurant_id: item.restaurant_id,
                          name: item.name,
                          price: Number(item.price),
                          image_url: item.image_url,
                          is_veg: item.is_veg,
                          quantity: 1,
                        },
                        {
                          id: item.restaurant_id,
                          name: item.restaurant_name || 'Restaurant',
                        } as any
                      );
                      showToast(`Added ${item.name} to cart`, 'success');
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition-colors ml-auto"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
