import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, radii } from '../constants/theme';
import { Transaction } from '../lib/types';
import { formatCurrency } from '../lib/formatters';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
}

export function TransactionCard({ transaction, onPress, onDelete }: TransactionCardProps) {
  const { colors } = useTheme();
  const isExpense = transaction.type === 'expense';
  const catColor = transaction.categories?.color ?? colors.textSecondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onDelete}
      style={[styles.card, { borderBottomColor: colors.surfaceBorder }]}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.categories?.name ?? 'Unknown'}, ${formatCurrency(transaction.amount)}`}
    >
      <View style={styles.left}>
        <View style={[styles.iconCircle, { backgroundColor: catColor }]}>
          <View style={styles.iconPlaceholder} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.categoryName, { color: colors.text }]}>
            {transaction.categories?.name ?? 'Unknown'}
          </Text>
          {transaction.note && (
            <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={1}>
              {transaction.note}
            </Text>
          )}
        </View>
      </View>
      <Text
        style={[
          styles.amount,
          { color: isExpense ? colors.expense : colors.income },
        ]}
      >
        {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  details: {
    flex: 1,
  },
  categoryName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  note: {
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  amount: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    fontVariant: ['tabular-nums'],
  },
});
