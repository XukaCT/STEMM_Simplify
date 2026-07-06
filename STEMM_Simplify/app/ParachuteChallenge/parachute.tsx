import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

const CodedParachuteDiagram = () => (
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
    <View
      style={{ position: "absolute", top: 20, left: 40, alignItems: "center" }}
    >
      <Text style={{ fontSize: 10, color: "#6B7280", marginBottom: -5 }}>
        paper or plastic
      </Text>
      <Ionicons name="umbrella" size={40} color="#0284C7" />
      <View
        style={{
          flexDirection: "row",
          width: 40,
          justifyContent: "space-between",
          marginTop: -15,
        }}
      >
        <View
          style={{
            width: 1,
            height: 30,
            borderLeftWidth: 1,
            borderStyle: "dashed",
            borderColor: "#9CA3AF",
            transform: [{ rotate: "20deg" }],
          }}
        />
        <View
          style={{
            width: 1,
            height: 30,
            borderLeftWidth: 1,
            borderStyle: "dashed",
            borderColor: "#9CA3AF",
            transform: [{ rotate: "-20deg" }],
          }}
        />
      </View>
      <Ionicons name="body" size={20} color="#111" style={{ marginTop: -20 }} />
      <Text style={{ fontSize: 10, color: "#6B7280", fontWeight: "bold" }}>
        Toy Figurine
      </Text>
    </View>

    <View
      style={{ position: "absolute", top: 80, right: 20, alignItems: "center" }}
    >
      <View
        style={{
          width: 140,
          height: 12,
          backgroundColor: "#8B4513",
          borderRadius: 4,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 110,
        }}
      >
        <View style={{ width: 12, height: 90, backgroundColor: "#8B4513" }} />
        <View style={{ width: 12, height: 90, backgroundColor: "#8B4513" }} />
      </View>
    </View>

    <View
      style={{
        position: "absolute",
        bottom: 15,
        left: 120,
        alignItems: "center",
      }}
    >
      <Ionicons name="phone-portrait-outline" size={48} color="#FF5A00" />
      <Text style={{ fontSize: 11, color: "#111", fontWeight: "bold" }}>
        Phone
      </Text>
      <Text style={{ fontSize: 10, color: "#6B7280", textAlign: "center" }}>
        Position to capture{"\n"}the full fall
      </Text>
    </View>
  </View>
);

export default function ParachuteChallenge() {
  return (
    <ActivityPrepScreen
      title="Parachute Drop Challenge"
      subtitle="Engineering + Physics"
      overview="Students design, build, and test a parachute to protect an egg from breaking during a drop. Measure fall time, capture slow-motion impact, and analyze the physics of air resistance."
      diagram={<CodedParachuteDiagram />}
      videoSource={require("../../assets/videos/parachute.mp4")}
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "Small toy (e.g., army toy soldier)",
        "Table or elevated surface",
        "Paper or plastic for parachute",
        "String, Scissors, Tape",
      ]}
      instructions={[
        "Drop the toy without a parachute and record the result (baseline test)",
        "Build a parachute using provided materials",
        "Drop the toy from the same height and record the fall",
        "Review speed and landing accuracy results in the app",
        "Redesign and test up to three prototypes within 20 minutes",
        "Upload videos, results, and team reflections",
      ]}
      knowledgeBlocks={[
        {
          title: "Discussion: Parachutes and Forces",
          details: [
            "Gravity pulls objects downward, causing them to speed up as they fall.",
            "A parachute increases air resistance (also called drag). Drag acts upward, opposing the motion and slowing the fall.",
            "A slower fall reduces the force when the toy hits the ground, making the landing safer.",
            "Engineers improve parachute designs through repeated testing and redesign.",
          ],
        },
        {
          title: "Forces Acting on the Toy",
          details: [
            "• Downward Force (Weight) = mass × 9.8",
            "• Upward Force = Drag force from the parachute",
            "• Net Force = Weight - Drag Force",
            "• Newton's Second Law: Net Force = mass × acceleration",
          ],
        },
        {
          title: "G-Force & Injury Risks",
          details: [
            "• 1-5 g: Amusement rides (No injury)",
            "• 5-10 g: Hard falls while running (Possible bruising)",
            "• 10-30 g: Sports collisions (Serious injuries possible)",
            "• 30-50 g: Severe crashes (High risk of severe injury)",
            "• 50+ g: Very sudden stops (Life-threatening)",
          ],
        },
        {
          title: "How to Calculate G-Force",
          details: [
            "1. Calculate Speed (v) = Height ÷ Fall Time",
            "2. Calculate Impact Acceleration (a) = Speed ÷ Impact Time (Assume 0.1s for a hard toy hitting the floor).",
            "3. Calculate Impact Force (F) = Toy Mass (kg) × Acceleration",
            "4. Calculate G-Force = Acceleration ÷ 9.81 (Gravity)",
            "Example: Toy hits at 5m/s and stops in 0.1s. Acceleration = 50 m/s². G-Force = 50 / 9.81 = 5.1 Gs!",
          ],
        },
        {
          title: "Curriculum Links",
          details: [
            "• Science: ACSSU076 / ACSSU117 (Forces affect motion), ACSIS124, ACSIS126",
            "• Design & Technologies: ACTDEP036 (Generate, test, and improve solutions)",
            "• Mathematics: ACMMG108 (Measuring speed), ACMSP147 (Comparing data)",
          ],
        },
      ]}
      nextRoute="/ParachuteChallenge/activitypage1"
    />
  );
}
