import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from './supabase';
import { Transaction } from './types';

export async function exportTransactionsToCSV(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(name)')
    .eq('user_id', userId)
    .order('transaction_date', { ascending: false });

  if (error || !data) {
    console.error('Error fetching transactions for export:', error);
    return null;
  }

  const transactions = data as (Transaction & { categories: { name: string } })[];

  const headers = 'Date,Type,Category,Amount,Note';
  const rows = transactions.map((t) => {
    const date = t.transaction_date;
    const type = t.type;
    const category = t.categories?.name ?? 'Unknown';
    const amount = t.type === 'expense' ? -t.amount : t.amount;
    const note = (t.note ?? '').replace(/"/g, '""');
    return `"${date}","${type}","${category}",${amount.toFixed(2)},"${note}"`;
  });

  const csv = [headers, ...rows].join('\n');
  const filename = `expenses-${new Date().toISOString().split('T')[0]}.csv`;

  const file = new File(Paths.cache, filename);
  await file.write(csv);

  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Transactions',
    });
  }

  return file.uri;
}
