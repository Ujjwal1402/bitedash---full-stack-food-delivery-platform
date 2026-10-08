import React, { useState, useEffect } from 'react';
import { Restaurant, MenuItem, MenuCategory } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { DietaryTag } from '../../components/restaurant/DietaryTag.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Modal } from '../../components/common/Modal.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import { Plus, Trash2, Edit2, UtensilsCrossed, CheckCircle2, XCircle } from 'lucide-react';

export const PartnerMenuPage: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  // Add Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [submittingItem, setSubmittingItem] = useState(false);

  // Add Category Modal
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submittingCategory, setSubmittingCategory] = useState(false);

  const fetchMenu = async () => {
    try {
      const pRes: any = await api.get('/restaurants/partner/profile');
      if (pRes.data?.restaurant) {
        const fullRes: any = await api.get(`/restaurants/${pRes.data.restaurant.id}`);
        if (fullRes.data?.restaurant) {
          setRestaurant(fullRes.data.restaurant);
          if (fullRes.data.restaurant.categories?.length > 0) {
            setCategoryId(fullRes.data.restaurant.categories[0].id);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleToggleAvailability = async (itemId: number) => {
    try {
      const res: any = await api.patch(`/menu/items/${itemId}/availability`);
      showToast(res.message || 'Availability toggled', 'info');
      fetchMenu();
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle availability', 'error');
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm('Delete this item from menu?')) return;
    try {
      await api.delete(`/menu/items/${itemId}`);
      showToast('Item deleted from menu', 'info');
      fetchMenu();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !restaurant) return;
    setSubmittingCategory(true);
    try {
      await api.post('/menu/categories', {
        restaurant_id: restaurant.id,
        name: newCategoryName.trim(),
      });
      showToast('Category created', 'success');
      setNewCategoryName('');
      setIsAddCategoryOpen(false);
      fetchMenu();
    } catch (err: any) {
      showToast(err.message || 'Failed to create category', 'error');
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !categoryId || !restaurant) return;
    setSubmittingItem(true);
    try {
      await api.post('/menu/items', {
        restaurant_id: restaurant.id,
        category_id: Number(categoryId),
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : undefined,
        image_url:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        is_veg: isVeg,
        is_best_seller: isBestSeller,
        is_available: true,
      });

      showToast('Dish added to menu', 'success');
      setIsAddModalOpen(false);
      setName('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setImageUrl('');
      fetchMenu();
    } catch (err: any) {
      showToast(err.message || 'Failed to add dish', 'error');
    } finally {
      setSubmittingItem(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading menu manager...</div>;
  }

  const categories = restaurant?.categories || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Menu & Stock Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add dishes, configure categories, and toggle in-stock / out-of-stock items in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddCategoryOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Category
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add New Dish
          </Button>
        </div>
      </div>

      {/* Categories & Dishes */}
      <div className="space-y-6">
        {categories.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">Your menu is currently empty</h3>
            <p className="text-xs text-slate-400 mt-1">
              Start by creating categories like 'Appetizers', 'Mains', or 'Pizzas'.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => setIsAddCategoryOpen(true)}
            >
              Create First Category
            </Button>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <span>{cat.name}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    ({cat.items?.length || 0} items)
                  </span>
                </h3>
              </div>

              <div className="space-y-3 divide-y divide-slate-100">
                {cat.items?.map((item) => (
                  <div
                    key={item.id}
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <DietaryTag isVeg={item.is_veg} />
                          <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                          {item.is_best_seller && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Bestseller
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">₹{item.price}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Stock Switch and Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {/* Availability toggle */}
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                          item.is_available
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {item.is_available ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-500" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        title="Add Menu Category"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Starters & Sides, Biryanis, Desserts"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsAddCategoryOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="flex-1"
              isLoading={submittingCategory}
            >
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Dish to Menu"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateItem} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Paneer Tikka Butter Masala"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                placeholder="299"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Original Price (Optional)
              </label>
              <input
                type="number"
                placeholder="349"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Photo Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Fresh ingredients, spices, and preparation notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
                className="rounded-xs text-orange-500 focus:ring-orange-500"
              />
              <span>Vegetarian Dish</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded-xs text-orange-500 focus:ring-orange-500"
              />
              <span>Highlight as Bestseller</span>
            </label>
          </div>

          <div className="flex gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="flex-1"
              isLoading={submittingItem}
            >
              Save Dish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
