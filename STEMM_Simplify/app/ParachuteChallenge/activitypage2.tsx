import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ParachuteAdjustment() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 1. UNPACK EVERYTHING FROM PAGE 1
  // We grab the height, time, start time, AND the video recorded on the previous screen!
  const { startTime, heightNo, timeNo, videoNoUri } = params;

  // State for user inputs on THIS page
  const [dropHeight, setDropHeight] = useState("");
  const [fallTime, setFallTime] = useState("");
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const recordVideo = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPermission.status !== "granted") {
      Alert.alert(
        "Permission Needed",
        "We need camera access to record your experiment!",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false, // MUST BE FALSE for Android 13+
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      setVideoUri(localUri);
      Alert.alert(
        "Success",
        "Video recorded! It will be saved when you submit your results.",
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      edges={["top", "bottom"]}
    >
      {/* Black Header Area */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.headerTitle}>With Toy Adjustment</Text>
            <Text style={styles.headerSubtitle}>
              Drop 2: Parachute attached — same height
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            🪂 Attach your parachute to the toy. Drop it from the{" "}
            <Text style={{ fontWeight: "bold" }}>same height</Text> as before.
            Record the height and time.
          </Text>
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>Enter Your Measurements</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Drop Height <Text style={styles.unitText}>(metres)</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={dropHeight}
              onChangeText={setDropHeight}
              keyboardType="decimal-pad"
              placeholder="e.g. 1.50"
              placeholderTextColor="#CCC"
              returnKeyType="done"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Fall Time <Text style={styles.unitText}>(seconds)</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              value={fallTime}
              onChangeText={setFallTime}
              keyboardType="decimal-pad"
              placeholder="e.g. 1.20"
              placeholderTextColor="#CCC"
              returnKeyType="done"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={recordVideo}
          activeOpacity={0.7}
        >
          <Ionicons name="videocam" size={24} color="#00A2D9" />
          <Text style={styles.recordButtonText}>Record Impact Video</Text>
          {videoUri && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="green"
              style={{ marginLeft: 10 }}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.resultsButton}
          activeOpacity={0.8}
          onPress={() => {
            if (!dropHeight || !fallTime) {
              Alert.alert(
                "Missing Data",
                "Please enter height and time first.",
              );
              return;
            }

            // 2. PACK EVERYTHING FOR THE RESULTS PAGE
            router.push({
              pathname: "./result",
              params: {
                heightNo: heightNo,
                timeNo: timeNo,
                heightWith: dropHeight,
                timeWith: fallTime,
                startTime: startTime,
                videoNoUri: videoNoUri, // From Page 1
                videoWithUri: videoUri, // From THIS Page (Page 2)
              },
            });
          }}
        >
          <Text style={styles.resultsButtonText}>See Results</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  backButton: { marginBottom: 20 },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  headerSubtitle: { color: "#999", fontSize: 14, marginTop: 4 },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#F7F8FA",
    flexGrow: 1,
  },
  alertBox: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  alertText: { color: "#2E7D32", fontSize: 14, lineHeight: 20 },
  whiteCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: "#666", marginBottom: 8 },
  unitText: { color: "#999" },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 18,
    fontSize: 18,
    color: "#333",
    backgroundColor: "#FFF",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#FFF",
  },
  resultsButton: {
    backgroundColor: "#00A2D9",
    borderRadius: 15,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#00A2D9",
    borderRadius: 12,
    padding: 15,
    borderStyle: "dashed",
  },
  recordButtonText: {
    color: "#00A2D9",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
});
