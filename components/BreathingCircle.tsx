import { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "../constants/useTheme";
import type { BreathingPattern } from "../constants/breathing";

const SCREEN_WIDTH = Dimensions.get("window").width;
const OUTER_SIZE = 240;
const INNER_MIN = 160;
const INNER_MAX = 220;

interface BreathingCircleProps {
  pattern: BreathingPattern;
  isActive: boolean;
  phase: string;
  onPhaseChange: (phase: string) => void;
}

export default function BreathingCircle({
  pattern,
  isActive,
  phase,
  onPhaseChange,
}: BreathingCircleProps) {
  const { colors } = useTheme();
  const innerSize = useSharedValue(INNER_MIN);
  const glowOpacity = useSharedValue(0.1);

  useEffect(() => {
    if (!isActive) {
      innerSize.value = withTiming(INNER_MIN, { duration: 800 });
      glowOpacity.value = withTiming(0.1, { duration: 800 });
      return;
    }

    const totalDuration =
      (pattern.inhale + pattern.hold + pattern.exhale + pattern.holdAfter) *
      1000;

    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function runCycle() {
      if (cancelled) return;

      const inhaleMs = pattern.inhale * 1000;
      const holdMs = pattern.hold * 1000;
      const exhaleMs = pattern.exhale * 1000;
      const holdAfterMs = pattern.holdAfter * 1000;

      runOnJS(onPhaseChange)("INHALE");
      innerSize.value = withTiming(INNER_MAX, {
        duration: inhaleMs,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      glowOpacity.value = withTiming(0.25, {
        duration: inhaleMs,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });

      if (holdMs > 0) {
        timeout = setTimeout(() => {
          if (cancelled) return;
          runOnJS(onPhaseChange)("HOLD");
        }, inhaleMs);
      }

      timeout = setTimeout(() => {
        if (cancelled) return;
        runOnJS(onPhaseChange)("EXHALE");
        innerSize.value = withTiming(INNER_MIN, {
          duration: exhaleMs,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
        glowOpacity.value = withTiming(0.1, {
          duration: exhaleMs,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
      }, inhaleMs + holdMs);

      if (holdAfterMs > 0) {
        timeout = setTimeout(
          () => {
            if (cancelled) return;
            runOnJS(onPhaseChange)("HOLD");
          },
          inhaleMs + holdMs + exhaleMs,
        );
      }

      timeout = setTimeout(() => {
        if (!cancelled) runCycle();
      }, totalDuration);
    }

    runCycle();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isActive, pattern]);

  const innerStyle = useAnimatedStyle(() => ({
    width: innerSize.value,
    height: innerSize.value,
    borderRadius: innerSize.value / 2,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    width: innerSize.value + 40,
    height: innerSize.value + 40,
    borderRadius: (innerSize.value + 40) / 2,
    opacity: glowOpacity.value,
  }));

  return (
    <View
      style={{
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Outer ring */}
      <View
        style={{
          position: "absolute",
          width: OUTER_SIZE,
          height: OUTER_SIZE,
          borderRadius: OUTER_SIZE / 2,
          borderWidth: 3,
          borderColor: colors.ring,
        }}
      />

      {/* Glow */}
      <Animated.View
        style={[
          glowStyle,
          {
            position: "absolute",
            backgroundColor: colors.accent,
          },
        ]}
      />

      {/* Inner filled circle */}
      <Animated.View
        style={[
          innerStyle,
          {
            backgroundColor: colors.accent,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {/* Phase label */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            letterSpacing: 3,
            color: "#2D3A2E",
            textTransform: "uppercase",
          }}
        >
          {phase}
        </Text>
      </Animated.View>
    </View>
  );
}
