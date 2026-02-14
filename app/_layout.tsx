import { Platform, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../constants/useTheme";

function MobileFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") return <>{children}</>;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#E8E8E8",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 390,
          height: 844,
          borderRadius: 40,
          overflow: "hidden",
          backgroundColor: "#F5F3F0",
          // Phone bezel shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function RootLayout() {
  const { colors, isDark } = useTheme();

  return (
    <MobileFrame>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: "fade",
        }}
      />
    </MobileFrame>
  );
}
