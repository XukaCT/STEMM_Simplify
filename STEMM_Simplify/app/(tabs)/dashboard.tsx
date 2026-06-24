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
  const { teamData, loadingTeam } = useTeamData(); // Removed teamRank as it's no longer used

  // 1. Fetch the offline data from the Video Hub
  const { feedItems, loading: feedLoading } = useMegaFeed();

  // 2. Dynamically check which activities have been saved
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

  // 3. Dynamically calculate the total points
  const totalOfflinePoints = useMemo(() => {
    return feedItems.reduce((sum, item) => sum + (item.points || 0), 0);
  }, [feedItems]);

  // 4. Calculate the new Offline "Status/Level" based on points
  const teamStatus = useMemo(() => {
    if (totalOfflinePoints >= 9000) return "67";
    if (totalOfflinePoints >= 8000) return "Noob Lord!";
    if (totalOfflinePoints >= 7000) return "Super Noob!";
    if (totalOfflinePoints >= 6000) return "Still Noob";
    if (totalOfflinePoints >= 4000) return "Kinda Noob";
    if (totalOfflinePoints >= 2000) return "Less Noob";
    return "Too Noob";
  }, [totalOfflinePoints]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={["top"]}>
      {/* FIXED HEADER */}
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
                <Text style={styles.teamSubtitle}>
                  {teamData?.grade || "No Grade"} •{" "}
                  {teamData?.members?.length || 0} Members
                </Text>
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Completed</Text>
                    <Text style={styles.statValue}>
                      {completedActivityIds.length}/5
                    </Text>
                  </View>

                  {/* REPLACED RANK WITH DYNAMIC STATUS */}
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Status 🎖️</Text>
                    <Text
                      style={styles.statValue}
                      numberOfLines={1}
                      adjustsFontSizeToFit // Shrinks text automatically if "Lead Scientist" is too long
                    >
                      {teamStatus}
                    </Text>
                  </View>

                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Points</Text>
                    <Text style={styles.statValue}>{totalOfflinePoints}</Text>
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
    backgroundColor: "#FF5A00",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#FF5A00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 140,
  },
  teamTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  teamSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: {
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 10, // Slightly reduced padding to give text more room
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center", // Centers the new text titles
  },
  statLabel: { color: "rgba(255,255,255,0.8)", fontSize: 10, marginBottom: 4 },
  statValue: { color: "#FFF", fontSize: 16, fontWeight: "bold" }, // Reduced slightly for titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    marginBottom: 15,
  },
});
