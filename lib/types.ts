export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  type: 'expense' | 'income';
  note: string | null;
  transaction_date: string;
  created_at: string;
  categories?: Category;
}

export interface Profile {
  id: string;
  email: string;
}
