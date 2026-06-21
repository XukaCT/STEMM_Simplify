import { Directory, Paths } from "expo-file-system/next"; // <-- Using the new API
import { Stack, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemeProvider } from "../hooks/useAppTheme";

// Define the exact names of your 7 activity folders
const REQUIRED_FOLDERS = [
  "parachute",
  "sound",
  "handfan",
  "earthquake",
  "human_performance",
  "reaction",
  "breathing",
];

export default function RootLayout() {
  const [isInitializing, setIsInitializing] = useState(true);
  const navigationState = useRootNavigationState();

  useEffect(() => {
    const initializeApp = () => {
      try {
        // Loop through and pre-make every folder using the new Object-Oriented API
        for (const folder of REQUIRED_FOLDERS) {
          const dir = new Directory(Paths.document, folder);

          if (!dir.exists) {
            console.log(`Pre-making folder on boot: ${folder}`);
            dir.create(); // This is now synchronous and lightning fast!
          }
        }
      } catch (error) {
        console.error("Failed to setup local folders during boot:", error);
      } finally {
        // Give the UI a tiny buffer to prevent visual flashing, then drop the loading screen
        setTimeout(() => setIsInitializing(false), 300);
      }
    };

    initializeApp();
  }, []);

  // Show the loading spinner while creating folders and preparing routing
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
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            // Forces the hidden background behind screens to be black
            contentStyle: { backgroundColor: "#000" },
          }}
        >
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
    </View>
  );
}
