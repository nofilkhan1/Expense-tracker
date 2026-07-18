import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radii, typography } from '../constants/theme';

interface BudgetProgressProps {
  spent: number;
  budget: number;
  categoryColor?: string;
  categoryName?: string;
  categoryId?: string;
}

export function BudgetProgress({ spent, budget, categoryColor, categoryName }: BudgetProgressProps) {
  const { colors } = useTheme();
  if (budget <= 0) return null;

  const ratio = Math.min(spent / budget, 1);
  const percentage = Math.round(ratio * 100);
  const isOver = spent > budget;
  const isWarning = !isOver && percentage >= 80;

  const barColor = isOver
    ? colors.expense
    : isWarning
    ? colors.warning
    : colors.income;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>{categoryName}</Text>
        <Text style={[styles.amount, { color: isOver ? colors.expense : colors.text }]}>
          ${spent.toFixed(2)} / ${budget.toFixed(2)}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.surfaceBorder }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      {isOver && (
        <Text style={[styles.warning, { color: colors.expense }]}>
          Over budget by ${(spent - budget).toFixed(2)}
        </Text>
      )}
      {isWarning && !isOver && (
        <Text style={[styles.warning, { color: colors.warning }]}>
          Approaching budget limit
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  amount: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 8,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.sm,
  },
  warning: {
    fontSize: typography.size.xs,
    marginTop: spacing.xs,
  },
});
