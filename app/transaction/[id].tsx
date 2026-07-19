import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CategoryPicker } from '../../components/CategoryPicker';
import { useCategories } from '../../hooks/useCategories';
import { Transaction } from '../../lib/types';
import { spacing, typography } from '../../constants/theme';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { categories } = useCategories();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          Alert.alert('Error', 'Transaction not found');
          router.back();
          return;
        }
        const t = data as Transaction;
        setTransaction(t);
        setAmount(t.amount.toString());
        setSelectedCategory(t.category_id);
        setNote(t.note ?? '');
        setDate(t.transaction_date);
        setType(t.type);
        setFetching(false);
      });
  }, [id, user]);

  const handleUpdate = async () => {
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
    const { error } = await supabase
      .from('transactions')
      .update({
        category_id: selectedCategory,
        amount: parsed,
        type,
        note: note || null,
        transaction_date: date,
      })
      .eq('id', id);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.back();
    }
  };

  const expenseCats = categories.filter((c) => c.type === 'expense');
  const incomeCats = categories.filter((c) => c.type === 'income');

  if (fetching) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: 'Edit Transaction',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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

        <Button onPress={handleUpdate} loading={loading} style={styles.save}>
          Save Changes
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl },
  typeToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeBtn: { flex: 1 },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  save: { marginTop: spacing.lg },
});
