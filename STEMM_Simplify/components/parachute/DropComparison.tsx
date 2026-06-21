import { AlertCircle, CheckCircle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DropComparisonProps {
  heightNo: number;
  timeNo: number;
  speedNo: string;
  heightWith: number;
  timeWith: number;
  speedWith: string;
  timeDiffPercent: string;
  isSuccess: boolean;
}

const DataRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

export default function DropComparison({
  heightNo,
  timeNo,
  speedNo,
  heightWith,
  timeWith,
  speedWith,
  timeDiffPercent,
  isSuccess,
}: DropComparisonProps) {
  return (
    <>
      <View style={styles.row}>
        <View style={[styles.subCard, styles.redBorder]}>
          <Text style={[styles.label, { color: "#EF4444" }]}>NO PARACHUTE</Text>
          <DataRow label="Height" value={`${heightNo} m`} />
          <DataRow label="Time" value={`${timeNo} s`} />
          <DataRow label="Speed" value={`${speedNo} m/s`} />
        </View>

        <View style={[styles.subCard, styles.greenBorder]}>
          <Text style={[styles.label, { color: "#10B981" }]}>
            WITH PARACHUTE
          </Text>
          <DataRow label="Height" value={`${heightWith} m`} />
          <DataRow label="Time" value={`${timeWith} s`} />
          <DataRow label="Speed" value={`${speedWith} m/s`} />
        </View>
      </View>

      <View
        style={[styles.diffCard, isSuccess ? styles.successBg : styles.failBg]}
      >
        <Text style={styles.diffLabel}>TIME DIFFERENCE</Text>
        <Text
          style={[
            styles.diffValue,
            { color: isSuccess ? "#059669" : "#D97706" },
          ]}
        >
          {isSuccess ? "+" : ""}
          {timeDiffPercent}%
        </Text>
        <View style={styles.statusRow}>
          {isSuccess ? (
            <CheckCircle size={16} color="#059669" />
          ) : (
            <AlertCircle size={16} color="#D97706" />
          )}
          <Text
            style={[
              styles.statusText,
              { color: isSuccess ? "#059669" : "#D97706" },
            ]}
          >
            {isSuccess
              ? "Great job! The parachute slowed the fall."
              : "Parachute didn't slow the fall — try again!"}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  subCard: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1 },
  redBorder: { borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  greenBorder: { borderColor: "#A7F3D0", backgroundColor: "#ECFDF5" },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dataLabel: { fontSize: 12, color: "#6B7280" },
  dataValue: { fontSize: 12, fontWeight: "bold", color: "#111" },
  diffCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  successBg: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" },
  failBg: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" },
  diffLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  diffValue: { fontSize: 36, fontWeight: "bold", marginVertical: 8 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { fontSize: 13, fontWeight: "600" },
});
