import { Ionicons } from "@expo/vector-icons";
import { Video as ExpoVideo, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function ParachuteAdjustment() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { startTime, heightNo, timeNo, videoNoUri } = params;

  const [dropHeight, setDropHeight] = useState("");
  const [fallTime, setFallTime] = useState("");
  const [videoUri, setVideoUri] = useState<string | null>(null);

  // Video Analyzer State
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [currentPos, setCurrentPos] = useState(0);
  const [startMarker, setStartMarker] = useState<number | null>(null);
  const [endMarker, setEndMarker] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const recordVideo = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== "granted") {
      Alert.alert("Permission Needed", "We need camera access to record!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
      setStartMarker(null);
      setEndMarker(null);
      setIsZoomed(false);
      setShowAnalyzer(true);
    }
  };

  const calculatedTime =
    startMarker !== null && endMarker !== null
      ? Math.max(0, (endMarker - startMarker) / 1000).toFixed(2)
      : "0.00";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "black" }}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.headerTitle}>With Parachute</Text>
            <Text style={styles.headerSubtitle}>
              Drop 2: Measure the difference
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
            🪂 Attach your parachute. Drop it from the{" "}
            <Text style={{ fontWeight: "bold" }}>same height</Text>. Record the
            video and use the analyzer to find the new fall time!
          </Text>
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitle}>Measurements</Text>

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
              color="#10B981"
              style={{ marginLeft: 10 }}
            />
          )}
        </TouchableOpacity>

        {videoUri && (
          <TouchableOpacity
            style={[
              styles.recordButton,
              { marginTop: 12, borderColor: "#10B981" },
            ]}
            onPress={() => setShowAnalyzer(true)}
          >
            <Ionicons name="analytics" size={24} color="#10B981" />
            <Text style={[styles.recordButtonText, { color: "#10B981" }]}>
              Open Video Analyzer
            </Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 100 }} />
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
            router.push({
              pathname: "./result",
              params: {
                heightNo: heightNo,
                timeNo: timeNo,
                heightWith: dropHeight,
                timeWith: fallTime,
                startTime: startTime,
                videoNoUri: videoNoUri,
                videoWithUri: videoUri,
              },
            });
          }}
        >
          <Text style={styles.resultsButtonText}>See Results</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* VIDEO ANALYZER MODAL */}
      {/* VIDEO ANALYZER MODAL */}
      <Modal
        visible={showAnalyzer}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.analyzerContainer}>
          {/* FIXED HEADER */}
          <View style={styles.analyzerHeader}>
            <Text style={styles.analyzerTitle}>Video Data Analyzer</Text>
            <TouchableOpacity onPress={() => setShowAnalyzer(false)}>
              <Text style={{ color: "#00A2D9", fontWeight: "bold" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>

          {/* SCROLLABLE CONTENT */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.videoWrapper}>
              <ExpoVideo
                source={{ uri: videoUri! }}
                style={[
                  styles.analyzerVideo,
                  { transform: [{ scale: isZoomed ? 2 : 1 }] },
                ]}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
                onPlaybackStatusUpdate={(status) => {
                  if (status.isLoaded && status.positionMillis !== undefined) {
                    setCurrentPos(status.positionMillis);
                  }
                }}
              />
            </View>

            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() => setIsZoomed(!isZoomed)}
            >
              <Ionicons
                name={isZoomed ? "search-outline" : "search"}
                size={20}
                color="#333"
              />
              <Text style={styles.zoomButtonText}>
                {isZoomed ? "Zoom Out" : "2x Zoom for Impact Frame"}
              </Text>
            </TouchableOpacity>

            <View style={styles.markerContainer}>
              <View style={styles.markerBox}>
                <Text style={styles.markerLabel}>Drop Started</Text>
                <Text style={styles.markerTime}>
                  {startMarker !== null
                    ? `${(startMarker / 1000).toFixed(2)}s`
                    : "--"}
                </Text>
                <TouchableOpacity
                  onPress={() => setStartMarker(currentPos)}
                  style={styles.markerBtn}
                >
                  <Text style={styles.markerBtnText}>Set Start</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.markerBox}>
                <Text style={styles.markerLabel}>Impact Frame</Text>
                <Text style={styles.markerTime}>
                  {endMarker !== null
                    ? `${(endMarker / 1000).toFixed(2)}s`
                    : "--"}
                </Text>
                <TouchableOpacity
                  onPress={() => setEndMarker(currentPos)}
                  style={[styles.markerBtn, { backgroundColor: "#10B981" }]}
                >
                  <Text style={styles.markerBtnText}>Set Impact</Text>
                </TouchableOpacity>
              </View>
            </View>

            {startMarker !== null && endMarker !== null && (
              <View style={styles.calculatedBox}>
                <Text style={styles.calculatedLabel}>
                  Calculated Fall Time:
                </Text>
                <Text style={styles.calculatedTime}>{calculatedTime}s</Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => {
                    setFallTime(calculatedTime);
                    setShowAnalyzer(false);
                  }}
                >
                  <Text style={styles.applyButtonText}>Apply to Results</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
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
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
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

  // Modal Styles
  analyzerContainer: { flex: 1, backgroundColor: "#F7F8FA" },
  analyzerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  analyzerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  videoWrapper: {
    width: "100%",
    height: 350,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  analyzerVideo: { width: "100%", height: "100%" },
  zoomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
    padding: 12,
  },
  zoomButtonText: { fontWeight: "bold", color: "#333", marginLeft: 8 },
  markerContainer: { flexDirection: "row", padding: 20, gap: 10 },
  markerBox: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
  },
  markerLabel: { fontSize: 12, color: "#666", fontWeight: "bold" },
  markerTime: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111",
    marginVertical: 8,
  },
  markerBtn: {
    backgroundColor: "#00A2D9",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  markerBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
  calculatedBox: {
    marginHorizontal: 20,
    backgroundColor: "#ECFCCB",
    borderWidth: 1,
    borderColor: "#BEF264",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  calculatedLabel: { fontSize: 14, color: "#4D7C0F", fontWeight: "bold" },
  calculatedTime: {
    fontSize: 36,
    fontWeight: "900",
    color: "#15803D",
    marginVertical: 10,
  },
  applyButton: {
    backgroundColor: "#15803D",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  applyButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
