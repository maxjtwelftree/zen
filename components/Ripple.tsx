import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../constants/useTheme';

const SCREEN = Dimensions.get('window');
const MAX_RADIUS = Math.max(SCREEN.width, SCREEN.height);

interface RippleProps {
  x: number;
  y: number;
  trigger: number;
}

export default function Ripple({ x, y, trigger }: RippleProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (trigger === 0) return;
    scale.value = 0;
    opacity.value = 0.3;
    scale.value = withTiming(1, {
      duration: 2000,
      easing: Easing.bezier(0.2, 0, 0, 1),
    });
    opacity.value = withTiming(0, {
      duration: 2000,
      easing: Easing.bezier(0.2, 0, 0, 1),
    });
  }, [trigger]);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x - MAX_RADIUS,
    top: y - MAX_RADIUS,
    width: MAX_RADIUS * 2,
    height: MAX_RADIUS * 2,
    borderRadius: MAX_RADIUS,
    backgroundColor: colors.accent,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style} />;
}
