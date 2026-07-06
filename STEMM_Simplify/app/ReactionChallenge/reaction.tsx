import React from "react";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

export default function ReactionChallenge() {
  return (
    <ActivityPrepScreen
      title="Human Reaction Challenge"
      subtitle="Health + Medical Science"
      overview="Students test their nervous system's response times to visual and auditory cues. They will compare their dominant versus non-dominant hands to see how brain processing speeds vary."
      videoSource={require("../../assets/videos/reaction.mp4")}
      equipmentList={[
        "Mobile phone with STEMM Lab app",
        "A quiet environment for auditory testing",
        "A flat surface to rest the phone safely",
      ]}
      instructions={[
        "Place the phone flat on a table.",
        "Select the visual (light) or audio (sound) cue test.",
        "Wait for the signal, then tap the screen as fast as possible.",
        "Complete 3 trials with your dominant hand.",
        "Complete 3 trials with your non-dominant hand and compare.",
      ]}
      knowledgeBlocks={[
        {
          title: "The Nervous System",
          details: [
            "When you see a light or hear a sound, sensory nerves send a signal to your brain.",
            "Your brain processes the info and sends a motor signal down your spinal cord to your hand to tap the screen.",
          ],
        },
        {
          title: "Reaction Times",
          details: [
            "Visual reaction time is typically around 250 milliseconds.",
            "Auditory reaction time is often slightly faster (around 170ms) because the auditory stimulus reaches the brain faster.",
          ],
        },
        {
          title: "Dominant vs Non-Dominant",
          details: [
            "Pathways to your dominant hand are used more often, making them more efficient (myelinated) and resulting in faster reaction times.",
          ],
        },
        {
          title: "Curriculum Links",
          details: [
            "• Science: ACSIS130 (Collecting and analysing data)",
            "• Health: ACPPS057 (Understanding physical performance)",
          ],
        },
        {
          title: "Medical Use",
          details: [
            "This assessment is being used to measure reaction time and response speed during a simple board-based task. It may help evaluate visual-motor coordination, psychomotor function, and any delays in responding to stimuli. The results can support clinical or rehabilitation assessment and help track changes over time.",
          ],
        },
      ]}
      nextRoute="/ReactionChallenge/reactionActivity"
    />
  );
}
