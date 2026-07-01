import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SoundRecordingList from "../../components/sound/SoundRecordingList";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { saveActivityToFeed } from "../../utils/localStore";

const ACTIVITY_ID = "2";

export default function ResultScreen() {
  const params = useLocalSearchParams();

  let parsedRaw = [];
  if (typeof params.results === "string") {
    try {
      parsedRaw = JSON.parse(decodeURIComponent(params.results));
    } catch (e) {
      parsedRaw = JSON.parse(params.results);
    }
  } else {
    parsedRaw = params.results || [];
  }
  const results = parsedRaw;
  const teamName = (params.teamName as string) || "Unknown Team";

  const calculatePoints = () => {
    const basePoints = 1000;
    const validTrialsForPoints = Math.min(results.length, 5);
    const trialPoints = validTrialsForPoints * 300;
    const peakDb = Math.max(
      0,
      ...results.map((r: any) => parseFloat(r.decibels || r.db) || 0),
    );
    const performancePoints = Math.floor(peakDb * 10);

    return basePoints + trialPoints + performancePoints;
  };

  const finalScore = calculatePoints();

  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    })();
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const submissionData = {
        collectionName: "sound_challenge",
        activityName: "Sound Challenge",
        activityType: "generic",
        title: "Audio Log Complete!",
        teamName: teamName,
        locationName: "Local Device", // Hardcoded
        comments,
        videoUrl: results.length > 0 ? results?.audioUri : null, // Safely reference first audio
        results: results,
        points: finalScore,
        createdAt: new Date().toISOString(),
        heroLabel: "NOISE",
        heroStat: `${results.length} LOGS`,
      };

      await saveActivityToFeed(submissionData);

      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit results.");
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={GlobalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={GlobalStyles.headerContainer}>
          <View style={GlobalStyles.successCircle}>
            <Ionicons name="checkmark" size={32} color="#fff" />
          </View>
          <Text style={GlobalStyles.headerTitle}>Activity Complete!</Text>
          <Text style={GlobalStyles.headerSubtitle}>
            Share your results with the team
          </Text>
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Ionicons name="cloud-upload-outline" size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Recorded Clips</Text>
          </View>
          <SoundRecordingList results={results} />
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Ionicons name="chatbubble-outline" size={20} color="#FF5A00" />
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
            isSubmitting && GlobalStyles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
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
