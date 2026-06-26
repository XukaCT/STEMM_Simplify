import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../hooks/useAppTheme";

export default function SettingsScreen() {
  const { colors } = useAppTheme();

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.container}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Settings
        </Text>

        {/* --- LOGOUT BUTTON --- */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 25,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  borderBottom: { borderBottomWidth: 1 },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  rowText: { fontSize: 16, marginLeft: 15, fontWeight: "500" },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  logoutButton: {
    backgroundColor: "#00A2D9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  adBannerContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
  },
  dummyText: { color: "#AAAAAA", fontSize: 12, fontWeight: "bold" },
});
