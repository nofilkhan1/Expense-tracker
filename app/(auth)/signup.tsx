import { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { spacing, typography } from '../../constants/theme';

export default function SignupScreen() {
  const { colors } = useTheme();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error, needsConfirmation } = await signUp(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign up failed', error);
    } else if (needsConfirmation) {
      Alert.alert(
        'Check your email',
        'We sent you a confirmation link. Please confirm your email, then sign in.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }],
      );
    } else {
      Alert.alert('Welcome', 'Account created! Default categories are being set up.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={[styles.logo, { color: colors.primary }]}>$</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Start tracking your finances
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          value={email}
          onChangeText={(t) => { setEmail(t); setErrors({}); }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <Input
          value={password}
          onChangeText={(t) => { setPassword(t); setErrors({}); }}
          placeholder="Password"
          secureTextEntry
          error={errors.password}
        />
        <Input
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setErrors({}); }}
          placeholder="Confirm password"
          secureTextEntry
          error={errors.confirmPassword}
        />
        <Button onPress={handleSignup} loading={loading}>
          Create Account
        </Button>
      </View>

      <Button
        variant="secondary"
        onPress={() => router.replace('/(auth)/login')}
        style={styles.link}
      >
        Already have an account? Sign In
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  header: { marginBottom: spacing.xxxl },
  logoRow: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 48,
    fontWeight: typography.weight.bold,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.size.md,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  form: { gap: spacing.lg },
  link: { marginTop: spacing.xl },
});
