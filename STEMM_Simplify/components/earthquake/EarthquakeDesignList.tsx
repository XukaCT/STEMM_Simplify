import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EarthquakeDesignListProps {
  designs: any[];
}

export default function EarthquakeDesignList({
  designs,
}: EarthquakeDesignListProps) {
  if (!designs || designs.length === 0) {
    return <Text style={styles.emptyText}>No designs recorded.</Text>;
  }

  return (
    <View style={styles.resultsContainer}>
      {designs.map((item: any, index: number) => (
        <View key={item.id || index} style={styles.resultBlock}>
          {/* Design Name */}
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Design {index + 1}</Text>
            <Text style={styles.resultSubtitle}>
              {item.design || "No design description"}
            </Text>
          </View>

          {/* Predicted vs Actual Data Box */}
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Predicted</Text>
              <Text style={styles.metricValue}>{item.predicted || "0"} G</Text>
            </View>
            <View style={[styles.metricBox, styles.metricBoxHighlight]}>
              <Text style={[styles.metricLabel, { color: "#9A3412" }]}>
                Actual Result
              </Text>
              <Text style={[styles.metricValue, { color: "#FF5A00" }]}>
                {item.actual || "0"} G
              </Text>
            </View>
          </View>

          {/* Observations */}
          <View style={styles.observationBox}>
            <Text style={styles.observationLabel}>Observations:</Text>
            <Text style={styles.observationText}>
              {item.observations || "No observations recorded."}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: { marginBottom: 8 },
  resultBlock: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  resultHeader: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  resultTitle: { fontWeight: "bold", fontSize: 14, color: "#111" },
  resultSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  metricsRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  metricBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  metricBoxHighlight: {
    backgroundColor: "#FFF7ED",
    borderRadius: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  observationBox: { padding: 12, backgroundColor: "#FAFAFA" },
  observationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 4,
  },
  observationText: { fontSize: 13, color: "#374151", lineHeight: 20 },
  emptyText: { color: "#888", fontStyle: "italic", marginBottom: 16 },
});
