export interface DefaultCategory {
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
}

export const defaultCategories: DefaultCategory[] = [
  { name: 'Food', icon: 'utensils', color: '#F97316', type: 'expense' },
  { name: 'Transport', icon: 'car', color: '#0A84FF', type: 'expense' },
  { name: 'Shopping', icon: 'shopping-bag', color: '#AF52DE', type: 'expense' },
  { name: 'Bills', icon: 'file-text', color: '#FF453A', type: 'expense' },
  { name: 'Health', icon: 'heart', color: '#FF2D55', type: 'expense' },
  { name: 'Entertainment', icon: 'film', color: '#FF9F0A', type: 'expense' },
  { name: 'Salary', icon: 'briefcase', color: '#34C759', type: 'income' },
  { name: 'Other', icon: 'more-horizontal', color: '#8E8E93', type: 'expense' },
];
