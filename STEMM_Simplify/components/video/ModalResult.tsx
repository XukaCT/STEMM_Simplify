import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { VideoPost } from "./videoModal";

export default function ModalResults({ post }: { post: VideoPost }) {
  const isSoundChallenge =
    post.activityName?.includes("Sound") ||
    post.collectionName === "sound_challenge";
  const isHandFan =
    post.activityName?.includes("Hand Fan") ||
    post.collectionName === "handFan_Challenges";
  const isHumanPerf =
    post.activityName?.includes("Human Performance") ||
    post.collectionName === "human_performance_challenge";
  const isEarthquake =
    post.activityName?.includes("Earthquake") ||
    post.collectionName === "earthquake_Challenge";
  const isReaction =
    post.activityName?.includes("Reaction") ||
    post.collectionName === "reaction_Challenge";
  const isBreathing =
    post.activityName?.includes("Breathing") ||
    post.collectionName === "breathing_challenge";
  const isParachute =
    post.activityName?.includes("Parachute") ||
    post.collectionName === "parachute_challenge";

  const safeResults =
    post.results ||
    post.designsTested ||
    post.recordedMovements ||
    post.teamRecords ||
    [];

  return (
    <View style={styles.resultsCard}>
      {isHumanPerf ? (
        (post.recordedMovements || []).map((r: any, i: number) => (
          <View
            key={i}
            style={[
              styles.resultRow,
              i !== (post.recordedMovements?.length || 0) - 1 &&
                styles.resultRowBorder,
            ]}
          >
            <Text style={styles.resultLabel}>
              {r.movement || `Trial ${i + 1}`}
            </Text>
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>
                ±{Number(r.value).toFixed(2)}cm
              </Text>
              <Text
                style={[
                  styles.resultSubtext,
                  { color: r.status === "Smooth" ? "#10B981" : "#EF4444" },
                ]}
              >
                {r.status?.toUpperCase()}
              </Text>
            </View>
          </View>
        ))
      ) : isEarthquake ? (
        safeResults.map((r: any, i: number) => (
          <View
            key={i}
            style={[
              styles.resultRow,
              i !== safeResults.length - 1 && styles.resultRowBorder,
            ]}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.resultLabel}>
                {r.design || `Design ${i + 1}`}
              </Text>
            </View>
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>
                {r.actual ? `${r.actual} G` : "Completed"}
              </Text>
            </View>
          </View>
        ))
      ) : isReaction && post.teamRecords ? (
        post.teamRecords.map((r: any, i: number) => (
          <View
            key={i}
            style={[
              styles.resultRow,
              i !== post.teamRecords!.length - 1 && styles.resultRowBorder,
            ]}
          >
            <Text style={styles.resultLabel}>{r.name || `Trial ${i + 1}`}</Text>
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>{r.score}</Text>
              <Text style={styles.resultSubtext}>{r.phase?.toUpperCase()}</Text>
            </View>
          </View>
        ))
      ) : isHandFan ? (
        safeResults.map((r: any, i: number) => (
          <View
            key={i}
            style={[
              styles.resultRow,
              i !== safeResults.length - 1 && styles.resultRowBorder,
            ]}
          >
            <Text style={styles.resultLabel}>
              {r.design} ({r.phase})
            </Text>
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>{r.angle}</Text>
              <Text style={[styles.resultSubtext, { color: "#059669" }]}>
                {r.distance}
              </Text>
            </View>
          </View>
        ))
      ) : isSoundChallenge ? (
        safeResults.map((r: any, i: number) => (
          <View
            key={i}
            style={[
              styles.resultRow,
              i !== safeResults.length - 1 && styles.resultRowBorder,
            ]}
          >
            <Text style={styles.resultLabel}>
              {r.action || `Trial ${i + 1}`}
            </Text>
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>
                {r.decibels || r.db ? `${r.decibels || r.db} dB` : "Recorded"}
              </Text>
            </View>
          </View>
        ))
      ) : isParachute ? (
        <>
          <View style={[styles.resultRow, styles.resultRowBorder]}>
            <Text style={styles.resultLabel}>No Parachute</Text>
            <Text style={styles.resultValue}>{post.speedNo} m/s</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>With Parachute</Text>
            <Text style={styles.resultValue}>{post.speedWith} m/s</Text>
          </View>
        </>
      ) : (
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Data Processed</Text>
          <Text style={styles.resultValue}>Success</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  resultRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  resultLabel: { fontSize: 14, fontWeight: "600", color: "#111" },
  resultSubtext: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  resultValueContainer: { alignItems: "flex-end" },
  resultValue: { fontSize: 14, fontWeight: "bold", color: "#FF5A00" },
});
