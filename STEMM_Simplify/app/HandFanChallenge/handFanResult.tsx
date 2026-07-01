import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video as ExpoVideo, ResizeMode } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  MessageSquare,
  Play,
  Video as VideoIcon,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { saveActivityToFeed } from "../../utils/localStore";

const ACTIVITY_ID = "3";

export default function HandFanResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [results, setResults] = useState<any[]>([]);

  // Rewatch Player State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentPlayUri, setCurrentPlayUri] = useState<string | null>(null);

  const openVideo = (uri: string) => {
    setCurrentPlayUri(uri);
    setIsPlayingVideo(true);
  };

  const closeVideo = () => {
    setIsPlayingVideo(false);
    setCurrentPlayUri(null);
  };

  useEffect(() => {
    const loadTempData = async () => {
      try {
        const stored = await AsyncStorage.getItem("@temp_handfan_data");
        if (stored) {
          setResults(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load temp results", e);
      }
    };
    loadTempData();
  }, []);

  const calculatePoints = () => {
    const basePoints = 1000;
    const validTrialsForPoints = Math.min(results.length, 3);
    const trialPoints = validTrialsForPoints * 500;
    const bestAngle = Math.max(
      0,
      ...results.map((r) => parseInt(r.angle) || 0),
    );
    const performancePoints = bestAngle * 20;

    return basePoints + trialPoints + performancePoints;
  };

  const finalScore = calculatePoints();

  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const mainVideoUrl = results.find((r) => r.videoUri)?.videoUri || null;

      const activityData = {
        collectionName: "handfan_challenge",
        activityName: "Hand Fan Challenge",
        activityType: "video",
        title: "Engineering Test Complete!",
        teamName: "My Team",
        comments,
        results: results,
        locationName: "Local Device",
        videoUrl: mainVideoUrl,
        points: finalScore,
        createdAt: new Date().toISOString(),
        heroLabel: "DESIGNS",
        heroStat: `${results.length} TESTED`,
      };

      await saveActivityToFeed(activityData);
      await AsyncStorage.removeItem("@temp_handfan_data");

      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      console.error("Submission error: ", e);
      Alert.alert("Error", "Failed to save results.");
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
            Review and share your results
          </Text>
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <VideoIcon size={20} color="#FF6B00" />
            <Text style={GlobalStyles.cardTitle}>Final Test Log</Text>
          </View>

          {results.length === 0 ? (
            <Text
              style={{ color: "#888", fontStyle: "italic", marginBottom: 16 }}
            >
              No results recorded.
            </Text>
          ) : (
            results.map((item) => (
              <View key={item.id} style={styles.readOnlyBlock}>
                <View style={styles.readOnlyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.readOnlyTitle}>{item.design}</Text>
                    <Text style={styles.readOnlySubtitle}>
                      {item.phase} • Dist: {item.distance}
                    </Text>
                  </View>
                  <Text style={styles.readOnlyAngle}>{item.angle}</Text>
                </View>

                {item.videoUri ? (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => openVideo(item.videoUri!)}
                  >
                    <Play size={16} color="#FF6B00" fill="#FF6B00" />
                    <Text style={styles.playButtonText}>Watch Test Video</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.noVideoBadge}>
                    <Text style={styles.noVideoText}>No Video Recorded</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <MessageSquare size={20} color="#FF6B00" />
            <Text style={GlobalStyles.cardTitle}>Outcome Comments</Text>
          </View>
          <Text style={GlobalStyles.commentsLabel}>
            What did you learn? What worked well?
          </Text>
          <TextInput
            style={GlobalStyles.textInput}
            placeholder="Type your observations here..."
            placeholderTextColor="#999"
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
            { backgroundColor: "#FF6B00" },
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

      {/* REWATCH MODAL */}
      <Modal
        visible={isPlayingVideo}
        transparent={true}
        animationType="fade"
        onRequestClose={closeVideo}
      >
        <View style={styles.modalBackground}>
          <View style={styles.videoPlayerContainer}>
            <TouchableOpacity
              style={styles.closeVideoButton}
              onPress={closeVideo}
            >
              <X size={28} color="#fff" />
            </TouchableOpacity>
            {currentPlayUri && (
              <ExpoVideo
                source={{ uri: currentPlayUri }}
                style={styles.fullVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  readOnlyBlock: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  readOnlyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  readOnlyTitle: { fontWeight: "600", fontSize: 15, color: "#333" },
  readOnlySubtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  readOnlyAngle: { fontSize: 18, fontWeight: "bold", color: "#FF6B00" },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0F2FE",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  playButtonText: {
    color: "#FF6B00",
    fontWeight: "600",
    fontSize: 13,
    marginLeft: 6,
  },
  noVideoBadge: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  noVideoText: { color: "#9CA3AF", fontSize: 12, fontStyle: "italic" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayerContainer: {
    width: "100%",
    height: 500,
    backgroundColor: "#000",
    position: "relative",
  },
  closeVideoButton: {
    position: "absolute",
    top: -50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  fullVideo: { width: "100%", height: "100%" },
});
