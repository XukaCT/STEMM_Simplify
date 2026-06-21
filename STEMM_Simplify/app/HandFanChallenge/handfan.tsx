import React from "react";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

export default function HandFanChallenge() {
  return (
    <ActivityPrepScreen
      title="Hand Fan Challenge"
      subtitle="Physics + Engineering"
      overview="Students test different hand fan designs to understand how shape and material affect air flow and fluid dynamics."
      equipmentList={[
        "Paper, cardboard, plastic sheets",
        "Scissors, tape, glue",
        "Small lightweight objects (e.g., feathers, cotton balls)",
      ]}
      instructions={[
        "Design and build your first hand fan",
        "Place a lightweight object on a table",
        "Stand exactly 1 meter away and fan the object",
        "Measure how far the object moved",
        "Modify your design (larger surface, stiffer material) and test again",
        "Compare which design moved the most air",
      ]}
      nextRoute="/HandFanChallenge/activityPage"
    />
  );
}
