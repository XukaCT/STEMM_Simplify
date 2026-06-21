import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SoundResult {
  id: string;
  action: string;
  db: number;
  audioUri: string | null;
}

export default function SoundPollutionHunter() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { startTime } = params;
  const [actionText, setActionText] = useState("");
  const [decibels, setDecibels] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [results, setResults] = useState<SoundResult[]>([]);

  // Refs for tracking
  const maxDbRef = useRef(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Clean up audio on unmount so it doesn't run in the background
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission required", "Please grant microphone access.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      maxDbRef.current = 0;
      setDecibels(0);
      setCurrentUri(null);

      // Create a completely fresh recording instance and unique file for every take!
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.isRecording && status.metering !== undefined) {
            // Map the metering to match your exact previous decibel logic
            const currentDb = Math.max(0, Math.round(status.metering + 100));
            setDecibels(currentDb);
            if (currentDb > maxDbRef.current) {
              maxDbRef.current = currentDb;
            }
          }
        },
        100, // update interval
      );

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setDecibels(maxDbRef.current);

      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();

        // expo-av automatically guarantees a unique file name every single time!
        const uri = recordingRef.current.getURI();
        setCurrentUri(uri);
        recordingRef.current = null;
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const handleSaveResult = () => {
    if (!actionText.trim() || !currentUri) return;

    const newResult: SoundResult = {
      id: Date.now().toString(),
      action: actionText,
      db: decibels,
      audioUri: currentUri,
    };

    setResults([...results, newResult]);

    setActionText("");
    setDecibels(0);
    setCurrentUri(null);
    maxDbRef.current = 0;
  };

  const handleDeleteResult = (id: string) => {
    // Just remove from array.
    // The unique temp files will be safely cleared by the OS cache automatically.
    setResults(results.filter((item) => item.id !== id));
  };

  const playRecording = async (uri: string | null) => {
    if (!uri) return;

    try {
      // Safely toggle the audio mode to playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Create a fresh player for the specific file
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.error("Playback failed:", error);
    }
  };

  const handleCompleteActivity = () => {
    if (results.length === 0) {
      Alert.alert("Please record and save at least one sound first!");
      return;
    }

    router.push({
      pathname: "/SoundPollutionHunter/soundResult",
      params: {
        results: JSON.stringify(results),
        startTime: startTime as string,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Sound Pollution Hunter</Text>
          <Text style={styles.headerSubtitle}>
            Environmental Science + Physics
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.label}>Action</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Dropping a pen"
            value={actionText}
            onChangeText={setActionText}
            editable={!isRecording}
          />

          <View style={styles.dbContainer}>
            <Text style={styles.dbNumber}>{decibels}</Text>
            <Text style={styles.dbText}>Decibels (dB)</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isRecording && styles.recordingButton,
            ]}
            onPress={toggleRecording}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={20}
              color="white"
              style={styles.btnIcon}
            />
            <Text style={styles.buttonText}>
              {isRecording ? "Stop Measuring" : "Measure Sound"}
            </Text>
          </TouchableOpacity>

          {!isRecording && currentUri && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSaveResult}
            >
              <Ionicons
                name="save-outline"
                size={20}
                color="white"
                style={styles.btnIcon}
              />
              <Text style={styles.buttonText}>Save Result</Text>
            </TouchableOpacity>
          )}
        </View>

        {results.length > 0 && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Results</Text>
            {results.map((item) => (
              <View key={item.id} style={styles.resultRow}>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultAction}>{item.action}</Text>
                  <Text style={styles.resultDbSmall}>{item.db} dB</Text>
                </View>

                <View style={styles.resultRightSide}>
                  <TouchableOpacity
                    onPress={() => playRecording(item.audioUri)}
                    style={styles.playIcon}
                  >
                    <Ionicons name="play-circle" size={26} color="#FF6B00" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteResult(item.id)}
                    style={styles.deleteIcon}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Understanding Sound Pollution</Text>
          <Text style={styles.infoText}>
            Sound is measured in decibels (dB). Prolonged exposure to sounds
            above 85 dB can damage hearing.
          </Text>
          <View style={styles.referenceBox}>
            <Text style={styles.referenceTitle}>Sound Level Reference:</Text>
            <Text style={styles.referenceText}>
              30-40 dB = Whisper or quiet library
            </Text>
            <Text style={styles.referenceText}>
              50-60 dB = Normal conversation
            </Text>
            <Text style={styles.referenceText}>
              70-80 dB = Traffic or vacuum cleaner
            </Text>
            <Text style={styles.referenceText}>
              85+ dB = Hearing damage zone
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteActivity}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="white"
            style={styles.btnIcon}
          />
          <Text style={styles.buttonText}>Complete Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#000",
  },
  backButton: { marginRight: 16 },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  headerSubtitle: { color: "#AAA", fontSize: 14 },
  scrollContent: { padding: 16, backgroundColor: "#F9FAFB", minHeight: "100%" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: { fontSize: 14, color: "#4B5563", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  dbContainer: { alignItems: "center", marginBottom: 24 },
  dbNumber: { fontSize: 64, fontWeight: "bold", color: "#FF6B00" },
  dbText: { fontSize: 16, color: "#6B7280" },
  primaryButton: {
    backgroundColor: "#FF6B00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  recordingButton: { backgroundColor: "#FF3B30" },
  secondaryButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
  },
  btnIcon: { marginRight: 8 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  resultsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resultsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  resultTextContainer: { flex: 1 },
  resultAction: { fontSize: 16, fontWeight: "500" },
  resultDbSmall: { fontSize: 14, color: "#FF6B00", fontWeight: "bold" },
  resultRightSide: { flexDirection: "row", alignItems: "center" },
  playIcon: { paddingHorizontal: 10 },
  deleteIcon: { padding: 4 },
  infoBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
    marginBottom: 16,
  },
  referenceBox: { backgroundColor: "#FFF", padding: 16, borderRadius: 12 },
  referenceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  referenceText: { fontSize: 12, color: "#1E40AF", marginBottom: 4 },
  completeButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
});
