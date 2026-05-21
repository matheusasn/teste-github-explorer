import { useEffect } from 'react';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@presentation/theme/ThemeContext';
import type { DimensionValue } from 'react-native';

type SkeletonRadius = 'sm' | 'md' | 'lg' | 'full';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: SkeletonRadius;
}

export function Skeleton({ width = '100%', height = 16, radius = 'sm' }: SkeletonProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.surfaceMuted, theme.colors.border],
    ),
  }));

  const radiusValue = theme.radius[radius];

  return <Animated.View style={[{ width, height, borderRadius: radiusValue }, animatedStyle]} />;
}
