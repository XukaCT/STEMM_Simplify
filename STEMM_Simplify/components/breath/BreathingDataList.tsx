import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BreathingDataListProps {
  parsedAtRest: number | null;
  parsedAfterExercise: number[];
}

export default function BreathingDataList({
  parsedAtRest,
  parsedAfterExercise,
}: BreathingDataListProps) {
  return (
    <View style={styles.resultsContainer}>
      {/* At Rest Baseline */}
      <View style={styles.resultBlock}>
        <View style={styles.resultItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.resultText}>Baseline (At Rest)</Text>
            <Text style={styles.resultSubtext}>Normal resting state</Text>
          </View>
          <View style={[styles.scoreBox, { backgroundColor: "#F3F4F6" }]}>
            <Text style={[styles.scoreText, { color: "#374151" }]}>
              {parsedAtRest !== null && parsedAtRest > 0
                ? `${parsedAtRest} bpm`
                : "No Data"}
            </Text>
          </View>
        </View>
      </View>

      {/* After Exercise Scores */}
      {parsedAfterExercise.length > 0 ? (
        parsedAfterExercise.map((score, index) => {
          const increase =
            parsedAtRest !== null && parsedAtRest > 0
              ? score - parsedAtRest
              : null;
          return (
            <View key={index} style={styles.resultBlock}>
              <View style={styles.resultItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultText}>
                    After Exercise {index + 1}
                  </Text>
                  {increase !== null && (
                    <Text style={styles.increaseText}>
                      {increase > 0 ? `+${increase}` : increase} bpm increase
                    </Text>
                  )}
                </View>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreText}>{score} bpm</Text>
                </View>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyText}>No exercise data recorded.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: { marginBottom: 8 },
  resultBlock: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    padding: 12,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultText: { fontWeight: "bold", fontSize: 15, color: "#111" },
  resultSubtext: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  increaseText: {
    fontSize: 13,
    color: "#EF4444",
    marginTop: 4,
    fontWeight: "600",
  },
  scoreBox: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scoreText: { fontSize: 15, fontWeight: "bold", color: "#FF5A00" },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    marginBottom: 16,
    marginTop: 8,
  },
});
