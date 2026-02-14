import { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../constants/useTheme';
import type { BreathingPattern } from '../constants/breathing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CIRCLE_SIZE = SCREEN_WIDTH * 0.6;
const CIRCLE_MIN = 0.5;
const CIRCLE_MAX = 1;

interface BreathingCircleProps {
  pattern: BreathingPattern;
  isActive: boolean;
  onPhaseChange: (phase: string) => void;
}

export default function BreathingCircle({
  pattern,
  isActive,
  onPhaseChange,
}: BreathingCircleProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(CIRCLE_MIN);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    if (!isActive) {
      scale.value = withTiming(CIRCLE_MIN, { duration: 800 });
      opacity.value = withTiming(0.4, { duration: 800 });
      return;
    }

    const totalDuration =
      (pattern.inhale + pattern.hold + pattern.exhale + pattern.holdAfter) * 1000;

    function runCycle() {
      if (!isActive) return;

      const inhaleMs = pattern.inhale * 1000;
      const holdMs = pattern.hold * 1000;
      const exhaleMs = pattern.exhale * 1000;
      const holdAfterMs = pattern.holdAfter * 1000;

      runOnJS(onPhaseChange)('Breathe in');

      scale.value = withTiming(CIRCLE_MAX, {
        duration: inhaleMs,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      opacity.value = withTiming(0.9, {
        duration: inhaleMs,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });

      if (holdMs > 0) {
        setTimeout(() => {
          if (!isActive) return;
          runOnJS(onPhaseChange)('Hold');
        }, inhaleMs);
      }

      setTimeout(() => {
        if (!isActive) return;
        runOnJS(onPhaseChange)('Breathe out');

        scale.value = withTiming(CIRCLE_MIN, {
          duration: exhaleMs,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        opacity.value = withTiming(0.4, {
          duration: exhaleMs,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
      }, inhaleMs + holdMs);

      if (holdAfterMs > 0) {
        setTimeout(() => {
          if (!isActive) return;
          runOnJS(onPhaseChange)('Hold');
        }, inhaleMs + holdMs + exhaleMs);
      }

      setTimeout(() => {
        if (isActive) runCycle();
      }, totalDuration);
    }

    runCycle();
  }, [isActive, pattern]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Outer glow */}
      <Animated.View
        style={[
          circleStyle,
          {
            position: 'absolute',
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            backgroundColor: colors.accentSoft,
          },
        ]}
      />
      {/* Inner circle */}
      <Animated.View
        style={[
          circleStyle,
          {
            width: CIRCLE_SIZE * 0.85,
            height: CIRCLE_SIZE * 0.85,
            borderRadius: (CIRCLE_SIZE * 0.85) / 2,
            backgroundColor: colors.accent,
          },
        ]}
      />
    </View>
  );
}
