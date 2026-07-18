import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../lib/types';
import { useAuth } from './useAuth';
import { defaultCategories } from '../constants/categories';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    if (data && data.length === 0) {
      const inserts = defaultCategories.map((cat) => ({
        user_id: user.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        type: cat.type,
      }));

      const { data: inserted } = await supabase
        .from('categories')
        .insert(inserts)
        .select();

      if (inserted) setCategories(inserted);
      else setCategories([]);
    } else {
      setCategories(data ?? []);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchCategories();
  }, [user, fetchCategories]);

  return { categories, loading, refetch: fetchCategories };
}
