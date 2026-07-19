import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useCategories } from '../../hooks/useCategories';
import { useBudgets } from '../../hooks/useBudgets';
import { Button } from '../../components/ui/Button';
import { CategoryIcon } from '../../components/CategoryIcon';
import { supabase } from '../../lib/supabase';
import { exportTransactionsToCSV } from '../../lib/export';
import { spacing, typography, radii, shadows } from '../../constants/theme';

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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Account</Text>
          <View style={styles.accountRow}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.accent + '20' }]}>
              <Text style={[styles.avatarText, { color: colors.accent }]}>
                {user?.email?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>
            <Text style={[styles.accountEmail, { color: colors.text }]}>{user?.email}</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Categories</Text>
          <TouchableOpacity
            onPress={() => router.push('/add-category')}
            activeOpacity={0.7}
            style={[styles.addBtn, { backgroundColor: colors.primary + '15' }]}
          >
            <Text style={[styles.addBtnText, { color: colors.primary }]}>+ Add Category</Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onLongPress={() => handleDeleteCategory(cat.id, cat.name)}
              activeOpacity={0.7}
              style={[styles.categoryRow, { borderBottomColor: colors.surfaceBorder }]}
            >
              <CategoryIcon icon={cat.icon} color={cat.color} size={16} />
              <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
              <Text style={[styles.catType, { color: colors.textSecondary }]}>
                {cat.type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Monthly Budgets
          </Text>
          {categories.filter((c) => c.type === 'expense').map((cat) => {
            const currentBudget = budgets.find((b) => b.category_id === cat.id);
            return (
              <View key={cat.id} style={styles.budgetRow}>
                <CategoryIcon icon={cat.icon} color={cat.color} size={16} />
                <Text style={[styles.budgetName, { color: colors.text }]}>{cat.name}</Text>
                {editBudgetId === cat.id ? (
                  <View style={styles.budgetEdit}>
                    <TextInput
                      value={budgetInput}
                      onChangeText={setBudgetInput}
                      placeholder="0.00"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      style={[styles.budgetInput, { color: colors.text, backgroundColor: colors.bg, borderColor: colors.surfaceBorder }]}
                    />
                    <TouchableOpacity onPress={() => handleSetBudget(cat.id)} activeOpacity={0.7} style={styles.budgetSave}>
                      <Text style={{ color: colors.primary, fontWeight: '600' }}>Set</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setEditBudgetId(cat.id);
                      setBudgetInput(currentBudget?.amount.toString() ?? '');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.budgetAmount, { color: currentBudget ? colors.primary : colors.textSecondary }]}>
                      {currentBudget ? `$${currentBudget.amount.toFixed(0)}` : 'Set budget'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Data</Text>
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
            style={styles.exportBtn}
          >
            Export CSV
          </Button>
        </View>

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
  scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl },
  section: {
    borderRadius: radii.xl,
    padding: spacing.xl,
  },
  sectionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  accountEmail: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
  },
  addBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  addBtnText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
  },
  catName: {
    flex: 1,
    fontSize: typography.size.md,
  },
  catType: {
    fontSize: typography.size.sm,
    textTransform: 'capitalize',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  budgetName: {
    flex: 1,
    fontSize: typography.size.md,
  },
  budgetEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  budgetInput: {
    width: 80,
    height: 36,
    borderRadius: radii.md,
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
  exportBtn: {
    marginTop: spacing.xs,
  },
  logout: {
    marginTop: spacing.xl,
  },
});
