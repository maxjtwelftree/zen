import { Text, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../constants/useTheme";
import Card from "../components/Card";
import KomorebiBackground from "../components/KomorebiBackground";
import Animated, { FadeInDown } from "react-native-reanimated";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, overflow: "hidden" }}>
      <KomorebiBackground />
      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <Text
            style={{
              fontSize: 13,
              color: colors.textMuted,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {getGreeting()}
          </Text>
          <Text
            style={{
              fontSize: 34,
              fontWeight: "300",
              color: colors.text,
              marginBottom: 8,
              letterSpacing: -0.5,
            }}
          >
            Komorebi
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.textSecondary,
              lineHeight: 24,
              marginBottom: 48,
            }}
          >
            Take a moment to pause.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={{ gap: 16 }}
        >
          <Card
            title="Breathe"
            subtitle="Follow a guided breathing rhythm"
            emoji="🌬️"
            href="/breathe"
          />
          <Card
            title="Bell"
            subtitle="Ring the bell of mindfulness"
            emoji="🔔"
            href="/bell"
          />
          <Card
            title="Presence"
            subtitle="A moment of reflection"
            emoji="🍃"
            href="/presence"
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
