import { SectionList, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../constants/theme';
import { Transaction } from '../lib/types';
import { TransactionCard } from './TransactionCard';
import { formatDate } from '../lib/formatters';
import { groupTransactionsByDate } from '../lib/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onPressTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transaction: Transaction) => void;
  emptyMessage?: string;
}

export function TransactionList({
  transactions,
  loading,
  hasMore,
  onLoadMore,
  onPressTransaction,
  onDeleteTransaction,
  emptyMessage = 'No transactions yet',
}: TransactionListProps) {
  const { colors } = useTheme();

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {emptyMessage}
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          Add your first expense to see it here
        </Text>
      </View>
    );
  }

  const grouped = groupTransactionsByDate(transactions);
  const sections = Object.entries(grouped)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([date, data]) => ({
      title: formatDate(date),
      data,
    }));

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionCard
          transaction={item}
          onPress={() => onPressTransaction?.(item)}
          onDelete={() => onDeleteTransaction?.(item)}
        />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          {title}
        </Text>
      )}
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.5}
      stickySectionHeadersEnabled
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  emptySubtext: {
    fontSize: typography.size.sm,
    marginTop: spacing.sm,
  },
  sectionHeader: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
