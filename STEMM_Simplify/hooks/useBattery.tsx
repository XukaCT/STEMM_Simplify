import { Ionicons } from "@expo/vector-icons";
import * as Battery from "expo-battery";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// 1. The Custom Hook (Logic)
export function useBattery() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBattery = async () => {
      const level = await Battery.getBatteryLevelAsync();
      if (isMounted && level !== -1) {
        setBatteryLevel(Math.round(level * 100));
      }
    };
    fetchBattery();

    const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      if (isMounted && batteryLevel !== -1) {
        setBatteryLevel(Math.round(batteryLevel * 100));
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  const getBatteryIcon = () => {
    if (batteryLevel === null) return "battery-charging-outline";
    if (batteryLevel >= 80) return "battery-full";
    if (batteryLevel >= 30) return "battery-half";
    return "battery-dead";
  };

  const getBatteryColor = () => {
    if (batteryLevel !== null && batteryLevel <= 20) return "#EF4444";
    return "#10B981";
  };

  return { batteryLevel, getBatteryIcon, getBatteryColor };
}

// 2. The Shared Component (UI)
export function BatteryIndicator() {
  const { batteryLevel, getBatteryIcon, getBatteryColor } = useBattery();

  return (
    <View style={styles.batteryContainer}>
      <Text style={styles.batteryText}>
        {batteryLevel !== null ? `${batteryLevel}%` : "--%"}
      </Text>
      <Ionicons name={getBatteryIcon()} size={20} color={getBatteryColor()} />
    </View>
  );
}

const styles = StyleSheet.create({
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  batteryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 6,
  },
});
