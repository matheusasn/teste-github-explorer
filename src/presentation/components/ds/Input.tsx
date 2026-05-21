import { useState, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '@presentation/theme/ThemeContext';
import { Text } from './Text';

interface InputProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

type FocusHandler = NonNullable<TextInputProps['onFocus']>;
type BlurHandler = NonNullable<TextInputProps['onBlur']>;

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const { colors, spacing, radius } = useTheme();
  const [focused, setFocused] = useState(false);

  const hasError = !!error;
  const borderColor = hasError ? colors.danger : focused ? colors.primary : colors.border;
  const subtext = error ?? helperText;

  const handleFocus: FocusHandler = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur: BlurHandler = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={{ gap: spacing.xs }}>
      {label && (
        <Text variant="label" color="textMuted">
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
        }}
      >
        {leftIcon}
        <TextInput
          {...rest}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.textMuted}
          style={{
            flex: 1,
            paddingVertical: spacing.sm,
            color: colors.text,
            fontSize: 14,
          }}
        />
        {rightIcon}
      </View>

      {subtext && (
        <Text variant="caption" color={hasError ? 'danger' : 'textMuted'}>
          {subtext}
        </Text>
      )}
    </View>
  );
}
