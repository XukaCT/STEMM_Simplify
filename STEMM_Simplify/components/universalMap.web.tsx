import React from "react";
import { Text, View } from "react-native";

export default function UniversalMap() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F0F9FF",
      }}
    >
      <Text style={{ color: "#555" }}>
        Interactive maps are only available on the mobile app.
      </Text>
    </View>
  );
}
