import { useLocalSearchParams, useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";
import { Activity, ArrowLeft, ChevronRight } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HumanPerformanceActivity() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const { startTime } = params;

  const [isRecording, setIsRecording] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(0);
  const [selectedMovement, setSelectedMovement] = useState("Arm Circle");
  const startTimeRef = useRef(0);

  const [records, setRecords] = useState<any[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentMetricRef = useRef(0);
  const movementRef = useRef(selectedMovement);

  useEffect(() => {
    movementRef.current = selectedMovement;
  }, [selectedMovement]);

  const movementOptions = ["Arm Circle", "Horizontal Sweep", "Vertical Raise"];

  useEffect(() => {
    let subscription: any;

    if (isRecording) {
      Accelerometer.setUpdateInterval(50);
      subscription = Accelerometer.addListener((data) => {
        if (Date.now() - startTimeRef.current >= 10000) {
          stopAndSaveRecording();
          return;
        }
        const { x, y, z } = data;
        const totalForce = Math.sqrt(x * x + y * y + z * z);
        const variance = Math.abs(totalForce - 1) * 15;

        if (variance > currentMetricRef.current) {
          currentMetricRef.current = variance;
          setCurrentMetric(variance);
        }
      });
    } else {
      if (subscription) subscription.remove();
    }

    return () => {
      if (subscription) subscription.remove();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRecording]);

  const stopAndSaveRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    const newRecord = {
      id: Date.now().toString(),
      movement: movementRef.current,
      value: currentMetricRef.current,
      status: currentMetricRef.current < 3.0 ? "Smooth" : "Shaky",
    };

    setRecords((prev) => [...prev, newRecord]);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopAndSaveRecording();
    } else {
      setCurrentMetric(0);
      currentMetricRef.current = 0;
      startTimeRef.current = Date.now();
      setIsRecording(true);
    }
  };

  const handleViewResults = () => {
    router.push({
      pathname: "/HumanPerformanceChallenge/HumanPerformanceResult",
      params: {
        // SECURE ROUTING: encodeURIComponent prevents JSON strings from breaking the URL path
        activityData: encodeURIComponent(JSON.stringify(records)),
        startTime: startTime as string,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Human Performance Lab</Text>
        <Text style={styles.headerSubtitle}>Medical Science</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            🤸 Select a movement, press{" "}
            <Text style={{ fontWeight: "bold" }}>Start Recording</Text>. It will
            automatically record for 10 seconds and save the result. Record as
            many movements as you like before viewing results.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>Movement Type</Text>
          <View style={styles.selectorWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectorContainer}
            >
              {movementOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectorButton,
                    selectedMovement === option && styles.selectorButtonActive,
                  ]}
                  onPress={() => !isRecording && setSelectedMovement(option)}
                  disabled={isRecording}
                >
                  <Text
                    style={[
                      styles.selectorText,
                      selectedMovement === option && styles.selectorTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.readoutBox}>
            <Text
              style={[styles.readoutValue, isRecording && { color: "#00A2D9" }]}
            >
              ±{currentMetric.toFixed(2)}cm
            </Text>
            <Text style={styles.readoutLabel}>
              {isRecording
                ? "Recording in progress (10s)..."
                : "Awaiting recording"}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
            ]}
            onPress={toggleRecording}
          >
            {isRecording ? (
              <Text style={styles.recordButtonText}>Stop Early</Text>
            ) : (
              <>
                <Activity size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.recordButtonText}>Start 10s Recording</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Recorded So Far ({records.length})
          </Text>

          {records.length === 0 ? (
            <Text style={styles.emptyText}>No movements recorded yet.</Text>
          ) : (
            records.map((record, index) => (
              <View key={record.id} style={styles.recordItem}>
                <Text style={styles.recordMovementText}>
                  #{index + 1} {record.movement}
                </Text>
                <View style={styles.recordRightSide}>
                  <Text
                    style={[
                      styles.recordStatus,
                      record.status === "Shaky" && { color: "#DC2626" },
                    ]}
                  >
                    {record.status}
                  </Text>
                  <Text style={styles.recordValueText}>
                    ±{record.value.toFixed(2)}cm
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.resultsButton,
            records.length === 0 && { opacity: 0.5 },
          ]}
          onPress={handleViewResults}
          disabled={records.length === 0}
        >
          <Text style={styles.resultsButtonText}>View Full Results</Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  header: { padding: 20, backgroundColor: "#000", paddingBottom: 24 },
  backButton: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#999", marginTop: 4 },
  scrollContent: { padding: 16, backgroundColor: "#FAFAFA" },

  infoBanner: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FFEDD5",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoBannerText: { color: "#9A3412", fontSize: 13, lineHeight: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
  },

  selectorWrapper: { marginBottom: 16 },
  selectorContainer: { flexDirection: "row", gap: 8, paddingBottom: 4 },
  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    marginRight: 8,
  },
  selectorButtonActive: { backgroundColor: "#00A2D9", borderColor: "#00A2D9" },
  selectorText: { fontSize: 13, color: "#4B5563" },
  selectorTextActive: { color: "#fff", fontWeight: "bold" },

  readoutBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    marginBottom: 16,
  },
  readoutValue: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#D1D5DB",
    marginBottom: 4,
  },
  readoutLabel: { fontSize: 13, color: "#9CA3AF" },

  recordButton: {
    backgroundColor: "#00A2D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  recordButtonActive: { backgroundColor: "#DC2626" },
  recordButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
  },
  emptyText: { color: "#9CA3AF", fontStyle: "italic", fontSize: 13 },

  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  recordMovementText: { fontSize: 14, color: "#374151", fontWeight: "500" },
  recordRightSide: { flexDirection: "row", alignItems: "center", gap: 12 },
  recordStatus: { fontSize: 12, color: "#10B981", fontWeight: "600" },
  recordValueText: { fontSize: 15, fontWeight: "bold", color: "#FF5A00" },

  bulletList: { gap: 6 },
  bulletItem: { fontSize: 12, color: "#1E3A8A", lineHeight: 18 },

  resultsButton: {
    backgroundColor: "#00A2D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  resultsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});
