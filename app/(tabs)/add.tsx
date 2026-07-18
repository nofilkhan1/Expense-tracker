import { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CategoryPicker } from '../../components/CategoryPicker';
import { useCategories } from '../../hooks/useCategories';
import { supabase } from '../../lib/supabase';
import { spacing, typography } from '../../constants/theme';

export default function AddTransactionScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { categories } = useCategories();
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedCategory) {
      Alert.alert('Select a category');
      return;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Invalid amount', 'Please enter a positive number');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('transactions').insert({
      user_id: user!.id,
      category_id: selectedCategory,
      amount: parsed,
      type,
      note: note || null,
      transaction_date: date,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.back();
    }
  };

  const expenseCats = categories.filter((c) => c.type === 'expense');
  const incomeCats = categories.filter((c) => c.type === 'income');

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: 'Add Transaction',
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
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

        <Input
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
        <CategoryPicker
          categories={type === 'expense' ? expenseCats : incomeCats}
          selectedId={selectedCategory}
          onSelect={(cat) => setSelectedCategory(cat.id)}
        />

        <Input
          value={note}
          onChangeText={setNote}
          placeholder="Note (optional)"
          multiline
        />

        <Input
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        <Button onPress={handleSave} loading={loading} style={styles.save}>
          Save
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  typeToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  typeBtn: { flex: 1 },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    marginTop: spacing.lg,
  },
  save: { marginTop: spacing.xl },
});
