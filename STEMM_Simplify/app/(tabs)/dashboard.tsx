import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActivityCard from "../../components/dashboard/activityCard";
import TabHeader from "../../components/shared/TabHeader";
import { ACTIVITIES } from "../../constants/activities";
import { useMegaFeed } from "../../hooks/useMegaFeed";
import { useTeamData } from "../../hooks/useTeamData";

export default function Dashboard() {
  const router = useRouter();
  const { teamData, loadingTeam } = useTeamData();

  // 1. Fetch the offline data from the Video Hub
  const { feedItems, loading: feedLoading } = useMegaFeed();

  // 2. Check which activities have been completed
  const completedActivityIds = useMemo(() => {
    const completedIds: string[] = [];
    feedItems.forEach((feed) => {
      const name = feed.collectionName?.toLowerCase() || "";
      const activityName = feed.activityName?.toLowerCase() || "";

      if (
        (name.includes("parachute") || activityName.includes("parachute")) &&
        !completedIds.includes("1")
      )
        completedIds.push("1");
      if (
        (name.includes("sound") || activityName.includes("sound")) &&
        !completedIds.includes("2")
      )
        completedIds.push("2");
      if (
        (name.includes("handfan") || activityName.includes("hand fan")) &&
        !completedIds.includes("3")
      )
        completedIds.push("3");
      if (
        (name.includes("human_performance") ||
          activityName.includes("human performance")) &&
        !completedIds.includes("4")
      )
        completedIds.push("4");
      if (
        (name.includes("reaction") || activityName.includes("reaction")) &&
        !completedIds.includes("5")
      )
        completedIds.push("5");
    });
    return completedIds;
  }, [feedItems]);

  // 3. NEW: Calculate Total Data Logs Instead of Points!
  // This counts every single trial, fan design, and reaction test they saved.
  const totalDataLogs = useMemo(() => {
    return feedItems.reduce((sum, item) => {
      const resultsCount = item.results?.length || 0;
      const movementsCount = item.recordedMovements?.length || 0;
      const recordsCount = item.teamRecords?.length || 0;

      // If it's an activity like Parachute that just has 1 final result, count it as 1
      const defaultCount =
        resultsCount === 0 && movementsCount === 0 && recordsCount === 0
          ? 1
          : 0;

      return sum + resultsCount + movementsCount + recordsCount + defaultCount;
    }, 0);
  }, [feedItems]);

  // 4. Calculate Percentage for the Progress Bar
  const progressPercentage = (completedActivityIds.length / 5) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={["top"]}>
      <TabHeader
        title="STEMM Lab"
        subtitle="Real-World Learning"
        showBattery={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        bounces={false}
      >
        <View style={styles.content}>
          <View style={styles.teamCard}>
            {loadingTeam || feedLoading ? (
              <ActivityIndicator color="#FFF" style={{ paddingVertical: 20 }} />
            ) : (
              <>
                <Text style={styles.teamTitle}>
                  {teamData?.teamName || "Guest Team"}
                </Text>
                <Text style={styles.teamSubtitle}>{teamData?.grade}</Text>

                {/* --- NEW PROGRESS BAR --- */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Lab Completion</Text>
                    <Text style={styles.progressPercent}>
                      {progressPercentage}%
                    </Text>
                  </View>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progressPercentage}%` },
                      ]}
                    />
                  </View>
                </View>

                {/* --- TWO CLEAN DATA BOXES INSTEAD OF 3 POINTS BOXES --- */}
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Experiments</Text>
                    <Text style={styles.statValue}>
                      {completedActivityIds.length} / 5
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Data Logs Captured</Text>
                    <Text style={styles.statValue}>{totalDataLogs}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          <Text style={styles.sectionTitle}>Activities</Text>

          {ACTIVITIES.map((item) => {
            const isCompleted = completedActivityIds.includes(item.id);
            return (
              <ActivityCard
                key={item.id}
                item={item}
                isCompleted={isCompleted}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },

  teamCard: {
    backgroundColor: "#00A2D9",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#00A2D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  teamTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  teamSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
  },

  // NEW PROGRESS BAR STYLES
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressPercent: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFF",
    borderRadius: 4,
  },

  // UPDATED 2-COLUMN STAT BOXES
  statsRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  statBox: {
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    flex: 1,
    alignItems: "flex-start",
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    marginBottom: 4,
    fontWeight: "600",
  },
  statValue: { color: "#FFF", fontSize: 22, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    marginBottom: 15,
  },
});
