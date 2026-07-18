import { Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useTransactions } from '../../hooks/useTransactions';
import { TransactionList } from '../../components/TransactionList';
import { Transaction } from '../../lib/types';

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const {
    transactions,
    loading,
    hasMore,
    loadMore,
    deleteTransaction,
    refresh,
  } = useTransactions();

  const handleDelete = (transaction: Transaction) => {
    Alert.alert(
      'Delete transaction',
      `Remove ${transaction.categories?.name ?? 'this'} transaction?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(transaction.id),
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Transactions',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <TransactionList
        transactions={transactions}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onPressTransaction={(t) => router.push(`/transaction/${t.id}`)}
        onDeleteTransaction={handleDelete}
        emptyMessage="No transactions yet"
      />
    </>
  );
}
