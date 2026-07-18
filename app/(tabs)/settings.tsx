import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useCategories } from '../../hooks/useCategories';
import { useBudgets } from '../../hooks/useBudgets';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { exportTransactionsToCSV } from '../../lib/export';
import { spacing, typography, radii } from '../../constants/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const { categories, refetch } = useCategories();
  const { budgets, setBudget, removeBudget } = useBudgets();
  const [editBudgetId, setEditBudgetId] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState('');

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  const handleDeleteCategory = useCallback(async (id: string, name: string) => {
    Alert.alert(
      'Delete category',
      `Delete "${name}"? Transactions using it will lose their category reference.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) Alert.alert('Error', error.message);
            else refetch();
          },
        },
      ],
    );
  }, [refetch]);

  const handleSetBudget = async (category_id: string) => {
    const amount = parseFloat(budgetInput);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Enter a valid amount');
      return;
    }
    await setBudget(category_id, amount);
    setEditBudgetId(null);
    setBudgetInput('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.section, { borderBottomColor: colors.surfaceBorder }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Account</Text>
          <Text style={[styles.value, { color: colors.text }]}>{user?.email}</Text>
        </View>

        <View style={styles.spacer} />

        <View style={[styles.section, { borderBottomColor: colors.surfaceBorder }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Categories</Text>
          <TouchableOpacity
            onPress={() => router.push('/add-category')}
            style={[styles.addBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.addBtnText}>+ Add Category</Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onLongPress={() => handleDeleteCategory(cat.id, cat.name)}
              style={[styles.categoryRow, { borderBottomColor: colors.surfaceBorder }]}
            >
              <View style={[styles.catDot, { backgroundColor: cat.color }]} />
              <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
              <Text style={[styles.catType, { color: colors.textSecondary }]}>
                {cat.type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacer} />

        <View style={[styles.section, { borderBottomColor: colors.surfaceBorder }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Monthly Budgets
          </Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Set a spending limit per category
          </Text>
          {categories.filter((c) => c.type === 'expense').map((cat) => {
            const currentBudget = budgets.find((b) => b.category_id === cat.id);
            return (
              <View key={cat.id} style={styles.budgetRow}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
                {editBudgetId === cat.id ? (
                  <View style={styles.budgetEdit}>
                    <TextInput
                      value={budgetInput}
                      onChangeText={setBudgetInput}
                      placeholder="0.00"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      style={[styles.budgetInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
                    />
                    <TouchableOpacity onPress={() => handleSetBudget(cat.id)} style={styles.budgetSave}>
                      <Text style={{ color: colors.accent, fontWeight: '600' }}>Set</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setEditBudgetId(cat.id);
                      setBudgetInput(currentBudget?.amount.toString() ?? '');
                    }}
                  >
                    <Text style={[styles.budgetAmount, { color: currentBudget ? colors.text : colors.textSecondary }]}>
                      {currentBudget ? `$${currentBudget.amount.toFixed(0)}` : 'Set budget'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.spacer} />

        <Text style={[styles.label, { color: colors.textSecondary, marginBottom: spacing.md }]}>Data</Text>
        <Button
          variant="secondary"
          onPress={async () => {
            if (!user) return;
            Alert.alert('Export', 'Export all transactions to CSV?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Export',
                onPress: async () => {
                  const path = await exportTransactionsToCSV(user.id);
                  if (path) Alert.alert('Exported', `CSV saved`);
                  else Alert.alert('Error', 'Could not export transactions');
                },
              },
            ]);
          }}
          style={styles.logout}
        >
          Export CSV
        </Button>

        <View style={styles.spacer} />

        <Button
          variant="destructive"
          onPress={handleLogout}
          style={styles.logout}
        >
          Sign Out
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl },
  section: {
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  value: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.xs,
  },
  hint: {
    fontSize: typography.size.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  addBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  catDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  catName: {
    flex: 1,
    fontSize: typography.size.md,
  },
  catType: {
    fontSize: typography.size.sm,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  budgetEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  budgetInput: {
    width: 80,
    height: 36,
    borderRadius: radii.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    fontSize: typography.size.sm,
    textAlign: 'right',
  },
  budgetSave: {
    paddingHorizontal: spacing.sm,
  },
  budgetAmount: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  spacer: { height: spacing.xxl },
  logout: { marginTop: spacing.xl },
});
