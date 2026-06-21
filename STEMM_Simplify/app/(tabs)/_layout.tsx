import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        // Styling the bottom tab bar
        // @ts-ignore
        safeAreaInsets: { top: 0, bottom: 0 },
        sceneContainerStyle: { backgroundColor: "#000000" },
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 0,
          height: 60,
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarActiveTintColor: "#FF5A00",
        tabBarInactiveTintColor: "#666666",
        headerShown: false,
        position: "absolute",
        bottom: 0,
      }}
    >
      {/* Dashboard Tab */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Video Hub Tab */}
      <Tabs.Screen
        name="video"
        options={{
          title: "STEMM Hub",
          tabBarIcon: ({ color }) => (
            <Ionicons name="videocam-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

