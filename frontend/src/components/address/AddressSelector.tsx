import React, { useState, useEffect } from 'react';
import { Address } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { MapPin, Plus, Check } from 'lucide-react';
import { Button } from '../common/Button.tsx';
import { showToast } from '../common/Toast.tsx';

interface AddressSelectorProps {
  selectedAddressId: number | null;
  onSelectAddress: (address: Address) => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedAddressId,
  onSelectAddress,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);

  // New address form
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
        if (!selectedAddressId && res.data.addresses.length > 0) {
          const def = res.data.addresses.find((a: Address) => a.is_default) || res.data.addresses[0];
          onSelectAddress(def);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post('/addresses', {
        label,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        state,
        postal_code: postalCode,
        landmark,
        is_default: addresses.length === 0,
      });
      showToast('Address saved successfully', 'success');
      setAddingNew(false);
      await fetchAddresses();
      if (res.data?.address) {
        onSelectAddress(res.data.address);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save address', 'error');
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-xs text-slate-400">Loading delivery addresses...</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
            Delivery Location
          </h3>
        </div>

        {!addingNew && (
          <button
            onClick={() => setAddingNew(true)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        )}
      </div>

      {addingNew ? (
        <form onSubmit={handleSaveAddress} className="space-y-3 pt-2">
          <div className="grid grid-cols-3 gap-2">
            {['Home', 'Work', 'Other'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLabel(l)}
                className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  label === l
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <input
            type="text"
            required
            placeholder="Flat / House No. / Building Name"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="text"
            placeholder="Street / Area / Landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              required
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
            />
          </div>

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
              Save & Use
            </Button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-xs text-slate-500 mb-2">No saved address found.</p>
          <Button variant="primary" size="sm" onClick={() => setAddingNew(true)}>
            Add Delivery Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => onSelectAddress(addr)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {addr.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-orange-600 stroke-[3]" />}
                </div>
                <p className="text-xs font-semibold text-slate-800 line-clamp-1 mt-1">
                  {addr.address_line1}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {addr.city}, {addr.state} - {addr.postal_code}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
