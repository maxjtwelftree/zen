import { useState, useRef } from 'react';
import { Text, View, Pressable, GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../constants/useTheme';
import Ripple from '../components/Ripple';

export default function BellScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [ripple, setRipple] = useState({ x: 0, y: 0, trigger: 0 });
  const [bellText, setBellText] = useState('Tap anywhere');

  const handlePress = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    setRipple({ x: locationX, y: locationY, trigger: Date.now() });
    setBellText('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Reset text after ripple fades
    setTimeout(() => {
      setBellText('Tap anywhere');
    }, 3000);
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
          zIndex: 10,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: colors.textMuted }}>
            {'\u2190'} Back
          </Text>
        </Pressable>
        <Text style={{ fontSize: 14, color: colors.textMuted }}>
          Bell of Mindfulness
        </Text>
      </Animated.View>

      {/* Tap area */}
      <Pressable
        onPress={handlePress}
        style={{
          flex: 1,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ripple x={ripple.x} y={ripple.y} trigger={ripple.trigger} />

        <Animated.View
          entering={FadeInDown.duration(800).delay(300)}
          style={{ alignItems: 'center', zIndex: 10 }}
        >
          <Text style={{ fontSize: 64, marginBottom: 24 }}>{'\u{1F6CE}\u{FE0F}'}</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '300',
              color: colors.textMuted,
              height: 22,
            }}
          >
            {bellText}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}
