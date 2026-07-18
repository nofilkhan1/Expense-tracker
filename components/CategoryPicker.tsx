import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radii, typography } from '../constants/theme';
import { Category } from '../lib/types';

interface CategoryPickerProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (category: Category) => void;
}

export function CategoryPicker({ categories, selectedId, onSelect }: CategoryPickerProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onSelect(cat)}
          style={[
            styles.chip,
            {
              backgroundColor: selectedId === cat.id ? `${cat.color}20` : colors.surface,
              borderColor: selectedId === cat.id ? cat.color : colors.surfaceBorder,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={cat.name}
        >
          <View style={[styles.iconCircle, { backgroundColor: cat.color }]} />
          <Text style={[styles.label, { color: colors.text }]}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    minHeight: 44,
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
