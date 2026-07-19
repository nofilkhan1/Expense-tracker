import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radii, typography } from '../../constants/theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  keyboardType,
  multiline,
  autoCapitalize,
}: InputProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
            borderColor: error ? colors.expense : colors.surfaceBorder,
          },
        ]}
      />
      {error && (
        <Text style={[styles.error, { color: colors.expense }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  input: {
    height: 48,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    fontSize: typography.size.md,
    borderWidth: 1,
  },
  error: {
    fontSize: typography.size.xs,
  },
});
