import React, { useState, useEffect } from 'react';
import { Address } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { Button } from '../../components/common/Button.tsx';
import { showToast } from '../../components/common/Toast.tsx';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase } from 'lucide-react';

export const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);

  // Form states
  const [label, setLabel] = useState('Home');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Metro City');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('90210');
  const [landmark, setLandmark] = useState('');

  const fetchAddresses = async () => {
    try {
      const res: any = await api.get('/addresses');
      if (res.data?.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/addresses', {
        label,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        state,
        postal_code: postalCode,
        landmark,
        is_default: addresses.length === 0,
      });
      showToast('Address saved', 'success');
      setAddingNew(false);
      setAddressLine1('');
      setAddressLine2('');
      setLandmark('');
      fetchAddresses();
    } catch (err: any) {
      showToast(err.message || 'Failed to save address', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      showToast('Address deleted', 'info');
      fetchAddresses();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete address', 'error');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.patch(`/addresses/${id}/default`);
      showToast('Default address updated', 'success');
      fetchAddresses();
    } catch (err: any) {
      showToast(err.message || 'Failed to set default', 'error');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading saved addresses...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Saved Addresses</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage delivery locations for quick checkout</p>
        </div>

        {!addingNew && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddingNew(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Address
          </Button>
        )}
      </div>

      {addingNew && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in"
        >
          <h3 className="font-bold text-slate-900 text-sm">Add New Delivery Location</h3>

          <div className="flex gap-2">
            {['Home', 'Work', 'Other'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLabel(l)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  label === l
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Flat / Building / House No."
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
            <input
              type="text"
              placeholder="Area / Street"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
            <input
              type="text"
              required
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
            <input
              type="text"
              required
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <input
            type="text"
            placeholder="Nearby landmark (optional)"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          />

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setAddingNew(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex-1">
              Save Address
            </Button>
          </div>
        </form>
      )}

      {/* Address cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {addr.label === 'Home' ? (
                    <Home className="w-3.5 h-3.5 text-orange-500" />
                  ) : (
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                  )}
                  <span>{addr.label}</span>
                </span>

                {addr.is_default && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-2">{addr.address_line1}</h4>
              {addr.address_line2 && <p className="text-xs text-slate-600">{addr.address_line2}</p>}
              <p className="text-xs text-slate-500 mt-1">
                {addr.city}, {addr.state} - {addr.postal_code}
              </p>
              {addr.landmark && (
                <p className="text-[11px] text-slate-400 mt-1">Landmark: {addr.landmark}</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              {!addr.is_default ? (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Default
                </span>
              )}

              <button
                onClick={() => handleDelete(addr.id)}
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
