import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, MessageSquare, Zap } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactionTimeList from "../../components/reaction/ReactionTimeList";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { saveActivityToFeed } from "../../utils/localStore";

const ACTIVITY_ID = "6";

export default function ReactionResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activityData = params.activityData;
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [records, setRecords] = useState<any[]>(() => {
    if (activityData && typeof activityData === "string") {
      try {
        return JSON.parse(decodeURIComponent(activityData));
      } catch (e) {
        try {
          return JSON.parse(activityData);
        } catch (err) {
          console.error("Failed to parse activity data", err);
          return [];
        }
      }
    }
    return [];
  });

  const calculateRealPoints = () => {
    if (records.length === 0) return 500;
    let totalPoints = 0;
    records.forEach((r) => {
      if (r.phase.includes("Phase 1")) {
        const time = parseInt(r.score);
        if (!isNaN(time)) totalPoints += Math.max(10, 1000 - time);
      } else if (r.phase.includes("Phase 2")) {
        const acc = parseInt(r.score);
        if (!isNaN(acc)) totalPoints += acc * 10;
      }
    });
    return totalPoints;
  };

  const finalScore = calculateRealPoints();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const submissionData = {
        collectionName: "reaction_challenge",
        activityName: "Reaction Board Challenge",
        activityType: "reaction",
        title: "Reaction Test Complete!",
        teamName: "My Team",
        locationName: "Local Device", // Hardcoded
        comments,
        teamRecords: records,
        points: finalScore,
        createdAt: new Date().toISOString(),
        heroLabel: "TESTS",
        heroStat: `${records.length} DONE`,
      };

      await saveActivityToFeed(submissionData);
      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      console.error("Submission error: ", e);
      alert("Failed to save results.");
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
            Share your team's results
          </Text>
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Zap size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Team Results Summary</Text>
          </View>
          <ReactionTimeList records={records} />
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <MessageSquare size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Outcome Comments</Text>
          </View>
          <Text style={GlobalStyles.commentsLabel}>
            What did you learn? Did dominant hands perform better?
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
