import React from "react";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

export default function EarthquakeChallenge() {
  return (
    <ActivityPrepScreen
      title="Earthquake Structure"
      subtitle="Engineering"
      overview="Students design structures that withstand vibration, simulating earthquakes and learning about structural engineering principles."
      equipmentList={[
        "Cardboard, paper, scissors, sticky tape",
        "Plastic/paper cups",
        "Mobile phone with vibration sensor",
      ]}
      instructions={[
        "Build an anti-vibration layer by folding paper/cardboard",
        "Place a flat cardboard platform on top",
        "Place the phone in the centre and activate vibration mode",
        "Modify the structure to reduce movement",
        "Test different pillar and fold configurations",
      ]}
      nextRoute="/EarthquakeChallenge/activityPage"
    />
  );
}
