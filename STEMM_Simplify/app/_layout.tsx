import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";

import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemeProvider } from "../hooks/useAppTheme";

export default function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();


  // 2. HANDLE ROUTING (Where should they go?)
    useEffect(() => {
      if (isInitializing) return;
      if (!navigationState?.key) return;

      const rootSegment = segments[0] as string | undefined;
      const onAuthScreen = !rootSegment || rootSegment === "RegisterScreen";

      if (user) {
        // If logged in, send to dashboard
        if (onAuthScreen) {
          router.replace("/(tabs)/dashboard");
        }
      } else {
        // If not logged in, send to register
        if (rootSegment !== "RegisterScreen") {
          router.replace("/RegisterScreen");
        }
      }
    }, [user, isInitializing, navigationState, segments, router]);

  // Show the loading spinner while waiting for configurations
  if (isInitializing || !navigationState?.key) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#000", justifyContent: "center" }}
      >
        <ActivityIndicator size="large" color="#FF5A00" />
      </View>
    );
  }

  return (
    <ThemeProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ gestureEnabled: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="RegisterScreen" options={{ gestureEnabled: false }} />
    </Stack>
    </ThemeProvider>
  );
}

