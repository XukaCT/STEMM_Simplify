import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  Paperclip,
  Save,
  Trash2,
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

// IMPORT OFFLINE STORAGE
import { saveVideoLocally } from "../../utils/localStore";

export default function ActivityPage() {
  const [activePhase, setActivePhase] = useState(1);
  const [fanDesign, setFanDesign] = useState("");
  const [bendAngle, setBendAngle] = useState("");
  const [distance, setDistance] = useState(30);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { startTime } = params;

  // Temporarily hold the recorded video before saving the result row
  const [tempVideoUri, setTempVideoUri] = useState<string | null>(null);

  const [results, setResults] = useState<
    {
      id: string;
      design: string;
      phase: string;
      distance: string;
      angle: string;
      videoUri?: string | null;
    }[]
  >([]);

  const handleRecordAndSave = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraStatus.status !== "granted") {
      Alert.alert(
        "Permission Needed",
        "Camera permission is required to record videos.",
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["videos"],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        // Queue the video!
        setTempVideoUri(uri);
        Alert.alert(
          "Success",
          "Video recorded! Fill in the form and click 'Save Result' to attach it to this test.",
        );
      }
    } catch (error) {
      console.error("Error recording video:", error);
      Alert.alert("Error", "Something went wrong while recording the video.");
    }
  };

  const handleSaveResult = async () => {
    if (!fanDesign || !bendAngle) return;

    // If a video was queued, save it permanently to the local folder immediately
    let permanentUri = null;
    if (tempVideoUri) {
      permanentUri = await saveVideoLocally(
        tempVideoUri,
        `handfan_test_${Date.now()}.mp4`,
        "handfan",
      );
    }

    const newResult = {
      id: Date.now().toString(),
      design: fanDesign,
      phase: `Phase ${activePhase}`,
      distance: `${distance}cm`,
      angle: `${bendAngle}°`,
      videoUri: permanentUri,
    };

    setResults([newResult, ...results]);
    setFanDesign("");
    setBendAngle("");
    setTempVideoUri(null); // Clear the queue for the next test
  };

  // NEW: Delete a specific result from the list
  const handleDeleteResult = (id: string) => {
    setResults(results.filter((item) => item.id !== id));
  };

  const handleComplete = () => {
    router.push({
      pathname: "/HandFanChallenge/handFanResult",
      params: {
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
            placeholder="e.g. Accordion Fold"
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
            style={[
              styles.recordButton,
              tempVideoUri && {
                borderColor: "#10B981",
                backgroundColor: "#F0FDF4",
              },
            ]}
            onPress={handleRecordAndSave}
          >
            <Video size={20} color={tempVideoUri ? "#10B981" : "#ccc"} />
            <Text
              style={[
                styles.recordButtonText,
                tempVideoUri && { color: "#10B981" },
              ]}
            >
              {tempVideoUri
                ? "Video Queued! (Click Save Result)"
                : "Record Video"}
            </Text>
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
                <View style={styles.resultDetails}>
                  <Text style={styles.resultDesign}>{item.design}</Text>
                  <Text style={styles.resultMeta}>{item.phase}</Text>
                  <Text style={styles.resultMeta}>
                    Distance: {item.distance}
                  </Text>
                </View>

                <View style={styles.resultRightContent}>
                  <View style={styles.resultScoreContainer}>
                    <Text style={styles.resultAngle}>{item.angle}</Text>
                    {item.videoUri && (
                      <Video
                        size={16}
                        color="#10B981"
                        style={{ marginTop: 4 }}
                      />
                    )}
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => handleDeleteResult(item.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
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
    borderWidth: 2,
    borderColor: "#2A2A2A",
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
  resultDetails: {
    flex: 1,
  },
  resultRightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  resultScoreContainer: {
    alignItems: "flex-end",
  },
  deleteButton: {
    padding: 6,
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
