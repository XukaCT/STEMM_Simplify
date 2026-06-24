import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

const CodedFanDiagram = () => (
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
    {/* Hand and Fan */}
    <View
      style={{
        position: "absolute",
        bottom: 80,
        left: 20,
        alignItems: "center",
        transform: [{ rotate: "-20deg" }],
      }}
    >
      <Ionicons name="hand-right" size={50} color="#D97757" />
      <View
        style={{
          width: 60,
          height: 40,
          backgroundColor: "#059669",
          borderRadius: 4,
          marginTop: -20,
          borderWidth: 2,
          borderColor: "#fff",
        }}
      />
      <Text
        style={{
          fontSize: 10,
          color: "#6B7280",
          marginTop: 4,
          fontWeight: "bold",
        }}
      >
        Paper Fan
      </Text>
    </View>
    {/* Wind lines */}
    <Ionicons
      name="arrow-forward"
      size={30}
      color="#9CA3AF"
      style={{ position: "absolute", bottom: 120, left: 110 }}
    />
    <Ionicons
      name="arrow-forward"
      size={30}
      color="#9CA3AF"
      style={{ position: "absolute", bottom: 90, left: 110 }}
    />
    {/* Paper Target */}
    <View
      style={{ position: "absolute", top: 40, right: 60, alignItems: "center" }}
    >
      <View
        style={{
          width: 80,
          height: 10,
          backgroundColor: "#111",
          borderRadius: 4,
        }}
      />
      <Text
        style={{
          fontSize: 10,
          color: "#6B7280",
          marginBottom: 5,
          fontWeight: "bold",
        }}
      >
        Support
      </Text>
      {/* Resting line */}
      <View
        style={{
          width: 2,
          height: 120,
          backgroundColor: "#E5E7EB",
          position: "absolute",
          top: 10,
        }}
      />
      {/* Bending line */}
      <View
        style={{
          width: 4,
          height: 120,
          backgroundColor: "#FF5A00",
          position: "absolute",
          top: 10,
          transform: [{ rotate: "-20deg" }],
          transformOrigin: "top",
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: "#111",
          fontWeight: "bold",
          position: "absolute",
          right: -30,
          top: 80,
        }}
      >
        Angle°
      </Text>
    </View>
  </View>
);

export default function HandFanChallenge() {
  return (
    <ActivityPrepScreen
      title="Hand Fan Challenge"
      subtitle="Physics - Air Movement"
      overview="Students design and test various paper hand fans to see which structure moves the most air. By measuring the bend angle of a paper target, they learn about air pressure, structural integrity, and aerodynamics."
      diagram={<CodedFanDiagram />}
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "Paper, cardboard, or plastic sheets",
        "Sticky tape and scissors",
        "A light strip of paper (the target)",
        "A ruler or measuring tape",
      ]}
      instructions={[
        "Hang a strip of paper 30cm away from the fan testing area.",
        "Design and build your first paper fan (e.g., accordion fold).",
        "Fan the target continuously for 5 seconds.",
        "Record the maximum bend angle of the paper target.",
        "Redesign using stiffer materials and test again.",
      ]}
      knowledgeBlocks={[
        {
          title: "Air Pressure & Movement",
          details: [
            "Fans work by pushing air particles forward, creating a high-pressure zone.",
            "The difference in pressure creates wind which pushes against the paper target.",
          ],
        },
        {
          title: "Aerodynamics & Surface Area",
          details: [
            "A larger fan surface area pushes more air mass.",
            "Folds (like an accordion) make the paper stiffer, transferring energy efficiently instead of bending the fan itself.",
          ],
        },
        {
          title: "Newton's Laws",
          details: [
            "Third Law: The fan pushes air forward, and the air pushes back (resistance).",
            "Second Law: Force = Mass x Acceleration. Pushing more air requires more physical force from your hand.",
          ],
        },
      ]}
      nextRoute="/HandFanChallenge/activityPage"
    />
  );
}
