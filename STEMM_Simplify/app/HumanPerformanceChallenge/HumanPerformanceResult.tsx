import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, Trophy } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MovementList from "../../components/humanPerformance/MovementList";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { saveActivityToFeed } from "../../utils/localStore";

const ACTIVITY_ID = "5";

export default function HumanPerformanceResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activityData = params.activityData;

  const [records, setRecords] = useState<any[]>(() => {
    if (activityData && typeof activityData === "string") {
      try {
        return JSON.parse(decodeURIComponent(activityData));
      } catch (e) {
        try {
          return JSON.parse(activityData);
        } catch (err) {
          console.error("Failed to parse activity data", err);
          return [];
        }
      }
    }
    return [];
  });

  const calculatePoints = () => {
    const basePoints = 1000;
    const trialPoints = (records?.length || 0) * 400;
    const smoothCount = (records || []).filter(
      (r: any) => r.status === "Smooth",
    ).length;
    const performancePoints = smoothCount * 500;

    return basePoints + trialPoints + performancePoints;
  };

  const finalScore = calculatePoints();

  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bestRecord =
    records.length > 0
      ? records.reduce((min, current) =>
          current.value < min.value ? current : min,
        )
      : null;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const submissionData = {
        collectionName: "human_performance_challenge",
        activityName: "Human Performance Lab",
        activityType: "generic",
        title: "Motor Control Logged!",
        teamName: "My Team",
        comments,
        recordedMovements: records,
        bestPerformance: bestRecord,
        locationName: "Local Device", // Hardcoded
        points: finalScore,
        createdAt: new Date().toISOString(),
        heroLabel: "MOVEMENTS",
        heroStat: `${records.length} LOGS`,
      };

      await saveActivityToFeed(submissionData);

      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      console.error("Submission error: ", e);
      alert("Failed to save results.");
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={GlobalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={GlobalStyles.headerContainer}>
          <View style={GlobalStyles.successCircle}>
            <Check size={32} color="#fff" />
          </View>
          <Text style={GlobalStyles.headerTitle}>Activity Complete!</Text>
          <Text style={GlobalStyles.headerSubtitle}>
            Share your recorded movement data
          </Text>
        </View>

        <View style={styles.dataCard}>
          <View style={styles.dataCardHeader}>
            <Text style={styles.dataCardTitle}>RECORDED MOVEMENT DATA</Text>
          </View>
          <MovementList records={records} />
        </View>

        {bestRecord && (
          <View style={styles.bestCard}>
            <View style={styles.trophyContainer}>
              <Trophy size={20} color="#fff" />
            </View>
            <View style={styles.bestInfo}>
              <Text style={styles.bestTitle}>BEST PERFORMANCE</Text>
              <Text style={styles.bestMovement}>{bestRecord.movement}</Text>
              <Text style={styles.bestDetails}>
                ±{bestRecord.value.toFixed(2)}cm — {bestRecord.status}
              </Text>
            </View>
          </View>
        )}

        <View style={GlobalStyles.card}>
          <Text style={GlobalStyles.commentsLabel}>
            Comments <Text style={{ color: "#9CA3AF" }}>(Optional)</Text>
          </Text>
          <TextInput
            style={GlobalStyles.textInput}
            placeholder="What did you notice about your movement patterns?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            GlobalStyles.submitButton,
            isSubmitting && GlobalStyles.submitButtonDisabled,
          ]}
          disabled={isSubmitting}
          onPress={handleSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={GlobalStyles.submitButtonText}>Submit Results</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dataCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 16,
  },
  dataCardHeader: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dataCardTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  bestCard: {
    backgroundColor: "#ECFCCB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BEF264",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  trophyContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  bestInfo: { flex: 1 },
  bestTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#10B981",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bestMovement: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 2,
  },
  bestDetails: { fontSize: 12, color: "#4B5563" },
});
