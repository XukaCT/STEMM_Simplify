import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StartupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/dashboard");
    }, 300);
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
      <View style={[styles.authCard, { paddingBottom: insets.bottom + 20 }]}>
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

        {/* ABOUT & PRIVACY BUTTON */}
        <TouchableOpacity
          style={styles.aboutButton}
          activeOpacity={0.7}
          onPress={() => setShowAbout(true)}
        >
          <Text style={styles.aboutButtonText}>
            About, Privacy & Disclaimer
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODERN SWIPE-DOWN MODAL */}
      <Modal
        visible={showAbout}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAbout(false)}
        onDismiss={() => setShowAbout(false)}
      >
        <View style={styles.modalContainer}>
          {/* Visual Drag Indicator */}
          <View style={styles.dragHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>About STEMM Lab</Text>
            <TouchableOpacity
              onPress={() => setShowAbout(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* ABOUT SECTION */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>About</Text>
              <Text style={styles.modalText}>
                Brought to you by La Trobe University and Nguyen Sang (XukaCT)
                and supervised by TonyLatrobe.
              </Text>
              <Text style={styles.modalText}>
                Developed as part of an assessment.
              </Text>
              <Text style={styles.modalText}>
                Distributed under the MIT License.
              </Text>
              <Text
                style={[
                  styles.modalText,
                  { fontWeight: "bold", color: "#DC2626", marginTop: 8 },
                ]}
              >
                Children to be supervised at all times.
              </Text>
            </View>

            {/* PRIVACY SECTION */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Privacy Policy</Text>
              <Text style={styles.modalText}>
                This app does not collect, store, transmit, or sell personal
                information.
              </Text>
              <Text style={[styles.modalText, { marginTop: 8 }]}>
                The app may temporarily store the following data locally on your
                device only:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>
                  • Microphone data is stored locally only and can be deleted
                  within the app.
                </Text>
                <Text style={styles.bulletItem}>
                  • Video/camera data is stored locally only and can be deleted
                  within the app.
                </Text>
                <Text style={styles.bulletItem}>
                  • File storage is used only within the app.
                </Text>
              </View>
              <Text style={[styles.modalText, { marginTop: 8 }]}>
                This data remains on your device and is not shared with us or
                with any third party. The app does not use ads.
              </Text>
            </View>

            {/* DISCLAIMER SECTION */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Disclaimer</Text>
              <Text style={styles.modalText}>
                This app is provided for informational and educational purposes
                only. Use at your own risk. Children should use the app only
                under adult supervision. Please use caution when handling any
                physical materials, including scissors.
              </Text>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  brandContainer: { flex: 1, alignItems: "center", paddingHorizontal: 40 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#00A2D9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#00A2D9",
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
    backgroundColor: "black",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 30,
    minHeight: 180,
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#00A2D9",
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  primaryButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  aboutButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  aboutButtonText: {
    color: "#6B7280",
    fontSize: 13,
    textDecorationLine: "underline",
  },

  // MODERN MODAL STYLES
  modalContainer: {
    flex: 1,
    backgroundColor: "#111", // Dark sheet background
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#444",
    alignSelf: "center",
    marginTop: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  closeButtonText: {
    color: "#00A2D9",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalScroll: {
    padding: 20,
  },
  modalSection: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalSectionTitle: {
    color: "#00A2D9",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modalText: {
    color: "#D1D5DB",
    fontSize: 14,
    lineHeight: 22,
  },
  bulletList: {
    marginTop: 8,
    paddingLeft: 4,
  },
  bulletItem: {
    color: "#D1D5DB",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
});
