import React from "react";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

export default function BreathingChallenge() {
  return (
    <ActivityPrepScreen
      title="Breathing Pace Trainer"
      subtitle="Medical Science"
      overview="Students measure their resting breathing rate and how it changes after physical exertion to understand cardiovascular and respiratory systems."
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "A stopwatch",
        "Space to do jumping jacks or run in place",
      ]}
      instructions={[
        "Sit quietly and measure your resting breathing rate (breaths per minute)",
        "Perform 1 minute of jumping jacks or vigorous exercise",
        "Immediately measure your breathing rate again",
        "Wait 2 minutes and measure it a third time",
        "Analyze how quickly your respiratory system returns to its baseline",
      ]}
      nextRoute="/BreathChallenge/breathingActivity"
    />
  );
}
