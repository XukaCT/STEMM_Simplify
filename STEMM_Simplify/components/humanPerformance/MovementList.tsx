import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MovementListProps {
  records: any[];
}

export default function MovementList({ records }: MovementListProps) {
  if (records.length === 0) {
    return <Text style={styles.emptyText}>No data recorded.</Text>;
  }

  return (
    <View style={styles.dataListContainer}>
      {records.map((item: any, index: number) => {
        const barWidth = `${Math.min((item.value / 10) * 100, 100)}%`;
        const isSmooth = item.status === "Smooth";

        return (
          <View key={item.id} style={styles.recordRow}>
            <View style={styles.recordTopRow}>
              <Text style={styles.recordName}>
                <Text style={{ color: "#9CA3AF" }}>#{index + 1} </Text>
                {item.movement}
              </Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.recordValue}>±{item.value.toFixed(2)}cm</Text>
                <Text style={[styles.recordStatus, !isSmooth && { color: "#DC2626" }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { width: barWidth as any },
                  !isSmooth && { backgroundColor: "#DC2626" },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dataListContainer: { padding: 16 },
  recordRow: { marginBottom: 16 },
  recordTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recordName: { fontSize: 14, color: "#111", fontWeight: "500" },
  recordValue: { fontSize: 16, fontWeight: "bold", color: "#FF5A00" },
  recordStatus: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "600",
    textAlign: "right",
  },
  barBackground: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: "#84CC16", borderRadius: 4 },
  emptyText: { color: "#9CA3AF", fontStyle: "italic", fontSize: 13 },
});