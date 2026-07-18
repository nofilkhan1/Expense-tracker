import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radii, typography } from '../constants/theme';
import { categoryIcons, iconNameMap } from '../constants/icons';

interface IconPickerProps {
  selected: string;
  onSelect: (icon: string) => void;
}

export function IconPicker({ selected, onSelect }: IconPickerProps) {
  const { colors } = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Pick an icon</Text>
      <View style={styles.grid}>
        {categoryIcons.map((icon) => (
          <TouchableOpacity
            key={icon}
            onPress={() => onSelect(icon)}
            style={[
              styles.iconBtn,
              {
                backgroundColor: selected === icon ? colors.accent : colors.surface,
                borderColor: selected === icon ? colors.accent : colors.surfaceBorder,
              },
            ]}
            accessibilityLabel={icon}
          >
            <Text style={styles.iconText}>{iconNameMap[icon] ?? '?'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconText: {
    fontSize: 20,
  },
});
