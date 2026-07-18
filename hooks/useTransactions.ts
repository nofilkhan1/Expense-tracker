import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction } from '../lib/types';
import { useAuth } from './useAuth';

const PAGE_SIZE = 20;

export interface TransactionFilters {
  search?: string;
  category_id?: string;
  type?: 'expense' | 'income';
  date_from?: string;
  date_to?: string;
}

export function useTransactions(filters?: TransactionFilters) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const buildQuery = useCallback((query: any) => {
    if (filters?.search) {
      query = query.ilike('note', `%${filters.search}%`);
    }
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.date_from) {
      query = query.gte('transaction_date', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('transaction_date', filters.date_to);
    }
    return query;
  }, [filters?.search, filters?.category_id, filters?.type, filters?.date_from, filters?.date_to]);

  const fetchTransactions = useCallback(async (pageNum = 0) => {
    if (!user) return;

    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    query = buildQuery(query);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    if (pageNum === 0) {
      setTransactions(data as Transaction[] ?? []);
    } else {
      setTransactions((prev) => [...prev, ...(data as Transaction[] ?? [])]);
    }

    setHasMore((data?.length ?? 0) === PAGE_SIZE);
    setLoading(false);
  }, [user, buildQuery]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setPage(0);
      fetchTransactions(0);
    }
  }, [user, fetchTransactions]);

  const loadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage);
  };

  const addTransaction = async (data: {
    category_id: string;
    amount: number;
    type: 'expense' | 'income';
    note?: string;
    transaction_date: string;
  }) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      category_id: data.category_id,
      amount: data.amount,
      type: data.type,
      note: data.note || null,
      transaction_date: data.transaction_date,
    });

    if (!error) {
      setPage(0);
      await fetchTransactions(0);
    }

    return { error: error?.message ?? null };
  };

  const updateTransaction = async (id: string, data: {
    category_id?: string;
    amount?: number;
    type?: 'expense' | 'income';
    note?: string;
    transaction_date?: string;
  }) => {
    const { error } = await supabase.from('transactions').update(data).eq('id', id);

    if (!error) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      );
    }

    return { error: error?.message ?? null };
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
    return { error: error?.message ?? null };
  };

  const refresh = () => {
    setLoading(true);
    setPage(0);
    fetchTransactions(0);
  };

  return {
    transactions,
    loading,
    hasMore,
    loadMore,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refresh,
  };
}
