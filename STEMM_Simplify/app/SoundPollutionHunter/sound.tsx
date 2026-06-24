import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

const CodedSoundDiagram = () => (
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
    {/* Table */}
    <View
      style={{
        position: "absolute",
        bottom: 40,
        width: "100%",
        height: 10,
        backgroundColor: "#8B4513",
      }}
    />
    {/* Phone Recording */}
    <View
      style={{
        position: "absolute",
        bottom: 50,
        left: 50,
        alignItems: "center",
      }}
    >
      <Ionicons name="phone-portrait" size={40} color="#111" />
      <Ionicons
        name="mic"
        size={16}
        color="#FF5A00"
        style={{ position: "absolute", top: 12 }}
      />
      <Text style={{ fontSize: 10, color: "#111", fontWeight: "bold" }}>
        Phone Mic
      </Text>
    </View>
    {/* Distance Ruler */}
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 90,
        width: 100,
        borderBottomWidth: 2,
        borderStyle: "dashed",
        borderColor: "#6B7280",
      }}
    />
    <Text
      style={{
        position: "absolute",
        bottom: 5,
        left: 110,
        fontSize: 10,
        color: "#6B7280",
        fontWeight: "bold",
      }}
    >
      Distance (m)
    </Text>
    {/* Dropping Object & Sound Waves */}
    <View
      style={{ position: "absolute", top: 60, right: 60, alignItems: "center" }}
    >
      <Ionicons name="volume-high" size={40} color="#8B5CF6" />
      <Ionicons
        name="book"
        size={50}
        color="#0284C7"
        style={{ marginTop: 5 }}
      />
      <Text
        style={{
          fontSize: 10,
          color: "#6B7280",
          marginTop: 4,
          fontWeight: "bold",
        }}
      >
        Noisy Action
      </Text>
    </View>
  </View>
);

export default function SoundChallenge() {
  return (
    <ActivityPrepScreen
      title="Sound Pollution Hunter"
      subtitle="Engineering + Physics / Env"
      overview="Students investigate noise pollution by measuring the sound intensity of various actions at different distances. They will analyze how distance affects sound and understand the health impacts of high decibel levels."
      diagram={<CodedSoundDiagram />}
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "Assorted noisy objects (keys, books, pens)",
        "Measuring tape or ruler",
        "Quiet room to establish a baseline",
      ]}
      instructions={[
        "Ensure the room is quiet to establish a baseline.",
        "Drop an object from a fixed height and measure the sound (dB).",
        "Move the phone exactly 1 meter away and repeat.",
        "Test different actions (e.g., dropping keys, clapping).",
        "Save the results and analyze the data.",
      ]}
      knowledgeBlocks={[
        {
          title: "What is Sound?",
          details: [
            "Sound is a vibration that travels as an acoustic wave through a medium like air.",
            "The intensity (loudness) is measured in decibels (dB).",
          ],
        },
        {
          title: "Inverse Square Law",
          details: [
            "As sound travels away from the source, it spreads out.",
            "If you double the distance from the sound, the intensity drops significantly (by about 6 dB).",
          ],
        },
        {
          title: "Hearing Safety",
          details: [
            "• 30 dB: Whisper or quiet library",
            "• 60 dB: Normal conversation",
            "• 85+ dB: Prolonged exposure can cause hearing loss",
            "• 120+ dB: Threshold of pain (e.g., sirens)",
          ],
        },
        {
          title: "Curriculum Links",
          details: [
            "• Science: ACSSU080 (Light and sound are produced by a range of sources)",
            "• Math: ACMSP147 (Data comparison)",
          ],
        },
      ]}
      nextRoute="/SoundPollutionHunter/activity1"
    />
  );
}
