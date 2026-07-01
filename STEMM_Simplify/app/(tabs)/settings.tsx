import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LogOut, Trash2 } from "lucide-react-native";
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
import TabHeader from "../../components/shared/TabHeader";

export default function SettingsScreen() {
  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out and return to the start screen?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            router.replace("/");
          },
        },
      ],
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete All Data",
      "Are you sure you want to delete ALL recorded experiments, videos, and data logs? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            try {
              // This wipes all offline data (Feed, Team Info, Temp Data) instantly
              await AsyncStorage.clear();

              Alert.alert("Success", "All scientific data has been erased.");
            } catch (error) {
              Alert.alert("Error", "Could not delete data.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* UNIFIED HEADER */}
      <TabHeader title="Settings" subtitle="App & Data Management" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* DATA MANAGEMENT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <Text style={styles.sectionDescription}>
            Manage your local offline data and device storage. Use this to reset
            the app for a new class or team.
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            activeOpacity={0.8}
            onPress={handleDeleteAll}
          >
            <Trash2 size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Delete All Data Logs</Text>
          </TouchableOpacity>
        </View>

        {/* SESSION SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session</Text>
          <Text style={styles.sectionDescription}>
            Leave your current session without deleting the saved offline data.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Log Out / Switch Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 18,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#EF4444", // Danger Red
  },
  logoutButton: {
    backgroundColor: "#00A2D9", // Brand Blue
  },
});
