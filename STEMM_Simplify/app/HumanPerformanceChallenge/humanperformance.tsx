import React from "react";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

export default function HumanPerformanceChallenge() {
  return (
    <ActivityPrepScreen
      title="Human Performance Lab"
      subtitle="Biology"
      overview="Students measure their physical steadiness and movement coordination to understand the human nervous system and motor control."
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "A quiet space to perform movements",
      ]}
      instructions={[
        "Hold the phone completely still in your outstretched hand for 10 seconds",
        "Move the phone in a smooth figure-8 motion",
        "Raise the phone from your waist to above your head as smoothly as possible",
        "Review the data to see the tiny, involuntary tremors in your muscles",
        "Discuss how the nervous system controls muscle stability",
      ]}
      nextRoute="/HumanPerformanceChallenge/HumanPerformanceActivity"
    />
  );
}
