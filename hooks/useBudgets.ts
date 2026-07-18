import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BUDGETS_KEY = 'budgets';

export interface BudgetEntry {
  category_id: string;
  amount: number;
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(BUDGETS_KEY).then((data) => {
      if (data) {
        setBudgets(JSON.parse(data));
      }
      setLoading(false);
    });
  }, []);

  const saveBudgets = useCallback(async (newBudgets: BudgetEntry[]) => {
    setBudgets(newBudgets);
    await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(newBudgets));
  }, []);

  const setBudget = useCallback(async (category_id: string, amount: number) => {
    const existing = budgets.find((b) => b.category_id === category_id);
    let newBudgets: BudgetEntry[];
    if (existing) {
      newBudgets = budgets.map((b) =>
        b.category_id === category_id ? { ...b, amount } : b
      );
    } else {
      newBudgets = [...budgets, { category_id, amount }];
    }
    await saveBudgets(newBudgets);
    return newBudgets;
  }, [budgets, saveBudgets]);

  const removeBudget = useCallback(async (category_id: string) => {
    const newBudgets = budgets.filter((b) => b.category_id !== category_id);
    await saveBudgets(newBudgets);
    return newBudgets;
  }, [budgets, saveBudgets]);

  const getBudget = useCallback((category_id: string) => {
    return budgets.find((b) => b.category_id === category_id)?.amount ?? 0;
  }, [budgets]);

  return { budgets, loading, setBudget, removeBudget, getBudget };
}
