import React from "react";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

export default function ParachuteChallenge() {
  return (
    <ActivityPrepScreen
      title="Parachute Drop Challenge"
      subtitle="Engineering + Physics"
      overview="Students design, build, and test a parachute to protect an egg from breaking during a drop. Measure fall time, capture slow-motion impact, and analyze the physics of air resistance."
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "Raw egg",
        "Table or elevated surface",
        "Paper or plastic for parachute",
        "String",
        "Scissors",
        "Tape",
      ]}
      instructions={[
        "Drop the egg without a parachute and record the result (baseline test)",
        "Build a parachute using provided materials",
        "Start the timer, drop the egg, and record fall time",
        "Capture slow-motion video of the impact",
        "Check if the egg survived (intact, cracked, or broken)",
        "Test multiple designs and compare results",
        "Learn about drag force, terminal velocity, and impact physics",
      ]}
      nextRoute="/ParachuteChallenge/activitypage1"
    />
  );
}
