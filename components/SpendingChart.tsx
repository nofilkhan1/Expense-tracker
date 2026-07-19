import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, radii, shadows } from '../constants/theme';
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
    <View style={[styles.container, { backgroundColor: colors.surface }, shadows.md]}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
      <View style={styles.chartArea}>
        {data.map((item, index) => {
          const height = (Math.abs(item.value) / maxValue) * 140;
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
                    backgroundColor: isNegative ? colors.primary : colors.accent,
                    opacity: isNegative ? 0.9 : 0.7,
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
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
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.lg,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    paddingTop: spacing.lg,
  },
  barContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  bar: {
    width: 32,
  },
  value: {
    fontSize: 9,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 11,
    fontWeight: typography.weight.medium,
  },
});
