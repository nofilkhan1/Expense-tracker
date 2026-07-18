import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radii, typography } from '../../constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface ChipProps {
  label: string;
  icon?: string;
  color: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, icon, color, selected, onPress }: ChipProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: selected ? colors.accent : 'transparent',
          backgroundColor: selected ? `${colors.accent}15` : colors.surface,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.iconCircle, { backgroundColor: color }]} />
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1.5,
  },
  iconCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
