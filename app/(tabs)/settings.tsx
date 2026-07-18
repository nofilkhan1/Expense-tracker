import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { spacing, typography } from '../../constants/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();

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
  spacer: { height: spacing.xxl },
  logout: { marginTop: spacing.xl },
});
