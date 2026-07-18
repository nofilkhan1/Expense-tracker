export function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayMs = 86400000;

  if (diff < dayMs && date.getDate() === now.getDate()) {
    return 'Today';
  }
  if (diff < 2 * dayMs && date.getDate() === now.getDate() - 1) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatDateFull(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function groupTransactionsByDate<T extends { transaction_date: string }>(
  transactions: T[]
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const t of transactions) {
    const key = t.transaction_date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }
  return groups;
}
