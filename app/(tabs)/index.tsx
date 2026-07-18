import { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useTransactions } from '../../hooks/useTransactions';
import { MonthSummaryCard } from '../../components/MonthSummaryCard';
import { SpendingChart } from '../../components/SpendingChart';
import { TransactionList } from '../../components/TransactionList';
import { spacing, typography } from '../../constants/theme';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { transactions, loading, refresh } = useTransactions();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTransactions = useMemo(
    () => transactions.filter((t) => {
      const d = new Date(t.transaction_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }),
    [transactions, currentMonth, currentYear],
  );

  const totalIncome = useMemo(
    () => monthTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [monthTransactions],
  );

  const totalExpense = useMemo(
    () => monthTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [monthTransactions],
  );

  const netBalance = totalIncome - totalExpense;

  const chartData = useMemo(() => {
    const months: { label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      const monthTxs = transactions.filter((t) => {
        const td = new Date(t.transaction_date);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      });
      const net = monthTxs
        .reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
      months.push({ label, value: net });
    }
    return months;
  }, [transactions, currentYear, currentMonth]);

  const recentTransactions = useMemo(
    () => transactions.slice(0, 5),
    [transactions],
  );

  return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.accent} />
        }
      >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>Dashboard</Text>
      </View>

      <MonthSummaryCard
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        netBalance={netBalance}
      />

      <SpendingChart data={chartData} title="Net spending (6 months)" />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent transactions</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
          <Text style={[styles.seeAll, { color: colors.accent }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <TransactionList
        transactions={recentTransactions}
        loading={loading}
        onPressTransaction={(t) => router.push(`/transaction/${t.id}`)}
        emptyMessage="No transactions this month"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  greeting: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
  seeAll: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
