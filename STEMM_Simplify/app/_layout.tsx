import { Stack, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemeProvider } from "../hooks/useAppTheme";

export default function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true);
  const navigationState = useRootNavigationState();

  // Simulate a quick boot-up sequence (replacing the old Firebase auth check)
  useEffect(() => {
    setTimeout(() => {
      setIsInitializing(false);
    }, 500); // 500ms delay to prevent visual flash
  }, []);

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
          name="RegisterScreen"
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
