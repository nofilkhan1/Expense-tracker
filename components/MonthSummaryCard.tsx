import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, radii, shadows } from '../constants/theme';
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
    <View style={[styles.card, { backgroundColor: colors.surface }, shadows.md]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Balance this month</Text>
      <Text
        style={[
          styles.balance,
          { color: isPositive ? colors.primary : colors.expense },
        ]}
      >
        {isPositive ? '' : '-'}{formatCurrency(Math.abs(netBalance))}
      </Text>

      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={styles.stat}>
          <View style={[styles.dot, { backgroundColor: colors.income }]} />
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Income</Text>
          <Text style={[styles.statAmount, { color: colors.income }]}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>
        <View style={styles.statDivider} />
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
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  balance: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    fontVariant: ['tabular-nums'],
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.size.xs,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  statAmount: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontVariant: ['tabular-nums'],
    marginTop: spacing.xs,
  },
});
