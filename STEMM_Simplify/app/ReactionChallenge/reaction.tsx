import React from "react";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

export default function ReactionChallenge() {
  return (
    <ActivityPrepScreen
      title="Reaction Board Challenge"
      subtitle="Neuroscience + Biology"
      overview="Students measure their visual and auditory reaction times. This activity explores how the brain processes stimuli and sends signals to muscles."
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "A quiet space to focus",
      ]}
      instructions={[
        "Start the reaction timer on the app",
        "Wait for the screen to turn green, then tap as fast as possible",
        "Record your visual reaction time",
        "Wait for the beep sound, then tap as fast as possible",
        "Record your auditory reaction time",
        "Compare the results and discuss neural pathways",
      ]}
      nextRoute="/ReactionChallenge/reactionActivity"
    />
  );
}
