import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

const CodedReactionDiagram = () => (
  <View
    style={{
      height: 280,
      width: "100%",
      backgroundColor: "#F9FAFB",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      position: "relative",
    }}
  >
    {/* Brain */}
    <View
      style={{ position: "absolute", top: 40, left: 40, alignItems: "center" }}
    >
      <Ionicons name="hardware-chip" size={60} color="#EAB308" />
      <Text style={{ fontSize: 12, fontWeight: "bold", color: "#6B7280" }}>
        Brain Process
      </Text>
    </View>
    {/* Nerve Path */}
    <View
      style={{
        position: "absolute",
        top: 80,
        left: 100,
        width: 80,
        borderBottomWidth: 3,
        borderStyle: "dashed",
        borderColor: "#9CA3AF",
        transform: [{ rotate: "25deg" }],
      }}
    />
    <Ionicons
      name="flash"
      size={20}
      color="#FF5A00"
      style={{ position: "absolute", top: 80, left: 130 }}
    />
    {/* Hand Tapping */}
    <View
      style={{
        position: "absolute",
        top: 120,
        right: 50,
        alignItems: "center",
      }}
    >
      <Ionicons
        name="hand-left"
        size={60}
        color="#D97757"
        style={{ transform: [{ rotate: "180deg" }] }}
      />
      <Text
        style={{
          fontSize: 12,
          fontWeight: "bold",
          color: "#6B7280",
          marginTop: 5,
        }}
      >
        Motor Response
      </Text>
    </View>
    {/* Phone Target */}
    <View
      style={{
        position: "absolute",
        bottom: 20,
        right: 50,
        alignItems: "center",
      }}
    >
      <Ionicons name="phone-portrait" size={80} color="#111" />
      <View
        style={{
          position: "absolute",
          top: 20,
          width: 30,
          height: 30,
          backgroundColor: "#EF4444",
          borderRadius: 15,
          borderWidth: 2,
          borderColor: "#fff",
        }}
      />
    </View>
  </View>
);

export default function ReactionChallenge() {
  return (
    <ActivityPrepScreen
      title="Reaction Board"
      subtitle="Health + Medical Science"
      overview="Students test their nervous system's response times to visual and auditory cues. They will compare their dominant versus non-dominant hands to see how brain processing speeds vary."
      diagram={<CodedReactionDiagram />}
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "A quiet environment for auditory testing",
        "A flat surface to rest the phone safely",
      ]}
      instructions={[
        "Place the phone flat on a table.",
        "Select the visual (light) or audio (sound) cue test.",
        "Wait for the signal, then tap the screen as fast as possible.",
        "Complete 3 trials with your dominant hand.",
        "Complete 3 trials with your non-dominant hand and compare.",
      ]}
      knowledgeBlocks={[
        {
          title: "The Nervous System",
          details: [
            "When you see a light or hear a sound, sensory nerves send a signal to your brain.",
            "Your brain processes the info and sends a motor signal down your spinal cord to your hand to tap the screen.",
          ],
        },
        {
          title: "Reaction Times",
          details: [
            "Visual reaction time is typically around 250 milliseconds.",
            "Auditory reaction time is often slightly faster (around 170ms) because the auditory stimulus reaches the brain faster.",
          ],
        },
        {
          title: "Dominant vs Non-Dominant",
          details: [
            "Pathways to your dominant hand are used more often, making them more efficient (myelinated) and resulting in faster reaction times.",
          ],
        },
        {
          title: "Curriculum Links",
          details: [
            "• Science: ACSIS130 (Collecting and analysing data)",
            "• Health: ACPPS057 (Understanding physical performance)",
          ],
        },
      ]}
      nextRoute="/ReactionChallenge/reactionActivity"
    />
  );
}
