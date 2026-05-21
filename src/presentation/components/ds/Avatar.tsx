import { useState } from 'react';
import { Image, Text as RNText, View } from 'react-native';
import { useTheme } from '@presentation/theme/ThemeContext';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: AvatarSize;
  testID?: string;
}

const SIZES: Record<AvatarSize, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 64,
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const trimmed = name.trim();
  if (!trimmed) return '?';

  const parts = trimmed.split(/[\s_-]+/).filter(Boolean);
  if (parts.length === 0) return '?';

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? '?';
  }

  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
}

// Fallback em cascata: image → iniciais → "?".
export function Avatar({ uri, name, size = 'md', testID }: AvatarProps) {
  const { colors, radius } = useTheme();
  const [imageError, setImageError] = useState(false);
  const dimension = SIZES[size];
  const showImage = uri && !imageError;

  const containerStyle = {
    width: dimension,
    height: dimension,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    overflow: 'hidden' as const,
  };

  if (showImage) {
    return (
      <Image
        testID={testID}
        source={{ uri }}
        onError={() => setImageError(true)}
        style={containerStyle}
      />
    );
  }

  return (
    <View testID={testID} style={containerStyle}>
      <RNText
        style={{
          color: colors.textMuted,
          fontSize: dimension * 0.4,
          fontWeight: '600',
        }}
      >
        {getInitials(name)}
      </RNText>
    </View>
  );
}
