import { FontAwesome5 } from "@expo/vector-icons";
import { Activity, Volume2, Wind, Zap } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FeedItem } from "../../hooks/useMegaFeed";

interface FeedCardProps {
  item: FeedItem;
  onPress: () => void;
}

export default function FeedCard({ item, onPress }: FeedCardProps) {
  const renderCardTop = () => {
    if (item.activityType === "reaction") {
      return (
        <View style={[styles.heroHeader, { backgroundColor: "#FF5A00" }]}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>REPORT</Text>
          </View>
          <View style={styles.heroContentRow}>
            <View
              style={[
                styles.heroIconBox,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
            >
              <Zap color="#fff" size={32} />
            </View>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroLabelText}>{item.heroLabel}</Text>
              <Text style={styles.heroStatText}>{item.heroStat}</Text>
            </View>
          </View>
        </View>
      );
    }
    if (item.activityType === "breathing") {
      return (
        <View style={[styles.heroHeader, { backgroundColor: "#000000" }]}>
          <View style={[styles.heroBadge, { backgroundColor: "#333" }]}>
            <Text style={styles.heroBadgeText}>REPORT</Text>
          </View>
          <View style={styles.heroContentRow}>
            <View style={[styles.heroIconBox, { backgroundColor: "#222" }]}>
              <Wind color="#fff" size={32} />
            </View>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroLabelText}>{item.heroLabel}</Text>
              <Text style={styles.heroStatText}>{item.heroStat}</Text>
            </View>
          </View>
        </View>
      );
    }
    if (item.activityType === "generic") {
      let bgColor = "#1E3A8A";
      let IconComponent = Activity;

      if (item.collectionName === "human_performance_challenge")
        bgColor = "#10B981";
      else if (item.collectionName === "earthquake_Challenge")
        bgColor = "#B45309";
      else if (item.collectionName === "sound_challenge") {
        bgColor = "#8B5CF6";
        IconComponent = Volume2;
      }

      return (
        <View style={[styles.heroHeader, { backgroundColor: bgColor }]}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>DATA LOG</Text>
          </View>
          <View style={styles.heroContentRow}>
            <View
              style={[
                styles.heroIconBox,
                { backgroundColor: "rgba(255,255,255,0.15)" },
              ]}
            >
              <IconComponent color="#fff" size={32} />
            </View>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroLabelText}>
                {item.heroLabel || "ACTIVITY REPORT"}
              </Text>
              <Text style={styles.heroStatText}>
                {item.heroStat || "Analyzed"}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Default Video Thumbnail layout
    return (
      <View style={[styles.thumbnail, { backgroundColor: "#FF5A00" }]}>
        <View
          style={[styles.heroBadge, { backgroundColor: "rgba(0,0,0,0.2)" }]}
        >
          <Text style={styles.heroBadgeText}>VIDEO</Text>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {item.hasMedia ? (
            <>
              <View style={styles.playButton}>
                <FontAwesome5
                  name="play"
                  size={20}
                  color="#FF5A00"
                  style={styles.playIcon}
                />
              </View>
              <Text
                style={[
                  styles.heroLabelText,
                  { marginTop: 16, marginBottom: 0, color: "#fff" },
                ]}
              >
                Video recorded
              </Text>
            </>
          ) : (
            <>
              <View
                style={[
                  styles.playButton,
                  { backgroundColor: "rgba(255,255,255,0.25)" },
                ]}
              >
                <FontAwesome5 name="video-slash" size={18} color="#fff" />
              </View>
              <Text
                style={[
                  styles.heroLabelText,
                  { marginTop: 16, marginBottom: 0 },
                ]}
              >
                No video recorded
              </Text>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      {renderCardTop()}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.activityName}</Text>
        <Text
          style={{
            fontSize: 12,
            color: "#00A2D9",
            marginTop: 2,
            fontWeight: "bold",
          }}
        >
          {item.collectionName
            .replace("_Challenge", "")
            .replace("_challenge", "")
            .replace("Challenges", "Challenge")
            .toUpperCase()}
        </Text>

        <View style={styles.cardPointsRow}>
          <Text
            style={{
              fontSize: 13,
              color: "#00A2D9",
              fontWeight: "bold",
            }}
          >
            View data logs →
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <FontAwesome5 name="users" size={12} color="#6b7280" />
            <Text style={styles.metaText}>{item.teamName}</Text>
          </View>
          <View style={styles.metaItem}>
            <FontAwesome5 name="map-marker-alt" size={12} color="#6b7280" />
            <Text style={styles.metaText}>
              {item.location ? item.location.split(",")[0] : "Local Device"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  heroHeader: {
    padding: 24,
    position: "relative",
    justifyContent: "center",
    minHeight: 140,
  },
  heroBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  heroBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  heroContentRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  heroIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  heroTextCol: { flex: 1 },
  heroLabelText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  heroStatText: { color: "#fff", fontSize: 36, fontWeight: "900" },
  thumbnail: {
    height: 192,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  playButton: {
    backgroundColor: "#ffffff",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  playIcon: { marginLeft: 4 },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },

  cardPointsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginLeft: 4,
  },
});
