import { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { IconPicker } from '../components/IconPicker';
import { spacing, typography } from '../constants/theme';

const presetColors = [
  '#FF453A', '#FF9F0A', '#FFD60A', '#34C759', '#30D158',
  '#0A84FF', '#5E5CE6', '#BF5AF2', '#FF2D55', '#8E8E93',
];

export default function AddCategoryScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('more-horizontal');
  const [color, setColor] = useState(presetColors[0]);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Enter a category name');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('categories').insert({
      user_id: user!.id,
      name: name.trim(),
      icon,
      color,
      type,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: 'Add Category',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Category name"
        />

        <View style={styles.typeToggle}>
          <Button
            variant={type === 'expense' ? 'primary' : 'secondary'}
            onPress={() => setType('expense')}
            style={styles.typeBtn}
          >
            Expense
          </Button>
          <Button
            variant={type === 'income' ? 'primary' : 'secondary'}
            onPress={() => setType('income')}
            style={styles.typeBtn}
          >
            Income
          </Button>
        </View>

        <IconPicker selected={icon} onSelect={setIcon} />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Color</Text>
        <View style={styles.colorRow}>
          {presetColors.map((c) => (
            <View
              key={c}
              onTouchEnd={() => setColor(c)}
              style={[
                styles.colorSwatch,
                {
                  backgroundColor: c,
                  borderColor: color === c ? colors.text : 'transparent',
                  borderWidth: color === c ? 2.5 : 0,
                },
              ]}
            />
          ))}
        </View>

        <Button onPress={handleSave} loading={loading} style={styles.save}>
          Add Category
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  typeToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeBtn: { flex: 1 },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  colorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  save: { marginTop: spacing.xl },
});
