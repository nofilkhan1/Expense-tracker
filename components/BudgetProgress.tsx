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
    : colors.accent;

  const trackColor = isOver
    ? colors.expense + '15'
    : isWarning
    ? colors.warning + '15'
    : colors.accent + '15';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.nameRow}>
          {categoryColor && <View style={[styles.dot, { backgroundColor: categoryColor }]} />}
          <Text style={[styles.name, { color: colors.text }]}>{categoryName}</Text>
        </View>
        <Text style={[styles.amount, { color: isOver ? colors.expense : colors.text }]}>
          ${spent.toFixed(2)} / ${budget.toFixed(2)}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: trackColor }]}>
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
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  warning: {
    fontSize: typography.size.xs,
    marginTop: spacing.xs,
  },
});
