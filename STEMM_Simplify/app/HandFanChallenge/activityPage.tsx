import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { Video as ExpoVideo, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  Paperclip,
  Play,
  Save,
  Trash2,
  Video as VideoIcon,
  Wind,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveVideoLocally } from "../../utils/localStore";

export default function ActivityPage() {
  const [activePhase, setActivePhase] = useState(1);
  const [fanDesign, setFanDesign] = useState("");
  const [bendAngle, setBendAngle] = useState("");
  const [distance, setDistance] = useState(30);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { startTime } = params;

  const [tempVideoUri, setTempVideoUri] = useState<string | null>(null);

  // Rewatch Player State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentPlayUri, setCurrentPlayUri] = useState<string | null>(null);

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

  const openVideo = (uri: string) => {
    setCurrentPlayUri(uri);
    setIsPlayingVideo(true);
  };

  const closeVideo = () => {
    setIsPlayingVideo(false);
    setCurrentPlayUri(null);
  };

  const handleRecordAndSave = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraStatus.status !== "granted") {
      Alert.alert("Permission Needed", "Camera is required.");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setTempVideoUri(uri);
        Alert.alert(
          "Success",
          "Video recorded! Click 'Save Result' to attach it to this test.",
        );
      }
    } catch (error) {
      console.error("Error recording video:", error);
      Alert.alert("Error", "Something went wrong while recording the video.");
    }
  };

  const handleSaveResult = async () => {
    if (!fanDesign || !bendAngle) {
      Alert.alert(
        "Missing Details",
        "Please enter a fan design name and bend angle before saving.",
      );
      return;
    }

    // Save video locally ONE AT A TIME to prevent lagging!
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
    setTempVideoUri(null);
  };

  const handleDeleteResult = (id: string) => {
    setResults(results.filter((item) => item.id !== id));
  };

  const handleComplete = async () => {
    if (tempVideoUri) {
      Alert.alert(
        "Unsaved Video",
        "You recorded a video but haven't saved it. Click 'Save Result' to attach it before completing.",
      );
      return;
    }

    if (results.length === 0) {
      Alert.alert(
        "Missing Data",
        "Please test a fan design and click 'Save Result' before continuing.",
      );
      return;
    }

    const hasAtLeastOneVideo = results.some((item) => item.videoUri);
    if (!hasAtLeastOneVideo) {
      Alert.alert(
        "Missing Video",
        "Please record at least one video showing your fan design in action!",
      );
      return;
    }

    try {
      // Pass data safely via AsyncStorage
      await AsyncStorage.setItem("@temp_handfan_data", JSON.stringify(results));

      // USE REPLACE: Prevents the user from ever hitting the back button to return here!
      router.replace({
        pathname: "/HandFanChallenge/handFanResult",
        params: {
          startTime: (startTime as string) || Date.now().toString(),
        },
      });
    } catch (e) {
      console.error("Routing error:", e);
      Alert.alert("Error", "Could not navigate to the results page.");
    }
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
            {activePhase === 1
              ? "Phase 1: Paper Fan Designs"
              : "Phase 2: Material Upgrades"}
          </Text>
          <Text style={styles.instructionBody}>
            {activePhase === 1
              ? "Try different fan fold patterns using paper and measure the bend angle."
              : "Modify your design using stiffer materials to see how structural integrity affects air pressure."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Fan Design</Text>
          <TextInput
            style={styles.input}
            value={fanDesign}
            onChangeText={setFanDesign}
            placeholder={
              activePhase === 1 ? "e.g. Accordion Fold" : "e.g. Cardboard Base"
            }
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
            <VideoIcon size={20} color={tempVideoUri ? "#10B981" : "#ccc"} />
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
                  </View>

                  {/* REWATCH BUTTON */}
                  {item.videoUri && (
                    <TouchableOpacity
                      onPress={() => openVideo(item.videoUri!)}
                      style={styles.iconButton}
                    >
                      <Play size={20} color="#0284C7" fill="#0284C7" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => handleDeleteResult(item.id)}
                    style={styles.iconButton}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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

      {/* REWATCH MODAL */}
      <Modal
        visible={isPlayingVideo}
        transparent={true}
        animationType="fade"
        onRequestClose={closeVideo}
      >
        <View style={styles.modalBackground}>
          <View style={styles.videoPlayerContainer}>
            <TouchableOpacity
              style={styles.closeVideoButton}
              onPress={closeVideo}
            >
              <X size={28} color="#fff" />
            </TouchableOpacity>
            {currentPlayUri && (
              <ExpoVideo
                source={{ uri: currentPlayUri }}
                style={styles.fullVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            )}
          </View>
        </View>
      </Modal>
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
  resultDetails: { flex: 1 },
  resultRightContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  resultScoreContainer: { alignItems: "flex-end", marginRight: 8 },
  iconButton: { padding: 8, backgroundColor: "#E5E7EB", borderRadius: 8 },
  resultDesign: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
    marginBottom: 4,
  },
  resultMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  resultAngle: { fontSize: 22, fontWeight: "bold", color: "#FF6B00" },
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

  // Rewatch Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayerContainer: {
    width: "100%",
    height: 500,
    backgroundColor: "#000",
    position: "relative",
  },
  closeVideoButton: {
    position: "absolute",
    top: -50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  fullVideo: { width: "100%", height: "100%" },
});
