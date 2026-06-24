import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

const CodedHumanPerfDiagram = () => (
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
      style={{
        position: "absolute",
        bottom: 20,
        left: "40%",
        alignItems: "center",
      }}
    >
      {/* Person performing movement */}
      <Ionicons name="body" size={160} color="#111" />

      {/* Phone placed flat on chest */}
      <View
        style={{
          position: "absolute",
          top: 40,
          width: 20,
          height: 35,
          backgroundColor: "#10B981",
          borderRadius: 4,
          borderWidth: 2,
          borderColor: "#fff",
        }}
      />
      <Text
        style={{
          position: "absolute",
          top: 45,
          left: 45,
          fontSize: 10,
          fontWeight: "bold",
          color: "#10B981",
        }}
      >
        Phone
      </Text>

      {/* Axis Arrows */}
      <Ionicons
        name="arrow-up"
        size={30}
        color="#EF4444"
        style={{ position: "absolute", top: -10, left: -20 }}
      />
      <Text
        style={{
          position: "absolute",
          top: -10,
          left: -40,
          fontSize: 12,
          color: "#EF4444",
          fontWeight: "bold",
        }}
      >
        Y
      </Text>

      <Ionicons
        name="arrow-forward"
        size={30}
        color="#3B82F6"
        style={{ position: "absolute", top: 40, right: -10 }}
      />
      <Text
        style={{
          position: "absolute",
          top: 25,
          right: -15,
          fontSize: 12,
          color: "#3B82F6",
          fontWeight: "bold",
        }}
      >
        X
      </Text>

      <Ionicons
        name="expand"
        size={30}
        color="#8B5CF6"
        style={{
          position: "absolute",
          top: 50,
          left: -20,
          transform: [{ rotate: "45deg" }],
        }}
      />
      <Text
        style={{
          position: "absolute",
          top: 75,
          left: -30,
          fontSize: 12,
          color: "#8B5CF6",
          fontWeight: "bold",
        }}
      >
        Z
      </Text>
    </View>
  </View>
);

export default function HumanPerformanceChallenge() {
  return (
    <ActivityPrepScreen
      title="Human Performance Lab"
      subtitle="Health + Biomechanics"
      overview="Students use the phone's built-in accelerometer to measure the stability and smoothness of physical movements like stretching or squatting. They evaluate biomechanics and center of gravity."
      diagram={<CodedHumanPerfDiagram />}
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "Clear space to move safely",
        "Comfortable clothing",
      ]}
      instructions={[
        "Hold the phone flat against your chest with both hands.",
        "Start the recording and perform a slow, controlled squat or stretch.",
        "Keep your back straight and minimize wobbling.",
        "Stop the recording and review your variance (± cm).",
        "Try again and aim for a 'Smooth' status result.",
      ]}
      knowledgeBlocks={[
        {
          title: "Accelerometers",
          details: [
            "Your phone contains an accelerometer that measures movement in 3 dimensions (X: left/right, Y: up/down, Z: forward/back).",
            "It measures acceleration in units of G-force (1 G = Earth's gravity).",
          ],
        },
        {
          title: "Biomechanics & Stability",
          details: [
            "A smooth movement means your center of gravity stays balanced over your base of support.",
            "Wobbling creates high variance in the accelerometer data, indicating poor stability or weak core control.",
          ],
        },
        {
          title: "Real-World Applications",
          details: [
            "Sports scientists use this exact technology to analyze athletes' gaits, improve performance, and prevent injuries.",
          ],
        },
      ]}
      nextRoute="/HumanPerformanceChallenge/HumanPerformanceActivity"
    />
  );
}
