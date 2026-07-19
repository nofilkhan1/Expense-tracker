import { useRef } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, radii, shadows } from '../constants/theme';
import { Transaction } from '../lib/types';
import { formatCurrency } from '../lib/formatters';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
}

export function TransactionCard({ transaction, onPress, onDelete }: TransactionCardProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isExpense = transaction.type === 'expense';
  const catColor = transaction.categories?.color ?? colors.textSecondary;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onDelete}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[styles.card, { backgroundColor: colors.surface }, shadows.sm]}
        accessibilityRole="button"
        accessibilityLabel={`${transaction.categories?.name ?? 'Unknown'}, ${formatCurrency(transaction.amount)}`}
      >
        <View style={styles.left}>
          <View style={[styles.iconCircle, { backgroundColor: catColor + '20' }]}>
            <View style={[styles.iconDot, { backgroundColor: catColor }]} />
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    borderRadius: radii.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
