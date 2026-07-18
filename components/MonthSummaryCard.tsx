import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, radii } from '../constants/theme';
import { formatCurrency } from '../lib/formatters';

interface MonthSummaryCardProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export function MonthSummaryCard({ totalIncome, totalExpense, netBalance }: MonthSummaryCardProps) {
  const { colors } = useTheme();
  const isPositive = netBalance >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Balance this month</Text>
      <Text
        style={[
          styles.balance,
          { color: isPositive ? colors.income : colors.expense },
        ]}
      >
        {isPositive ? '' : '-'}{formatCurrency(Math.abs(netBalance))}
      </Text>

      <View style={styles.row}>
        <View style={styles.stat}>
          <View style={[styles.dot, { backgroundColor: colors.income }]} />
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Income</Text>
          <Text style={[styles.statAmount, { color: colors.income }]}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>
        <View style={styles.stat}>
          <View style={[styles.dot, { backgroundColor: colors.expense }]} />
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Expenses</Text>
          <Text style={[styles.statAmount, { color: colors.expense }]}>
            {formatCurrency(totalExpense)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  balance: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    fontVariant: ['tabular-nums'],
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: typography.size.xs,
  },
  statAmount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    fontVariant: ['tabular-nums'],
    width: '100%',
    marginTop: 2,
  },
});
