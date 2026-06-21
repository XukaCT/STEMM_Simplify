import { Ionicons } from "@expo/vector-icons";
import { createAudioPlayer } from "expo-audio";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SoundRecordingListProps {
  results: any[];
}

export default function SoundRecordingList({
  results,
}: SoundRecordingListProps) {
  const playSound = (uri: string) => {
    if (!uri) return;
    try {
      const player = createAudioPlayer(uri);
      player.play();
    } catch (e) {
      console.error("Playback failed", e);
    }
  };

  if (!results || results.length === 0) {
    return <Text style={styles.emptyText}>No recordings found.</Text>;
  }

  return (
    <View>
      {results.map((item: any) => (
        <View key={item.id} style={styles.recordingItem}>
          <View>
            <Text style={styles.recordingAction}>{item.action}</Text>
            <Text style={styles.recordingDb}>{item.db} dB</Text>
          </View>
          <TouchableOpacity onPress={() => playSound(item.audioUri)}>
            <Ionicons name="play-circle" size={36} color="#FF5A00" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  recordingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  recordingAction: { fontSize: 14, fontWeight: "500", color: "#111" },
  recordingDb: {
    fontSize: 12,
    color: "#FF5A00",
    marginTop: 2,
    fontWeight: "bold",
  },
  emptyText: { color: "#888", fontStyle: "italic", paddingVertical: 10 },
});
