import { useState, useMemo } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../constants/useTheme';
import { quotes } from '../constants/quotes';
import QuoteCard from '../components/QuoteCard';

function getDailyQuoteIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % quotes.length;
}

export default function PresenceScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [offset, setOffset] = useState(0);

  const quoteIndex = useMemo(() => {
    return (getDailyQuoteIndex() + offset + quotes.length) % quotes.length;
  }, [offset]);

  const quote = quotes[quoteIndex];

  const nextQuote = () => {
    setOffset((prev) => prev + 1);
    Haptics.selectionAsync();
  };

  const prevQuote = () => {
    setOffset((prev) => prev - 1);
    Haptics.selectionAsync();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 16,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: colors.textMuted }}>
            {'\u2190'} Back
          </Text>
        </Pressable>
        <Text style={{ fontSize: 14, color: colors.textMuted }}>
          Daily Presence
        </Text>
      </Animated.View>

      {/* Quote */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
        }}
      >
        <QuoteCard key={quoteIndex} quote={quote} />
      </View>

      {/* Navigation */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(400)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 32,
          paddingBottom: 32,
        }}
      >
        <Pressable
          onPress={prevQuote}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 24,
          }}
        >
          <Text style={{ fontSize: 14, color: colors.textMuted }}>
            {'\u2190'} Previous
          </Text>
        </Pressable>
        <Pressable
          onPress={nextQuote}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 24,
          }}
        >
          <Text style={{ fontSize: 14, color: colors.textMuted }}>
            Next {'\u2192'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
