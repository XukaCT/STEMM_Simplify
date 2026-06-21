import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StartupScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const handleStart = () => {
    setLoading(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* BRANDING SECTION */}
      <View style={[styles.brandContainer, { paddingTop: insets.top + 100 }]}>
        <View style={styles.iconCircle}>
          <Ionicons name="flask" size={60} color="#FFF" />
        </View>
        <Text style={styles.title}>STEMM Lab</Text>
        <Text style={styles.subtitle}>
          Real-world science and engineering experiments in your pocket.
        </Text>
      </View>

      {/* ACTION CARD SECTION */}
      <View style={[styles.authCard, { paddingBottom: insets.bottom + 40 }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={handleStart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Get Started</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  brandContainer: { flex: 1, alignItems: "center", paddingHorizontal: 40 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF5A00",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#FF5A00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  title: { fontSize: 36, fontWeight: "900", color: "#FFF", letterSpacing: 1 },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  authCard: {
    backgroundColor: "#111214",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 30,
    minHeight: 200,
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#FF5A00",
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
