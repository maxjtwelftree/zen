import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../constants/useTheme';
import type { Quote } from '../constants/quotes';

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(1200)}
      style={{
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: '300',
          color: colors.text,
          lineHeight: 38,
          textAlign: 'center',
          fontStyle: 'italic',
          marginBottom: 24,
        }}
      >
        "{quote.text}"
      </Text>
      <View
        style={{
          width: 32,
          height: 1,
          backgroundColor: colors.textMuted,
          marginBottom: 16,
          opacity: 0.4,
        }}
      />
      <Text
        style={{
          fontSize: 14,
          color: colors.textMuted,
          letterSpacing: 1,
        }}
      >
        {quote.author}
      </Text>
    </Animated.View>
  );
}
