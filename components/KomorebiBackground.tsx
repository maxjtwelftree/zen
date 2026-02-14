import { useEffect } from "react";
import { Dimensions, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../constants/useTheme";

const { width: SW, height: SH } = Dimensions.get("window");

// Leaf SVG paths — organic, asymmetric shapes
const leafPaths = [
  // Broad leaf
  "M50 0 C65 15, 85 40, 80 70 C75 90, 55 100, 50 100 C45 100, 25 90, 20 70 C15 40, 35 15, 50 0Z",
  // Narrow leaf
  "M50 0 C58 20, 70 50, 65 80 C60 95, 52 100, 50 100 C48 100, 40 95, 35 80 C30 50, 42 20, 50 0Z",
  // Maple-ish
  "M50 0 C60 10, 90 25, 85 45 C82 55, 70 55, 65 50 C75 70, 80 90, 65 95 C55 100, 50 95, 50 100 C50 95, 45 100, 35 95 C20 90, 25 70, 35 50 C30 55, 18 55, 15 45 C10 25, 40 10, 50 0Z",
  // Round leaf
  "M50 5 C70 5, 90 20, 92 45 C94 65, 80 85, 60 95 C50 100, 40 98, 30 90 C15 80, 5 60, 8 40 C10 20, 30 5, 50 5Z",
  // Long pointed leaf
  "M50 0 C55 25, 72 45, 68 65 C64 80, 55 95, 50 100 C45 95, 36 80, 32 65 C28 45, 45 25, 50 0Z",
];

interface LeafConfig {
  pathIndex: number;
  size: number;
  x: number;
  y: number;
  rot: number;
  driftX: number;
  driftY: number;
  driftRot: number;
  scaleRange: [number, number];
  opacityRange: [number, number];
  dur: number;
  delay: number;
  color: "komorebi1" | "komorebi2" | "komorebi3";
}

const leaves: LeafConfig[] = [
  {
    pathIndex: 0,
    size: 180,
    x: SW * 0.05,
    y: SH * 0.05,
    rot: 25,
    driftX: 40,
    driftY: 30,
    driftRot: 20,
    scaleRange: [1, 1.15],
    opacityRange: [0.6, 1],
    dur: 10000,
    delay: 0,
    color: "komorebi1",
  },
  {
    pathIndex: 1,
    size: 140,
    x: SW * 0.55,
    y: SH * 0.12,
    rot: -40,
    driftX: -35,
    driftY: 25,
    driftRot: -15,
    scaleRange: [0.95, 1.1],
    opacityRange: [0.5, 0.9],
    dur: 13000,
    delay: 1200,
    color: "komorebi2",
  },
  {
    pathIndex: 2,
    size: 200,
    x: SW * 0.15,
    y: SH * 0.35,
    rot: 60,
    driftX: 50,
    driftY: -35,
    driftRot: 18,
    scaleRange: [1, 1.2],
    opacityRange: [0.4, 0.85],
    dur: 15000,
    delay: 2500,
    color: "komorebi3",
  },
  {
    pathIndex: 3,
    size: 160,
    x: SW * 0.6,
    y: SH * 0.5,
    rot: -15,
    driftX: -30,
    driftY: -40,
    driftRot: -22,
    scaleRange: [0.9, 1.1],
    opacityRange: [0.5, 0.95],
    dur: 12000,
    delay: 800,
    color: "komorebi1",
  },
  {
    pathIndex: 4,
    size: 120,
    x: SW * 0.3,
    y: SH * 0.65,
    rot: 45,
    driftX: 35,
    driftY: 30,
    driftRot: 25,
    scaleRange: [1, 1.12],
    opacityRange: [0.5, 0.85],
    dur: 14000,
    delay: 3500,
    color: "komorebi2",
  },
  {
    pathIndex: 0,
    size: 150,
    x: SW * 0.7,
    y: SH * 0.75,
    rot: -55,
    driftX: -45,
    driftY: -25,
    driftRot: -12,
    scaleRange: [0.95, 1.15],
    opacityRange: [0.4, 0.8],
    dur: 11000,
    delay: 1800,
    color: "komorebi3",
  },
  {
    pathIndex: 1,
    size: 100,
    x: SW * 0.1,
    y: SH * 0.8,
    rot: 30,
    driftX: 25,
    driftY: -20,
    driftRot: 15,
    scaleRange: [1, 1.08],
    opacityRange: [0.45, 0.75],
    dur: 16000,
    delay: 4000,
    color: "komorebi1",
  },
];

function Leaf({ config }: { config: LeafConfig }) {
  const { colors } = useTheme();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(config.scaleRange[0]);
  const opacity = useSharedValue(config.opacityRange[0]);

  useEffect(() => {
    const ease = Easing.inOut(Easing.sin);

    translateX.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.driftX, { duration: config.dur, easing: ease }),
          withTiming(-config.driftX * 0.6, {
            duration: config.dur * 0.8,
            easing: ease,
          }),
        ),
        -1,
        true,
      ),
    );

    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.driftY, {
            duration: config.dur * 0.9,
            easing: ease,
          }),
          withTiming(-config.driftY * 0.7, {
            duration: config.dur * 1.1,
            easing: ease,
          }),
        ),
        -1,
        true,
      ),
    );

    rotate.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.driftRot, {
            duration: config.dur * 1.1,
            easing: ease,
          }),
          withTiming(-config.driftRot * 0.4, {
            duration: config.dur * 0.9,
            easing: ease,
          }),
        ),
        -1,
        true,
      ),
    );

    scale.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(config.scaleRange[1], {
          duration: config.dur * 1.3,
          easing: ease,
        }),
        -1,
        true,
      ),
    );

    opacity.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(config.opacityRange[1], {
          duration: config.dur * 0.8,
          easing: ease,
        }),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${config.rot + rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: config.x,
          top: config.y,
          width: config.size,
          height: config.size,
        },
        style,
      ]}
    >
      <Svg width={config.size} height={config.size} viewBox="0 0 100 100">
        <Path d={leafPaths[config.pathIndex]} fill={colors[config.color]} />
      </Svg>
    </Animated.View>
  );
}

export default function KomorebiBackground() {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      {leaves.map((config, i) => (
        <Leaf key={i} config={config} />
      ))}
    </View>
  );
}
