import { useState, useCallback, useRef } from "react";
import { Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useTheme } from "../constants/useTheme";
import { patterns } from "../constants/breathing";
import { quotes } from "../constants/quotes";
import BreathingCircle from "../components/BreathingCircle";
import KomorebiBackground from "../components/KomorebiBackground";

// Pick a breathing-related quote
const breathQuotes = quotes.filter(
  (q) =>
    q.text.toLowerCase().includes("breath") ||
    q.text.toLowerCase().includes("calm") ||
    q.text.toLowerCase().includes("moment") ||
    q.text.toLowerCase().includes("smile"),
);

export default function BreatheScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [patternIndex, setPatternIndex] = useState(0);
  const [phase, setPhase] = useState("");
  const lastPhase = useRef("");

  const pattern = patterns[patternIndex];
  const quote = breathQuotes[patternIndex % breathQuotes.length];

  const handlePhaseChange = useCallback((newPhase: string) => {
    if (newPhase !== lastPhase.current) {
      lastPhase.current = newPhase;
      setPhase(newPhase);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const toggleActive = () => {
    if (isActive) {
      setIsActive(false);
      setPhase("");
      lastPhase.current = "";
    } else {
      setIsActive(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const cyclePattern = () => {
    if (isActive) return;
    setPatternIndex((prev) => (prev + 1) % patterns.length);
    Haptics.selectionAsync();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        overflow: "hidden",
      }}
    >
      {/* Komorebi shadows */}
      <KomorebiBackground />

      {/* Header - Dropdown */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: colors.textMuted }}>← Back</Text>
        </Pressable>

        <Pressable
          onPress={cyclePattern}
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 0.5,
            borderColor: colors.cardBorder,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: isActive ? colors.textMuted : colors.text,
            }}
          >
            {pattern.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.textMuted,
              marginLeft: 8,
            }}
          >
            ▼
          </Text>
        </Pressable>
      </Animated.View>

      {/* Breathing circle - centered */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <Animated.View entering={FadeInDown.duration(800).delay(200)}>
          <BreathingCircle
            pattern={pattern}
            isActive={isActive}
            phase={phase}
            onPhaseChange={handlePhaseChange}
          />
        </Animated.View>
      </View>

      {/* Quote + Button at bottom */}
      <View
        style={{
          paddingHorizontal: 32,
          paddingBottom: insets.bottom + 24,
          zIndex: 10,
        }}
      >
        {/* Quote */}
        <Animated.View
          entering={FadeInUp.duration(800).delay(400)}
          style={{
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontStyle: "italic",
              fontWeight: "300",
              color: colors.textSecondary,
              lineHeight: 28,
              textAlign: "center",
              maxWidth: 280,
            }}
          >
            "{quote.text}"
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.textMuted,
              marginTop: 12,
              letterSpacing: 0.5,
            }}
          >
            — {quote.author}
          </Text>
        </Animated.View>

        {/* Begin/Stop button */}
        <Animated.View entering={FadeInUp.duration(600).delay(600)}>
          <Pressable
            onPress={toggleActive}
            style={{
              backgroundColor: isActive ? "rgba(45,58,46,0.08)" : colors.accent,
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                letterSpacing: 1,
                color: isActive ? colors.textSecondary : "#FFFFFF",
              }}
            >
              {isActive ? "Stop" : "Begin"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
