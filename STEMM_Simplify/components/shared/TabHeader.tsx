import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BatteryIndicator } from "../../hooks/useBattery";

interface TabHeaderProps {
  title: string;
  subtitle: string;
  showBattery?: boolean;
}

export default function TabHeader({
  title,
  subtitle,
  showBattery = false,
}: TabHeaderProps) {
  return (
    <View style={styles.headerBackground}>
      <View style={styles.headerTopRow}>
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>

        {/* Drops the Battery in instantly if requested! */}
        {showBattery && <BatteryIndicator />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: "#000",
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 4,
  },
});
