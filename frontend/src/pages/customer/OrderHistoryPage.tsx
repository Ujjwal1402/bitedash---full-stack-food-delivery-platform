import React, { useState, useEffect } from 'react';
import { Order } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useCart } from '../../store/CartContext.tsx';
import { Button } from '../../components/common/Button.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import { Modal } from '../../components/common/Modal.tsx';
import { Clock, RotateCcw, Star, ChevronRight, ShoppingBag } from 'lucide-react';

interface OrderHistoryPageProps {
  onTrackOrder: (orderId: number) => void;
  onExplore: () => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({
  onTrackOrder,
  onExplore,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Review modal
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem, clearCart } = useCart();

  const fetchOrders = async () => {
    try {
      const res: any = await api.get('/orders/my-orders');
      if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return;
    clearCart();

    for (const item of order.items) {
      addItem(
        {
          menu_item_id: item.menu_item_id,
          restaurant_id: order.restaurant_id,
          name: item.item_name,
          price: Number(item.item_price),
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
          is_veg: true,
          quantity: item.quantity,
          customizations: item.customizations || undefined,
        },
        {
          id: order.restaurant_id,
          name: order.restaurant_name || 'Restaurant',
        } as any
      );
    }

    showToast('Items added to cart! Proceed to checkout.', 'success');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder) return;
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        order_id: reviewOrder.id,
        rating,
        comment,
      });
      showToast('Thank you for reviewing your meal!', 'success');
      setReviewOrder(null);
      setComment('');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Your Orders</h1>
        <p className="text-xs text-slate-500 mt-0.5">Track active orders or re-order your favorites</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Order delicious food from the best restaurants and your orders will show up right here.
          </p>
          <Button variant="primary" size="sm" className="mt-5" onClick={onExplore}>
            Explore Restaurants
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={order.restaurant_banner || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                      alt={order.restaurant_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {order.restaurant_name}
                    </h3>
                    <p className="text-xs text-slate-400">Order #{order.order_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : order.status === 'CANCELLED'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse'
                    }`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  {order.items?.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
                </p>
                <div className="flex items-center gap-3 text-slate-400 text-[11px] pt-1">
                  <span>{new Date(order.placed_at).toLocaleDateString()}</span>
                  <span>·</span>
                  <span className="font-bold text-slate-900 text-xs">Total: ₹{order.total_amount}</span>
                  <span>·</span>
                  <span>{order.payment_method}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onTrackOrder(order.id)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <span>View Details & Tracking</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {order.status === 'DELIVERED' && (
                    <button
                      onClick={() => setReviewOrder(order)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>Review</span>
                    </button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(order)}
                    leftIcon={<RotateCcw className="w-3 h-3" />}
                  >
                    Reorder
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <Modal
          isOpen={!!reviewOrder}
          onClose={() => setReviewOrder(null)}
          title={`Review ${reviewOrder.restaurant_name}`}
          description={`Rate your food experience from order #${reviewOrder.order_number}`}
        >
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Feedback</label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the food flavor, packaging, and temperature?"
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setReviewOrder(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="flex-1"
                isLoading={submittingReview}
              >
                Submit Review
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
