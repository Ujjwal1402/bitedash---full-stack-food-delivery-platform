import { useState, useEffect } from 'react';
import { Restaurant } from '../types/index.ts';
import { api } from '../services/api.ts';

export function useRestaurants(cuisine?: string, pureVeg?: boolean, sortBy?: string) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (cuisine && cuisine !== 'All') params.append('cuisine', cuisine);
        if (pureVeg) params.append('is_pure_veg', 'true');
        if (sortBy) params.append('sort', sortBy);

        const res: any = await api.get(`/restaurants?${params.toString()}`);
        if (isMounted && res.data?.restaurants) {
          setRestaurants(res.data.restaurants);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load restaurants');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [cuisine, pureVeg, sortBy]);

  return { restaurants, loading, error };
}
