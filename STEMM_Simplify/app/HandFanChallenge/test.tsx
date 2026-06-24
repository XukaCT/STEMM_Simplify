import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { Video as ExpoVideo, ResizeMode } from "expo-av";
import {
    CameraView,
    useCameraPermissions,
    useMicrophonePermissions,
} from "expo-camera";
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
import React, { useRef, useState } from "react";
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

  // Rewatch Modal State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentPlayUri, setCurrentPlayUri] = useState<string | null>(null);

  // CUSTOM CAMERA STATE
  const cameraRef = useRef<CameraView>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

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

  // OPENS THE CUSTOM IN-APP CAMERA WITH PROTRACTOR OVERLAY
  const handleOpenCamera = async () => {
    if (!camPermission?.granted) {
      const camReq = await requestCamPermission();
      if (!camReq.granted) {
        Alert.alert("Permission Needed", "Camera access is required.");
        return;
      }
    }
    if (!micPermission?.granted) {
      const micReq = await requestMicPermission();
      if (!micReq.granted) {
        Alert.alert("Permission Needed", "Microphone access is required.");
        return;
      }
    }
    setIsCameraOpen(true);
  };

  // HANDLES THE ACTUAL VIDEO RECORDING PROCESS
  const toggleRecording = async () => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      try {
        const video = await cameraRef.current?.recordAsync({ maxDuration: 15 });
        if (video) {
          setTempVideoUri(video.uri);
          setIsCameraOpen(false);
          Alert.alert(
            "Success",
            "Video recorded! Click 'Save Result' to attach it.",
          );
        }
      } catch (e) {
        console.error("Recording failed:", e);
        Alert.alert("Error", "Failed to record video.");
        setIsRecording(false);
      }
    }
  };

  const handleSaveResult = async () => {
    if (!fanDesign || !bendAngle) {
      Alert.alert(
        "Missing Details",
        "Please enter a fan design name and bend angle.",
      );
      return;
    }

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
        "Click 'Save Result' to attach your recorded video before completing.",
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
      await AsyncStorage.setItem("@temp_handfan_data", JSON.stringify(results));
      router.replace({
        pathname: "/HandFanChallenge/handFanResult",
        params: { startTime: (startTime as string) || Date.now().toString() },
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
            onPress={handleOpenCamera}
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
                <View>
                  <Text style={styles.resultDesign}>{item.design}</Text>
                  <Text style={styles.resultMeta}>{item.phase}</Text>
                  <Text style={styles.resultMeta}>
                    Distance: {item.distance}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Text style={styles.resultAngle}>{item.angle}</Text>
                  {item.videoUri && (
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentPlayUri(item.videoUri!);
                        setIsPlayingVideo(true);
                      }}
                    >
                      <Play size={22} color="#0284C7" fill="#0284C7" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => handleDeleteResult(item.id)}>
                    <Trash2 size={22} color="#EF4444" />
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

      {/* REWATCH MODAL */}
      <Modal
        visible={isPlayingVideo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPlayingVideo(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              zIndex: 10,
              padding: 8,
            }}
            onPress={() => {
              setIsPlayingVideo(false);
              setCurrentPlayUri(null);
            }}
          >
            <X size={32} color="#fff" />
          </TouchableOpacity>
          {currentPlayUri && (
            <ExpoVideo
              source={{ uri: currentPlayUri }}
              style={{ width: "100%", height: "80%" }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
            />
          )}
        </View>
      </Modal>

      {/* 🚀 NEW CUSTOM CAMERA MODAL WITH PROTRACTOR OVERLAY 🚀 */}
      <Modal
        visible={isCameraOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsCameraOpen(false)}
      >
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            mode="video"
            facing="back"
          >
            {/* THE PROTRACTOR RULER OVERLAY */}
            <View style={styles.protractorOverlay} pointerEvents="none">
              <View style={styles.alignmentBox} />
              <Text style={styles.alignmentText}>Align Paper Hinge Here</Text>

              <View style={styles.pivotPoint} />

              {/* Renders the angled lines spreading out from the pivot */}
              {Array.from({ length: 18 }, (_, i) => i * 10).map((angle) => (
                <View
                  key={angle}
                  style={[
                    styles.angleLineContainer,
                    { transform: [{ rotate: `-${angle}deg` }] },
                  ]}
                >
                  <View style={styles.angleLineTransparent} />
                  <View
                    style={[
                      styles.angleLine,
                      angle === 0 ? styles.zeroDegreeLine : {},
                    ]}
                  >
                    <Text
                      style={[
                        styles.angleLabel,
                        { transform: [{ rotate: `${angle}deg` }] },
                      ]}
                    >
                      {angle}°
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* CAMERA CONTROLS */}
            <View style={styles.cameraControlsContainer}>
              <TouchableOpacity
                style={styles.cameraCloseBtn}
                onPress={() => setIsCameraOpen(false)}
              >
                <X size={28} color="#FFF" />
              </TouchableOpacity>

              {isRecording && (
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>REC</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={toggleRecording}
                style={styles.recordOuterCircle}
              >
                <View
                  style={
                    isRecording ? styles.recordSquare : styles.recordInnerCircle
                  }
                />
              </TouchableOpacity>
            </View>
          </CameraView>
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

  // --- NEW CAMERA OVERLAY STYLES ---
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  protractorOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center" },
  alignmentBox: {
    position: "absolute",
    top: 100,
    width: 60,
    height: 20,
    borderWidth: 2,
    borderColor: "#10B981",
    borderStyle: "dashed",
  },
  alignmentText: {
    position: "absolute",
    top: 125,
    color: "#10B981",
    fontSize: 12,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 4,
  },
  pivotPoint: {
    position: "absolute",
    top: 145,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF5A00",
    zIndex: 10,
  },

  // Angle Ruler Math: Pivot at top: 150. Container spans -100 to 400.
  angleLineContainer: {
    position: "absolute",
    top: -100,
    width: 2,
    height: 500,
  },
  angleLineTransparent: { width: 2, height: 250 }, // Invisible top half
  angleLine: {
    width: 2,
    height: 250,
    backgroundColor: "rgba(255, 90, 0, 0.4)",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  zeroDegreeLine: { backgroundColor: "rgba(16, 185, 129, 0.6)" },
  angleLabel: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 14,
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowRadius: 4,
    textShadowOffset: { width: 1, height: 1 },
  },

  // Camera Controls
  cameraControlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    alignItems: "center",
  },
  cameraCloseBtn: {
    position: "absolute",
    top: -600,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  recordingIndicator: {
    position: "absolute",
    top: -550,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    marginRight: 8,
  },
  recordingText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  recordOuterCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  recordInnerCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EF4444",
  },
  recordSquare: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#EF4444",
  },
});
