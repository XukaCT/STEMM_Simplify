import { Trash2, Upload, Video } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HandFanVideoListProps {
  results: any[];
  onPickVideo: (id: string) => void;
  onRemoveVideo: (id: string) => void;
}

export default function HandFanVideoList({
  results,
  onPickVideo,
  onRemoveVideo,
}: HandFanVideoListProps) {
  if (!results || results.length === 0) {
    return <Text style={styles.emptyText}>No results recorded.</Text>;
  }

  return (
    <View style={styles.resultsContainer}>
      {results.map((item: any) => (
        <View key={item.id} style={styles.resultBlock}>
          <View style={styles.resultItem}>
            <View>
              <Text style={styles.resultText}>Design: {item.design}</Text>
              <Text style={styles.resultSubtext}>
                {item.phase} • Dist: {item.distance}
              </Text>
            </View>
            <Text style={styles.resultAngle}>{item.angle}</Text>
          </View>

          {!item.videoUri ? (
            <TouchableOpacity
              style={styles.miniUploadArea}
              onPress={() => onPickVideo(item.id)}
            >
              <Upload size={16} color="#888" />
              <Text style={styles.miniUploadText}>Attach Video</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.miniVideoSelectedArea}>
              <View style={styles.videoFileRow}>
                <Video size={16} color="#333" />
                <Text style={styles.videoFileName} numberOfLines={1}>
                  Video Attached
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onRemoveVideo(item.id)}
              >
                <Trash2 size={18} color="#DC2626" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: { marginBottom: 8 },
  resultBlock: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultText: { fontWeight: "600", fontSize: 14, color: "#333" },
  resultSubtext: { fontSize: 12, color: "#666", marginTop: 2 },
  resultAngle: { fontSize: 16, fontWeight: "bold", color: "#FF5A00" },
  emptyText: { color: "#888", fontStyle: "italic", marginBottom: 16 },
  miniUploadArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderStyle: "dashed",
  },
  miniUploadText: { fontSize: 13, color: "#555", marginLeft: 6 },
  miniVideoSelectedArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  videoFileRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  videoFileName: { marginLeft: 8, fontSize: 13, color: "#333", flex: 1 },
  deleteButton: { padding: 4 },
});
