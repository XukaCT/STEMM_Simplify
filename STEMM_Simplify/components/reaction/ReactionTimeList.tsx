import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ReactionTimeListProps {
  records: any[];
}

export default function ReactionTimeList({ records }: ReactionTimeListProps) {
  if (!records || records.length === 0) {
    return <Text style={styles.emptyText}>No data recorded.</Text>;
  }

  return (
    <View style={styles.resultsContainer}>
      {records.map((item: any, index: number) => (
        <View key={item.id || index} style={styles.resultBlock}>
          <View style={styles.resultItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultText}>{item.name}</Text>
              <Text style={styles.resultSubtext} numberOfLines={1}>
                {item.phase}
              </Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>{item.score}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: { marginBottom: 8 },
  resultBlock: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    padding: 12,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultText: { fontWeight: "bold", fontSize: 15, color: "#111" },
  resultSubtext: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  scoreBox: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scoreText: { fontSize: 15, fontWeight: "bold", color: "#FF5A00" },
  emptyText: { color: "#888", fontStyle: "italic", marginBottom: 16 },
});
