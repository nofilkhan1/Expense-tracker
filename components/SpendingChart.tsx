import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, radii } from '../constants/theme';
import { formatCurrency } from '../lib/formatters';

interface BarData {
  label: string;
  value: number;
}

interface SpendingChartProps {
  data: BarData[];
  title?: string;
}

export function SpendingChart({ data, title }: SpendingChartProps) {
  const { colors } = useTheme();
  const maxValue = Math.max(...data.map((d) => Math.abs(d.value)), 1);

  if (data.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
      <View style={styles.bars}>
        {data.map((item, index) => {
          const height = (Math.abs(item.value) / maxValue) * 120;
          const isNegative = item.value < 0;

          return (
            <View key={index} style={styles.barContainer}>
              <Text
                style={[styles.value, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {formatCurrency(Math.abs(item.value))}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(height, 4),
                    backgroundColor: isNegative ? colors.expense : colors.income,
                  },
                ]}
              />
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.md,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 180,
  },
  barContainer: {
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: radii.sm,
  },
  value: {
    fontSize: 10,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 11,
  },
});
