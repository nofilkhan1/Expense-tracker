import { ReactNode, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  Animated,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radii, typography, touchTarget } from '../../constants/theme';

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const bgColor =
    variant === 'primary'
      ? colors.primary
      : variant === 'destructive'
      ? colors.expense
      : 'transparent';

  const borderColor =
    variant === 'secondary' ? colors.surfaceBorder : 'transparent';

  const textColor =
    variant === 'primary' || variant === 'destructive'
      ? variant === 'primary' ? '#0F172A' : '#FFFFFF'
      : colors.text;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.base,
          {
            backgroundColor: disabled ? colors.textSecondary : bgColor,
            borderColor,
            borderWidth: variant === 'secondary' ? 1 : 0,
            opacity: disabled ? 0.4 : 1,
          },
          style,
        ]}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <Text style={[styles.text, { color: textColor }]}>{children}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  text: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
