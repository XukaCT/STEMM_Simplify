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
        Folded Fan
      </Text>
    </View>

    {/* Wind Lines */}
    <View
      style={{
        position: "absolute",
        top: 130,
        left: 90,
        width: 60,
        borderBottomWidth: 3,
        borderStyle: "dashed",
        borderColor: "#9CA3AF",
        transform: [{ rotate: "-10deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 160,
        left: 90,
        width: 60,
        borderBottomWidth: 3,
        borderStyle: "dashed",
        borderColor: "#9CA3AF",
      }}
    />

    {/* Target Paper and Protractor */}
    <View
      style={{
        position: "absolute",
        top: 60,
        right: 40,
        alignItems: "center",
        transform: [{ rotate: "180deg" }],
      }}
    >
      <View
        style={{
          width: 80,
          height: 40,
          borderBottomWidth: 1,
          borderStyle: "dashed",
          borderColor: "#0284C7",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: "rgba(2, 132, 199, 0.1)",
        }}
      />
      <View
        style={{
          width: 2,
          height: 100,
          backgroundColor: "#EF4444",
          transform: [{ rotate: "30deg" }],
          transformOrigin: "top",
          marginTop: -5,
        }}
      />
      <Text
        style={{
          fontSize: 10,
          color: "#6B7280",
          marginTop: 15,
          fontWeight: "bold",
          marginLeft: -30,
          transform: [{ rotate: "180deg" }],
        }}
      >
        Target Bend
      </Text>
    </View>

    {/* Distance Measure */}
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 50,
        right: 50,
        borderBottomWidth: 2,
        borderColor: "#111",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 10, color: "#111", marginBottom: 2 }}>
        Distance (15cm - 45cm)
      </Text>
    </View>
  </View>
);

export default function HandFanChallenge() {
  return (
    <ActivityPrepScreen
      title="Hand Fan Challenge"
      subtitle="Physics + Engineering"
      overview="Students design and build a paper hand fan. They will test how much air it moves by measuring the bend angle of a hanging paper strip, exploring the principles of air pressure and structural reinforcement."
      diagram={<CodedFanDiagram />}
      imageSource={require("../../assets/images/handfan.jpg")}
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "A4 Paper sheets",
        "Paperclips and rubber bands",
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
        {
          title: "Material Elasticity & Hooke's Law",
          details: [
            "• Hooke's Law Formula: F = -kx (Force equals the spring constant times the displacement).",
            "• This law explains how materials bend and bounce back to their original shape.",
            "• Elastic Limit: If the paper bends too far and does not bounce back, it has fractured its elasticity.",
            "• Once permanently creased or broken, Hooke's Law no longer applies. You must change the target paper for an accurate test!",
          ],
        },
      ]}
      nextRoute="/HandFanChallenge/activityPage"
    />
  );
}
