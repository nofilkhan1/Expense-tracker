import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, radii, typography } from '../constants/theme';
import { Category } from '../lib/types';
import { TransactionFilters } from '../hooks/useTransactions';

interface FilterBarProps {
  categories: Category[];
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export function FilterBar({ categories, filters, onChange }: FilterBarProps) {
  const { colors } = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  const update = (partial: Partial<TransactionFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const clearFilters = () => {
    onChange({});
  };

  const hasActiveFilters = filters.search || filters.category_id || filters.type || filters.date_from || filters.date_to;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.searchRow}>
        <View style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <TextInput
            value={filters.search ?? ''}
            onChangeText={(t) => update({ search: t || undefined })}
            placeholder="Search notes..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text }]}
          />
        </View>
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
          style={[styles.filterToggle, { backgroundColor: hasActiveFilters ? colors.primary : colors.surface }]}
          accessibilityLabel="Toggle filters"
        >
          <Text style={[styles.filterToggleText, { color: hasActiveFilters ? '#0F172A' : colors.text }]}>
            #
          </Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersPanel}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <TouchableOpacity
              onPress={() => update({ category_id: undefined })}
              activeOpacity={0.7}
              style={[styles.filterChip, {
                backgroundColor: !filters.category_id ? colors.accent : colors.surface,
                borderColor: !filters.category_id ? colors.accent : colors.surfaceBorder,
              }]}
            >
              <Text style={[styles.chipText, { color: !filters.category_id ? '#FFF' : colors.text }]}>All</Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => update({ category_id: cat.id === filters.category_id ? undefined : cat.id })}
                activeOpacity={0.7}
                style={[styles.filterChip, {
                  backgroundColor: filters.category_id === cat.id ? cat.color : colors.surface,
                  borderColor: filters.category_id === cat.id ? cat.color : colors.surfaceBorder,
                }]}
              >
                <Text style={[styles.chipText, { color: filters.category_id === cat.id ? '#FFF' : colors.text }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.typeRow}>
            {(['expense', 'income'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => update({ type: filters.type === t ? undefined : t })}
                activeOpacity={0.7}
                style={[styles.typeChip, {
                  backgroundColor: filters.type === t ? colors.accent : colors.surface,
                  borderColor: filters.type === t ? colors.accent : colors.surfaceBorder,
                }]}
              >
                <Text style={[styles.chipText, { color: filters.type === t ? '#FFF' : colors.text }]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearBtn} activeOpacity={0.7}>
              <Text style={[styles.clearText, { color: colors.primary }]}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.size.sm,
    height: '100%',
  },
  filterToggle: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleText: {
    fontSize: 18,
    fontWeight: typography.weight.bold,
  },
  filtersPanel: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1,
    marginRight: spacing.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
  },
  clearBtn: {
    alignSelf: 'flex-start',
  },
  clearText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});
