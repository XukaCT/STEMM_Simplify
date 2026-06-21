import { FontAwesome5 } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { Activity, Volume2, Wind, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { VideoPost } from "../videoModal";

export default function ModalHero({ post }: { post: VideoPost }) {
  const [activeVideoTab, setActiveVideoTab] = useState<"with" | "no">("with");
  const [activeTrialIndex, setActiveTrialIndex] = useState(0);

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

  useEffect(() => {
    setActiveVideoTab("with");
    setActiveTrialIndex(0);
  }, [post]);

  const activeMediaSource = isParachute
    ? activeVideoTab === "with"
      ? post.withVideoUrl
      : post.noVideoUrl
    : isHandFan
      ? safeResults[activeTrialIndex]?.videoUrl ||
        safeResults[activeTrialIndex]?.videoUri
      : isSoundChallenge
        ? safeResults.length > 0
          ? safeResults[activeTrialIndex]?.audioUrl ||
            safeResults[activeTrialIndex]?.audioUri
          : post.audioUrl || post.audioUri
        : post.videoUrl || post.videoUri;

  const player = useVideoPlayer(activeMediaSource || null, (player) => {
    player.loop = false;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const isMediaPost = !!(
    post.withVideoUrl ||
    post.noVideoUrl ||
    post.videoUrl ||
    post.videoUri ||
    post.audioUri ||
    post.audioUrl ||
    safeResults.some(
      (r: any) => r.audioUri || r.audioUrl || r.videoUrl || r.videoUri,
    )
  );

  const getHeroConfig = () => {
    if (isReaction) {
      const times = (post.teamRecords || [])
        .filter(
          (r: any) => typeof r.score === "string" && r.score.includes("ms"),
        )
        .map((r: any) => parseInt(r.score))
        .filter((n: number) => !isNaN(n));
      return {
        bg: "#FF5A00",
        icon: <Zap color="#fff" size={36} />,
        label: "BEST REACTION",
        value: times.length > 0 ? `${Math.min(...times)} ms` : "-- ms",
      };
    }
    if (isBreathing) {
      return {
        bg: "#000000",
        icon: <Wind color="#fff" size={36} />,
        label: "RESTING RATE",
        value: post.atRestBPM ? `${post.atRestBPM} bpm` : "-- bpm",
      };
    }
    if (isHumanPerf) {
      return {
        bg: "#10B981",
        icon: <Activity color="#fff" size={36} />,
        label: "BEST VARIANCE",
        value:
          post.bestPerformance?.value !== undefined
            ? `±${Number(post.bestPerformance.value).toFixed(2)}cm`
            : "--",
      };
    }
    if (isSoundChallenge) {
      const dbValues = safeResults
        .map((r: any) => Number(r.decibels || r.db))
        .filter((n: number) => !isNaN(n));
      return {
        bg: "#8B5CF6",
        icon: <Volume2 color="#fff" size={36} />,
        label: "PEAK VOLUME",
        value: dbValues.length > 0 ? `${Math.max(...dbValues)} dB` : "-- dB",
      };
    }
    if (isHandFan)
      return {
        bg: "#059669",
        icon: <Wind color="#fff" size={36} />,
        label: "TRIALS",
        value: `${safeResults.length}`,
      };
    if (isEarthquake)
      return {
        bg: "#B45309",
        icon: <Activity color="#fff" size={36} />,
        label: "EARTHQUAKE SIM",
        value: "Logged",
      };

    return {
      bg: "#1E3A8A",
      icon: <Activity color="#fff" size={36} />,
      label: "DATA LOG",
      value: "Recorded",
    };
  };

  const hero = getHeroConfig();

  if (isMediaPost) {
    return (
      <View style={styles.videoHeaderContainer}>
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>
        <View style={styles.videoPlayerWrapper}>
          <VideoView
            style={styles.videoPlayer}
            player={player}
            fullscreenOptions={{ enable: true }}
            allowsPictureInPicture
          />

          {!activeMediaSource ? (
            <View style={styles.noMediaOverlay} pointerEvents="none">
              <FontAwesome5
                name="video-slash"
                size={24}
                color="rgba(255,255,255,0.7)"
              />
              <Text style={styles.noMediaOverlayText}>
                No media attached to this trial
              </Text>
            </View>
          ) : isSoundChallenge ? (
            <TouchableOpacity
              style={styles.noMediaOverlay}
              activeOpacity={0.9}
              onPress={() => (isPlaying ? player.pause() : player.play())}
            >
              <FontAwesome5
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={64}
                color="#8B5CF6"
              />
              <Text style={styles.noMediaOverlayText}>Audio Track</Text>
              <Text style={{ color: "#fff", fontSize: 12, marginTop: 8 }}>
                Tap anywhere to {isPlaying ? "Pause" : "Play"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {isParachute && (
          <View style={styles.videoToggleContainer}>
            <TouchableOpacity
              style={[
                styles.videoToggleButton,
                { flex: 1 },
                activeVideoTab === "no" && styles.videoToggleButtonActive,
              ]}
              onPress={() => setActiveVideoTab("no")}
            >
              <Text
                style={[
                  styles.videoToggleText,
                  activeVideoTab === "no" && styles.videoToggleTextActive,
                ]}
              >
                No Parachute
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.videoToggleButton,
                { flex: 1 },
                activeVideoTab === "with" && styles.videoToggleButtonActive,
              ]}
              onPress={() => setActiveVideoTab("with")}
            >
              <Text
                style={[
                  styles.videoToggleText,
                  activeVideoTab === "with" && styles.videoToggleTextActive,
                ]}
              >
                With Parachute
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {(isSoundChallenge || isHandFan || isEarthquake) &&
          safeResults.length > 0 && (
            <View style={styles.videoToggleContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12 }}
              >
                {safeResults.map((result: any, index: number) => {
                  const isActive = activeTrialIndex === index;
                  const hasMedia = !!(
                    result.audioUri ||
                    result.audioUrl ||
                    result.videoUrl ||
                    result.videoUri
                  );
                  let title = isHandFan
                    ? `${result.design} (${result.phase})`
                    : result.action ||
                      (result.distance
                        ? `${result.distance}m`
                        : isEarthquake
                          ? result.design
                            ? `Design ${index + 1}`
                            : `Test ${index + 1}`
                          : result.design ||
                            result.phase ||
                            `Trial ${index + 1}`);

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.videoToggleButton,
                        { paddingHorizontal: 16 },
                        isActive && styles.videoToggleButtonActive,
                      ]}
                      onPress={() => setActiveTrialIndex(index)}
                    >
                      <Text
                        style={[
                          styles.videoToggleText,
                          isActive && styles.videoToggleTextActive,
                        ]}
                      >
                        {title} {hasMedia ? " ▶" : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
      </View>
    );
  }

  return (
    <View style={[styles.dataHeroContainer, { backgroundColor: hero.bg }]}>
      <View style={styles.dragHandleContainer}>
        <View style={styles.dragHandle} />
      </View>
      <View style={styles.heroContentCenter}>
        {hero.icon}
        <Text style={styles.heroBannerLabel}>{hero.label}</Text>
        <Text style={styles.heroBannerValue}>{hero.value}</Text>
        <View style={styles.dataReportPill}>
          <Text style={styles.dataReportPillText}>DATA REPORT • NO MEDIA</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  videoHeaderContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#000000",
    position: "relative",
    justifyContent: "center",
  },
  videoPlayerWrapper: { flex: 1, position: "relative" },
  videoPlayer: { width: "100%", height: "100%" },
  noMediaOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  noMediaOverlayText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 12,
    fontWeight: "bold",
  },
  videoToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  videoToggleButton: {
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  videoToggleButtonActive: { borderBottomColor: "#FF5A00" },
  videoToggleText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  videoToggleTextActive: { color: "#FF5A00" },
  dataHeroContainer: {
    width: "100%",
    height: 260,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  heroContentCenter: { alignItems: "center", marginTop: 20 },
  heroBannerLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 12,
    textTransform: "uppercase",
  },
  heroBannerValue: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "900",
    marginVertical: 4,
  },
  dataReportPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  dataReportPillText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  dragHandleContainer: {
    position: "absolute",
    top: 12,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
