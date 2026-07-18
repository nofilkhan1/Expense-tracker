import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Transaction } from '../lib/types';
import { useAuth } from './useAuth';

const PAGE_SIZE = 20;

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchTransactions = useCallback(async (pageNum = 0) => {
    if (!user) return;

    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

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
  }, [user]);

  useEffect(() => {
    if (user) fetchTransactions(0);
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
