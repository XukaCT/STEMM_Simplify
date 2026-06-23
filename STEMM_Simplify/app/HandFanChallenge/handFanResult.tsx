import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  Paperclip,
  Save,
  Video,
  Wind,
} from "lucide-react-native";
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

export default function ActivityPage() {
  const [activePhase, setActivePhase] = useState(1);
  const [fanDesign, setFanDesign] = useState("");
  const [bendAngle, setBendAngle] = useState("");
  const [distance, setDistance] = useState(30);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { startTime } = params;

  const handleRecordAndSave = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const libraryStatus = await MediaLibrary.requestPermissionsAsync();
    if (
      cameraStatus.status !== "granted" ||
      libraryStatus.status !== "granted"
    ) {
      Alert.alert(
        "Permission Needed",
        "Camera and Gallery permissions are required to save videos.",
      );
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["videos"], // Updated to avoid deprecated warning
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert("Success", "Video saved to your camera roll!");
      }
    } catch (error) {
      console.error("Error recording or saving video:", error);
      Alert.alert("Error", "Something went wrong while saving the video.");
    }
  };

  const [results, setResults] = useState<
    {
      id: string;
      design: string;
      phase: string;
      distance: string;
      angle: string;
    }[]
  >([]);

  const handleSaveResult = () => {
    if (!fanDesign || !bendAngle) return;
    const newResult = {
      id: Date.now().toString(),
      design: fanDesign,
      phase: `Phase ${activePhase}`,
      distance: `${distance}cm`,
      angle: `${bendAngle}°`,
    };
    setResults([newResult, ...results]);
    setFanDesign("");
    setBendAngle("");
  };

  const handleComplete = () => {
    router.push({
      pathname: "/HandFanChallenge/handFanResult",
      params: {
        // SECURE ROUTING: encode the JSON so special characters don't break the navigation
        results: encodeURIComponent(JSON.stringify(results)),
        startTime: startTime as string,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hand Fan Challenge</Text>
        <Text style={styles.headerSubtitle}>Physics - Air Movement</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activePhase === 1 ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={() => setActivePhase(1)}
          >
            <Wind size={18} color={activePhase === 1 ? "#fff" : "#666"} />
            <Text
              style={[
                styles.toggleText,
                activePhase === 1
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              Phase 1
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activePhase === 2 ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={() => setActivePhase(2)}
          >
            <Paperclip size={18} color={activePhase === 2 ? "#fff" : "#666"} />
            <Text
              style={[
                styles.toggleText,
                activePhase === 2
                  ? styles.toggleTextActive
                  : styles.toggleTextInactive,
              ]}
            >
              Phase 2
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>
            Phase 1: Paper Fan Designs
          </Text>
          <Text style={styles.instructionBody}>
            Try different fan fold patterns using paper and measure the bend
            angle.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Fan Design</Text>
          <TextInput
            style={styles.input}
            value={fanDesign}
            onChangeText={setFanDesign}
            placeholder="e.g. 123"
          />
          <Text style={styles.label}>Distance: {distance}cm</Text>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={45}
            step={5}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor="#FF6B00"
            maximumTrackTintColor="#EFEFEF"
            thumbTintColor="#FF6B00"
          />
          <View style={styles.rulerContainer}>
            <Text style={styles.rulerText}>15cm</Text>
            <Text style={styles.rulerText}>30cm</Text>
            <Text style={styles.rulerText}>45cm</Text>
          </View>
          <Text style={styles.label}>Bend Angle (degrees)</Text>
          <TextInput
            style={[styles.input, styles.largeInput]}
            value={bendAngle}
            onChangeText={setBendAngle}
            keyboardType="numeric"
            placeholder="0"
          />
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleRecordAndSave}
          >
            <Video size={20} color="#ccc" />
            <Text style={styles.recordButtonText}>Record Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveResult}
          >
            <Save size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Result</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Results</Text>
          {results.length === 0 ? (
            <Text style={styles.emptyText}>
              No results saved yet. Run a test and click Save!
            </Text>
          ) : (
            results.map((item) => (
              <View key={item.id} style={styles.resultItem}>
                <View>
                  <Text style={styles.resultDesign}>{item.design}</Text>
                  <Text style={styles.resultMeta}>{item.phase}</Text>
                  <Text style={styles.resultMeta}>
                    Distance: {item.distance}
                  </Text>
                </View>
                <Text style={styles.resultAngle}>{item.angle}</Text>
              </View>
            ))
          )}
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Understanding Air Movement</Text>
          <Text style={styles.infoBody}>
            Air movement creates pressure differences that can move or bend
            objects. Fans work by pushing air particles forward, creating wind.
            The strength of the air movement depends on fan design, distance,
            and surface area.
          </Text>
          <Text style={styles.infoSubTitle}>Key Factors:</Text>
          <Text style={styles.infoBullet}>
            • Larger fan surface = more air pushed
          </Text>
          <Text style={styles.infoBullet}>
            • Accordion folds create turbulent airflow
          </Text>
          <Text style={styles.infoBullet}>
            • Closer distance = stronger air pressure
          </Text>
          <Text style={styles.infoBullet}>
            • Stiffer paper bends less than flexible paper
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <CheckCircle2 size={20} color="#fff" />
          <Text style={styles.completeButtonText}>Complete Activity</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  header: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: { marginBottom: 15 },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerSubtitle: { color: "#aaa", fontSize: 14, marginTop: 4 },
  scrollContent: { backgroundColor: "#fff", padding: 16, paddingBottom: 100 },
  toggleContainer: { flexDirection: "row", gap: 12, marginBottom: 16 },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  toggleActive: { backgroundColor: "#FF6B00" },
  toggleInactive: { backgroundColor: "#F5F5F5" },
  toggleText: { fontWeight: "600", fontSize: 15 },
  toggleTextActive: { color: "#fff" },
  toggleTextInactive: { color: "#666" },
  instructionCard: {
    backgroundColor: "#FFF4EA",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE4C4",
    marginBottom: 16,
  },
  instructionTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  instructionBody: { color: "#555", fontSize: 14, lineHeight: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    marginBottom: 16,
  },
  label: { fontSize: 13, color: "#666", marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  largeInput: { fontSize: 18, paddingVertical: 12 },
  slider: { width: "100%", height: 40, marginTop: -5 },
  rulerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 4,
    marginTop: -5,
  },
  rulerText: { fontSize: 11, color: "#999" },
  recordButton: {
    backgroundColor: "#2A2A2A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  recordButtonText: { color: "#ccc", fontWeight: "600", fontSize: 15 },
  saveButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultDesign: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
    marginBottom: 4,
  },
  resultMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  resultAngle: { fontSize: 22, fontWeight: "bold", color: "#FF6B00" },
  infoBox: {
    backgroundColor: "#F0F7FF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDF0FF",
  },
  infoTitle: {
    color: "#1E40AF",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  infoBody: {
    color: "#1E40AF",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoSubTitle: {
    color: "#1E40AF",
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 6,
  },
  infoBullet: { color: "#1E40AF", fontSize: 13, lineHeight: 20, marginLeft: 8 },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  completeButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
