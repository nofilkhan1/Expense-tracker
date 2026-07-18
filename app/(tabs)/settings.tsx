import { useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useCategories } from '../../hooks/useCategories';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { spacing, typography } from '../../constants/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const { categories, refetch } = useCategories();

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
  spacer: { height: spacing.xxl },
  logout: { marginTop: spacing.xl },
});
