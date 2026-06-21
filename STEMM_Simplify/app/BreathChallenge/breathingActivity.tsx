import { useLocalSearchParams, useRouter } from "expo-router";
import { Accelerometer } from "expo-sensors";
import {
  ArrowLeft,
  CheckCircle,
  Save,
  Trash2,
  Wind,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BreathingPaceActivity() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const { startTime } = params;

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<"At Rest" | "After Exercise">(
    "At Rest",
  );
  const [isRecording, setIsRecording] = useState(false);
  const [hasUnsavedResult, setHasUnsavedResult] = useState(false);
  const [currentBPM, setCurrentBPM] = useState(0);

  // --- SAVED RESULTS ---
  const [atRestScore, setAtRestScore] = useState<number | null>(null);
  const [afterExerciseScores, setAfterExerciseScores] = useState<number[]>([]);

  // --- SENSOR REFS ---
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breathCountRef = useRef(0);
  const isPeakRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // --- SENSOR LOGIC ---
  useEffect(() => {
    let subscription: any;

    if (isRecording) {
      Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener((data) => {
        const { x, y, z } = data;
        const totalForce = Math.sqrt(x * x + y * y + z * z);

        if (totalForce > 1.05 && !isPeakRef.current) {
          isPeakRef.current = true;
          breathCountRef.current += 1;
        } else if (totalForce < 1.02) {
          isPeakRef.current = false;
        }
      });
    } else {
      if (subscription) subscription.remove();
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [isRecording]);

  // --- RECORDING ACTIONS ---
  const startRecording = () => {
    setIsRecording(true);
    setHasUnsavedResult(false);
    setCurrentBPM(0);
    breathCountRef.current = 0;
    isPeakRef.current = false;

    timerRef.current = setTimeout(() => {
      setIsRecording(false);
      setHasUnsavedResult(true);

      const calculatedBPM = breathCountRef.current * 12;
      setCurrentBPM(calculatedBPM > 0 ? calculatedBPM : 15);
    }, 5000);
  };

  const saveResult = () => {
    if (activeTab === "At Rest") {
      setAtRestScore(currentBPM);
    } else {
      setAfterExerciseScores([...afterExerciseScores, currentBPM]);
    }

    setHasUnsavedResult(false);
    setCurrentBPM(0);
  };

  const deleteExerciseScore = (indexToRemove: number) => {
    setAfterExerciseScores((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleTabChange = (tab: "At Rest" | "After Exercise") => {
    if (isRecording) return;
    setActiveTab(tab);
    setHasUnsavedResult(false);
    setCurrentBPM(0);
  };

  const handleComplete = () => {
    router.push({
      pathname: "/BreathChallenge/breathingChallengeResult",
      params: {
        atRest: atRestScore || 0,
        afterExercise: JSON.stringify(afterExerciseScores),
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
        <Text style={styles.headerTitle}>Breathing Pace Trainer</Text>
        <Text style={styles.headerSubtitle}>Medical Science</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "At Rest" && styles.tabButtonActive,
            ]}
            onPress={() => handleTabChange("At Rest")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "At Rest" && styles.tabTextActive,
              ]}
            >
              At Rest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "After Exercise" && styles.tabButtonActive,
            ]}
            onPress={() => handleTabChange("After Exercise")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "After Exercise" && styles.tabTextActive,
              ]}
            >
              After Exercise
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.bpmContainer}>
            <Text
              style={[styles.bpmValue, isRecording && { color: "#9CA3AF" }]}
            >
              {hasUnsavedResult ? currentBPM : 0}
            </Text>
            <Text style={styles.bpmLabel}>Breaths per Minute</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
            ]}
            onPress={startRecording}
            disabled={isRecording}
          >
            {isRecording ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Wind size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.recordButtonText}>
                  Start Recording (5s)
                </Text>
              </>
            )}
          </TouchableOpacity>

          {hasUnsavedResult && (
            <TouchableOpacity style={styles.saveButton} onPress={saveResult}>
              <Save size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>Save Result</Text>
            </TouchableOpacity>
          )}
        </View>

        {(atRestScore !== null || afterExerciseScores.length > 0) && (
          <View style={styles.resultsCard}>
            <Text style={styles.sectionTitle}>Results</Text>

            {atRestScore !== null && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>At Rest</Text>
                <Text style={styles.resultValue}>{atRestScore} bpm</Text>
              </View>
            )}

            {afterExerciseScores.map((score, index) => {
              const increase =
                atRestScore !== null ? score - atRestScore : null;

              return (
                <View key={index} style={[styles.resultRow, { marginTop: 8 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultLabel}>
                      After Exercise {index + 1}
                    </Text>
                    {increase !== null && (
                      <Text style={styles.increaseText}>
                        {increase > 0 ? `+${increase}` : increase} bpm increase
                      </Text>
                    )}
                  </View>

                  <View style={styles.actionRow}>
                    <Text style={styles.resultValue}>{score} bpm</Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteExerciseScore(index)}
                    >
                      <Trash2 size={18} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.understandingBox}>
          <Text style={styles.understandingTitle}>
            Understanding Breathing Rate
          </Text>
          <Text style={styles.understandingIntro}>
            Breathing rate increases during exercise because muscles need more
            oxygen and produce more carbon dioxide. The respiratory system works
            with the cardiovascular system to deliver oxygen to cells and remove
            waste gases. Normal resting rate is 12-20 breaths per minute.
          </Text>

          <View style={styles.keyFactsCard}>
            <Text style={styles.keyFactsTitle}>Respiratory Response:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Exercise increases breathing rate 2-3x normal
              </Text>
              <Text style={styles.bulletItem}>
                • Fitter individuals return to rest rate faster
              </Text>
              <Text style={styles.bulletItem}>
                • Deep breathing delivers more oxygen per breath
              </Text>
              <Text style={styles.bulletItem}>
                • Carbon dioxide triggers breathing increase
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <CheckCircle size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.completeButtonText}>Complete Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  header: { padding: 20, backgroundColor: "#000", paddingBottom: 16 },
  backButton: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#999", marginTop: 4 },

  scrollContent: { padding: 16, backgroundColor: "#fff" },

  tabContainer: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  tabButtonActive: { backgroundColor: "#FF5A00" },
  tabText: { fontSize: 14, fontWeight: "bold", color: "#4B5563" },
  tabTextActive: { color: "#fff" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },
  bpmContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 32,
    alignItems: "center",
    marginBottom: 16,
  },
  bpmValue: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#FF5A00",
    marginBottom: 4,
  },
  bpmLabel: { fontSize: 13, color: "#6B7280" },

  recordButton: {
    backgroundColor: "#FF5A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  recordButtonActive: { opacity: 0.7 },
  recordButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  saveButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  resultsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 12,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  resultLabel: { fontSize: 14, color: "#374151", fontWeight: "600" },
  resultValue: { fontSize: 16, fontWeight: "bold", color: "#FF5A00" },
  increaseText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 2,
    fontWeight: "500",
  },
  actionRow: { flexDirection: "row", alignItems: "center" },
  deleteButton: { marginLeft: 16, padding: 4 },

  understandingBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  understandingTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  understandingIntro: {
    fontSize: 12,
    color: "#1E3A8A",
    lineHeight: 18,
    marginBottom: 16,
  },
  keyFactsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  keyFactsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  bulletList: { gap: 6 },
  bulletItem: { fontSize: 12, color: "#1E3A8A", lineHeight: 18 },

  completeButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  completeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
