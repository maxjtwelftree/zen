import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/useTheme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  title: string;
  subtitle: string;
  emoji: string;
  href: string;
}

export default function Card({ title, subtitle, emoji, href }: CardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      }}
      onPress={() => router.push(href as any)}
      style={[
        animatedStyle,
        {
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: 24,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <Text style={{ fontSize: 32, marginBottom: 12 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.textMuted,
          lineHeight: 20,
        }}
      >
        {subtitle}
      </Text>
    </AnimatedPressable>
  );
}
