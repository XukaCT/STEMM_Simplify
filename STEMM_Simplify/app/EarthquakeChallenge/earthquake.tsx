import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

const CodedEarthquakeDiagram = () => (
  <View
    style={{
      height: 280,
      width: "100%",
      backgroundColor: "#F9FAFB",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Ground */}
    <View
      style={{
        position: "absolute",
        bottom: 20,
        width: "100%",
        height: 15,
        backgroundColor: "#8B4513",
      }}
    />
    <Ionicons
      name="pulse"
      size={40}
      color="#EF4444"
      style={{ position: "absolute", bottom: 20, left: "45%", opacity: 0.5 }}
    />

    {/* Structure Base */}
    <View
      style={{
        position: "absolute",
        bottom: 35,
        left: "30%",
        width: "40%",
        height: 10,
        backgroundColor: "#D1D5DB",
        borderRadius: 2,
      }}
    />

    {/* Pillars (Paper folds) */}
    <View
      style={{
        position: "absolute",
        bottom: 45,
        left: "35%",
        width: 15,
        height: 60,
        backgroundColor: "#FCD34D",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#F59E0B",
      }}
    />
    <View
      style={{
        position: "absolute",
        bottom: 45,
        right: "35%",
        width: 15,
        height: 60,
        backgroundColor: "#FCD34D",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#F59E0B",
      }}
    />

    {/* Top Platform */}
    <View
      style={{
        position: "absolute",
        bottom: 105,
        left: "25%",
        width: "50%",
        height: 10,
        backgroundColor: "#D1D5DB",
        borderRadius: 2,
      }}
    />

    {/* Phone Sensor */}
    <View
      style={{
        position: "absolute",
        bottom: 115,
        left: "42%",
        alignItems: "center",
      }}
    >
      <Ionicons name="phone-portrait" size={50} color="#111" />
      <Text
        style={{
          fontSize: 10,
          color: "#10B981",
          fontWeight: "bold",
          position: "absolute",
          top: 15,
        }}
      >
        SENSOR
      </Text>
    </View>

    {/* Shake Lines */}
    <Ionicons
      name="wifi"
      size={30}
      color="#FF5A00"
      style={{
        position: "absolute",
        top: 60,
        left: "30%",
        transform: [{ rotate: "-45deg" }],
      }}
    />
    <Ionicons
      name="wifi"
      size={30}
      color="#FF5A00"
      style={{
        position: "absolute",
        top: 60,
        right: "30%",
        transform: [{ rotate: "45deg" }],
      }}
    />
  </View>
);

export default function EarthquakeChallenge() {
  return (
    <ActivityPrepScreen
      title="Earthquake Structure"
      subtitle="Engineering & Physics"
      overview="Students design structures to withstand vibration, simulating earthquakes. They will test how different pillar shapes and materials absorb kinetic energy."
      diagram={<CodedEarthquakeDiagram />}
      equipmentList={[
        "Cardboard, paper, scissors, sticky tape",
        "Plastic/paper cups",
        "Mobile phone with STEMM Lab app",
      ]}
      instructions={[
        "Build an anti-vibration base layer by folding paper/cardboard.",
        "Place a flat cardboard platform on top of your supports.",
        "Place the phone in the centre and tap 'Start Vibration'.",
        "Record the peak shake intensity (G-Force).",
        "Redesign your pillars to absorb more shock and test again.",
      ]}
      knowledgeBlocks={[
        {
          title: "Seismic Waves & Energy",
          details: [
            "Earthquakes release kinetic energy through the ground as seismic waves.",
            "Rigid buildings transfer this energy straight up, causing them to crack or snap.",
          ],
        },
        {
          title: "Base Isolation",
          details: [
            "Engineers use 'Base Isolation'—placing flexible pads (like rubber or springs) between the building and the ground.",
            "This allows the ground to shake underneath while the building stays relatively still.",
          ],
        },
        {
          title: "Structural Integrity",
          details: [
            "Triangles and accordion folds are much stronger and more flexible than simple straight pillars.",
          ],
        },
      ]}
      nextRoute="/EarthquakeChallenge/activityPage"
    />
  );
}
