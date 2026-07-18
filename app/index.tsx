import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function Index() {
  const { session, loading } = useAuth();
  const { colors } = useTheme();

  console.log('[Index] loading:', loading, 'session:', !!session);

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const target = session ? '/(tabs)' : '/(auth)/login';
  console.log('[Index] Redirecting to:', target);
  return <Redirect href={target} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
