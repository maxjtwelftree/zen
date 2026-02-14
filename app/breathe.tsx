import { useState, useCallback, useRef } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../constants/useTheme';
import { patterns } from '../constants/breathing';
import BreathingCircle from '../components/BreathingCircle';

export default function BreatheScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [patternIndex, setPatternIndex] = useState(0);
  const [phase, setPhase] = useState('');
  const lastPhase = useRef('');

  const pattern = patterns[patternIndex];

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
      setPhase('');
      lastPhase.current = '';
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
        <Pressable onPress={cyclePattern}>
          <Text
            style={{
              fontSize: 14,
              color: isActive ? colors.textMuted : colors.accent,
              fontWeight: '500',
            }}
          >
            {pattern.name}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Main content */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View entering={FadeInDown.duration(800).delay(200)}>
          <BreathingCircle
            pattern={pattern}
            isActive={isActive}
            onPhaseChange={handlePhaseChange}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={{ marginTop: 48, alignItems: 'center' }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '300',
              color: colors.text,
              height: 28,
            }}
          >
            {phase}
          </Text>
          {!isActive && (
            <Text
              style={{
                fontSize: 14,
                color: colors.textMuted,
                marginTop: 8,
              }}
            >
              {pattern.description}
            </Text>
          )}
        </Animated.View>
      </View>

      {/* Bottom button */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(600)}
        style={{
          paddingHorizontal: 24,
          paddingBottom: 32,
        }}
      >
        <Pressable
          onPress={toggleActive}
          style={{
            backgroundColor: isActive ? colors.warmSoft : colors.accent,
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: isActive ? colors.warm : '#FFFFFF',
            }}
          >
            {isActive ? 'Stop' : 'Begin'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
