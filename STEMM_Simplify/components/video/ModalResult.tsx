import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { VideoPost } from "./videoModal";

export default function ModalResults({ post }: { post: VideoPost }) {
  const isSoundChallenge =
    post.activityName?.includes("Sound") ||
    post.collectionName === "sound_challenge";
  const isEarthquake =
    post.activityName?.includes("Earthquake") ||
    post.collectionName === "earthquake_Challenge";
  const isHandFan =
    post.activityName?.includes("Hand Fan") ||
    post.collectionName === "handFan_Challenges";
  const isParachute =
    post.activityName?.includes("Parachute") ||
    post.collectionName === "parachute_challenge";
  const isReaction =
    post.activityName?.includes("Reaction") ||
    post.collectionName === "reaction_Challenge";
  const isBreathing =
    post.activityName?.includes("Breathing") ||
    post.collectionName === "breathing_challenge";
  const isHumanPerf =
    post.activityName?.includes("Human Performance") ||
    post.collectionName === "human_performance_challenge";

  const safeResults = post.results || post.designsTested || [];

  if (isHumanPerf) {
    const movements = post.recordedMovements || [];
    return (
      <View style={styles.resultsCard}>
        {movements.length > 0 ? (
          movements.map((r: any, i: number) => (
            <View
              key={i}
              style={[
                styles.resultRow,
                i !== movements.length - 1 && styles.resultRowBorder,
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
                  {r.status ? r.status.toUpperCase() : "RESULT"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Test Status</Text>
            <Text style={styles.resultValue}>No data recorded</Text>
          </View>
        )}
      </View>
    );
  }

  if (isEarthquake) {
    return (
      <View style={styles.resultsCard}>
        {safeResults.length > 0 ? (
          safeResults.map((r: any, i: number) => (
            <View
              key={i}
              style={[
                styles.resultRow,
                i !== safeResults.length - 1 && styles.resultRowBorder,
              ]}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.resultLabel} numberOfLines={1}>
                  {r.design || `Design ${i + 1}`}
                </Text>
                {r.observations && (
                  <Text
                    style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}
                    numberOfLines={2}
                  >
                    Obs: {r.observations}
                  </Text>
                )}
              </View>
              <View style={styles.resultValueContainer}>
                <Text style={styles.resultValue}>
                  {r.actual ? `${r.actual} G` : "Completed"}
                </Text>
                <Text style={[styles.resultSubtext, { color: "#B45309" }]}>
                  {r.predicted ? `Pred: ${r.predicted} G` : "RESULT"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Test Status</Text>
            <Text style={styles.resultValue}>Data Recorded</Text>
          </View>
        )}
      </View>
    );
  }

  if (isReaction && post.teamRecords) {
    const times = post.teamRecords
      .filter((r: any) => typeof r.score === "string" && r.score.includes("ms"))
      .map((r: any) => parseInt(r.score))
      .filter((n: number) => !isNaN(n));
    return (
      <View style={styles.resultsCard}>
        {times.length > 0 && (
          <>
            <View
              style={[
                styles.resultRow,
                styles.resultRowBorder,
                { backgroundColor: "#FFF7ED" },
              ]}
            >
              <Text style={[styles.resultLabel, { fontWeight: "bold" }]}>
                Team Best Time
              </Text>
              <View style={styles.resultValueContainer}>
                <Text style={styles.resultValue}>{Math.min(...times)} ms</Text>
                <Text style={[styles.resultSubtext, { color: "#FF5A00" }]}>
                  FASTEST
                </Text>
              </View>
            </View>
            <View style={[styles.resultRow, styles.resultRowBorder]}>
              <Text style={styles.resultLabel}>Average Time</Text>
              <Text style={styles.resultValue}>
                {Math.round(times.reduce((a, b) => a + b, 0) / times.length)} ms
              </Text>
            </View>
          </>
        )}
        <View
          style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
              color: "#9CA3AF",
              letterSpacing: 1,
            }}
          >
            TEAM MEMBER LOG
          </Text>
        </View>
        {post.teamRecords.map((r: any, i: number) => (
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
              <Text
                style={[styles.resultSubtext, { color: "#6B7280" }]}
                numberOfLines={1}
              >
                {r.phase ? r.phase.toUpperCase() : "RESULT"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (isHandFan) {
    return (
      <View style={styles.resultsCard}>
        {safeResults.map((r: any, i: number) => (
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
        ))}
      </View>
    );
  }

  if (isSoundChallenge) {
    return (
      <View style={styles.resultsCard}>
        {safeResults.map((r: any, i: number) => (
          <View
            key={i}
            style={[
              styles.resultRow,
              i !== safeResults.length - 1 && styles.resultRowBorder,
            ]}
          >
            <Text style={styles.resultLabel}>
              {r.action || `Trial ${i + 1}`}{" "}
              {r.distance ? `— ${r.distance}m` : ""}
            </Text>
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>
                {r.decibels || r.db ? `${r.decibels || r.db} dB` : "Recorded"}
              </Text>
              {(r.decibels || r.db) && (
                <Text style={[styles.resultSubtext, { color: "#8B5CF6" }]}>
                  VOLUME
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (isBreathing) {
    const bpmResults = post.afterExerciseBPMs || [];
    return (
      <View style={styles.resultsCard}>
        <View style={[styles.resultRow, styles.resultRowBorder]}>
          <Text style={styles.resultLabel}>Resting Baseline</Text>
          <Text style={styles.resultValue}>{post.atRestBPM} bpm</Text>
        </View>
        {bpmResults.map((bpm: number, i: number) => (
          <View
            key={i}
            style={[
              styles.resultRow,
              i !== bpmResults.length - 1 && styles.resultRowBorder,
            ]}
          >
            <Text style={styles.resultLabel}>After Exercise {i + 1}</Text>
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>{bpm} bpm</Text>
              <Text style={[styles.resultSubtext, { color: "#EF4444" }]}>
                +{bpm - (post.atRestBPM || 0)} bpm
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (isParachute) {
    return (
      <View style={styles.resultsCard}>
        <View style={[styles.resultRow, styles.resultRowBorder]}>
          <Text style={styles.resultLabel}>No Parachute</Text>
          <View style={styles.resultValueContainer}>
            <Text style={styles.resultValue}>{post.speedNo} m/s</Text>
            <Text style={[styles.resultSubtext, { color: "#FF5A00" }]}>
              SPEED
            </Text>
          </View>
        </View>
        <View style={[styles.resultRow, styles.resultRowBorder]}>
          <Text style={styles.resultLabel}>With Parachute</Text>
          <View style={styles.resultValueContainer}>
            <Text style={styles.resultValue}>{post.speedWith} m/s</Text>
            <Text style={[styles.resultSubtext, { color: "#FF5A00" }]}>
              SPEED
            </Text>
          </View>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Time Difference</Text>
          <View style={styles.resultValueContainer}>
            <Text style={styles.resultValue}>
              {post.isSuccess ? "+" : ""}
              {post.timeDiffPercent}%
            </Text>
            <Text
              style={[
                styles.resultSubtext,
                { color: post.isSuccess ? "#10B981" : "#EF4444" },
              ]}
            >
              {post.isSuccess ? "SLOWER (SUCCESS)" : "FASTER (FAIL)"}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.resultsCard}>
      <View style={styles.resultRow}>
        <Text style={styles.resultLabel}>Data Processed</Text>
        <Text style={styles.resultValue}>Success</Text>
      </View>
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
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  resultRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  resultLabel: { fontSize: 15, color: "#4B5563" },
  resultValueContainer: { alignItems: "flex-end" },
  resultValue: { fontSize: 16, fontWeight: "bold", color: "#111" },
  resultSubtext: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
