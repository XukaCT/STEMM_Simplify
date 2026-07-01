import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  MessageSquare,
  Timer,
  Video
} from "lucide-react-native";
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
import DropComparison from "../../components/parachute/DropComparison";
import UploadPlaceholder from "../../components/parachute/UploadPlaceholder";
import { GlobalStyles } from "../../constants/GlobalStyles";

import { saveActivityToFeed, saveVideoLocally } from "../../utils/localStore";

export default function ParachuteResults() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [videoNoUri, setVideoNoUri] = useState<string | null>(
    (params.videoNoUri as string) || null,
  );
  const [videoWithUri, setVideoWithUri] = useState<string | null>(
    (params.videoWithUri as string) || null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState("");

  const heightNo = parseFloat(params.heightNo as string) || 0;
  const timeNo = parseFloat(params.timeNo as string) || 0;
  const heightWith = parseFloat(params.heightWith as string) || 0;
  const timeWith = parseFloat(params.timeWith as string) || 0;

  const speedNo = timeNo > 0 ? (heightNo / timeNo).toFixed(2) : "0.00";
  const speedWith = timeWith > 0 ? (heightWith / timeWith).toFixed(2) : "0.00";
  const timeDiffPercent =
    timeNo > 0 ? (((timeWith - timeNo) / timeNo) * 100).toFixed(1) : "0.0";
  const isSuccess = parseFloat(timeDiffPercent) > 0;

  const calculatePoints = () => {
    const basePoints = 1000;
    const speedDifference = Math.max(
      0,
      parseFloat(speedNo) - parseFloat(speedWith),
    );
    const performancePoints = Math.floor(speedDifference * 300);

    return basePoints + performancePoints;
  };

  const finalScore = calculatePoints();

  const pickVideo = async (type: "no" | "with") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (type === "no") setVideoNoUri(result.assets[0].uri);
      if (type === "with") setVideoWithUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const timestamp = Date.now();

      const localNoVideoUrl = videoNoUri
        ? await saveVideoLocally(
            videoNoUri,
            `no_parachute_${timestamp}.mp4`,
            "parachute",
          )
        : null;
      const localWithVideoUrl = videoWithUri
        ? await saveVideoLocally(
            videoWithUri,
            `with_parachute_${timestamp}.mp4`,
            "parachute",
          )
        : null;

      const activityData = {
        activityName: "Parachute Drop",
        activityType: "video",
        title: "Parachute Drop Complete!",
        teamName: "My Team",
        locationName: "Local Device", // Hardcoded
        comments,
        videoUrl: localWithVideoUrl || localNoVideoUrl,
        noVideoUrl: localNoVideoUrl,
        withVideoUrl: localWithVideoUrl,
        heightNo,
        timeNo,
        heightWith,
        timeWith,
        points: finalScore,
      };

      await saveActivityToFeed(activityData);

      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to save.");
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
            Share your parachute data
          </Text>
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Timer size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Drop Comparison</Text>
          </View>
          <DropComparison
            heightNo={heightNo}
            timeNo={timeNo}
            speedNo={speedNo}
            heightWith={heightWith}
            timeWith={timeWith}
            speedWith={speedWith}
            timeDiffPercent={timeDiffPercent}
            isSuccess={isSuccess}
          />
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Video size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>
              Experiment Videos{" "}
              <Text
                style={{ color: "#9CA3AF", fontSize: 13, fontWeight: "normal" }}
              >
                (Optional)
              </Text>
            </Text>
          </View>
          <View style={styles.row}>
            {videoNoUri ? (
              <View
                style={[
                  styles.attachedBox,
                  { backgroundColor: "#FEF2F2", borderColor: "#EF4444" },
                ]}
              >
                <Check size={28} color="#EF4444" />
                <Text style={[styles.attachedText, { color: "#EF4444" }]}>
                  Baseline Video Attached!
                </Text>
              </View>
            ) : (
              <UploadPlaceholder
                label="Upload Baseline"
                color="#FEF2F2"
                iconColor="#EF4444"
                hasVideo={false}
                onPress={() => pickVideo("no")}
              />
            )}

            {videoWithUri ? (
              <View
                style={[
                  styles.attachedBox,
                  { backgroundColor: "#F0FDF4", borderColor: "#10B981" },
                ]}
              >
                <Check size={28} color="#10B981" />
                <Text style={[styles.attachedText, { color: "#10B981" }]}>
                  Impact Video Attached!
                </Text>
              </View>
            ) : (
              <UploadPlaceholder
                label="Upload Impact"
                color="#F0FDF4"
                iconColor="#10B981"
                hasVideo={false}
                onPress={() => pickVideo("with")}
              />
            )}
          </View>
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <MessageSquare size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Outcome Comments</Text>
          </View>
          <Text style={GlobalStyles.commentsLabel}>
            What did you learn about air resistance?
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
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  attachedBox: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  attachedText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  understandingBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  understandingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  understandingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginLeft: 8,
  },
  understandingIntro: {
    fontSize: 13,
    color: "#1E3A8A",
    lineHeight: 20,
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
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E3A8A",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bulletList: { gap: 6 },
  bulletItem: { fontSize: 12, color: "#1E3A8A", lineHeight: 18 },
});
