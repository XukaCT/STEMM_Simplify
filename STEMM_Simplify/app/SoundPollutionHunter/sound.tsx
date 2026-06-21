import React from "react";
import ActivityPrepScreen from "../../components/shared/ActivityPrepScreen";

export default function SoundChallenge() {
  return (
    <ActivityPrepScreen
      title="Sound Pollution Hunter"
      subtitle="Environmental Science + Physics"
      overview="Students use a decibel meter app to measure sound levels across different areas. This activity explores noise pollution and the physics of sound waves."
      equipmentList={[
        "Mobile phone with decibel meter app",
        "Notepad/tablet for recording data",
        "Access to various environments (quiet, noisy, outdoors)",
      ]}
      instructions={[
        "Open the decibel meter app on your phone",
        "Find a quiet room and record the baseline dB level",
        "Move to a busy area (cafeteria, street) and record the dB level",
        "Identify the source of the loudest noise",
        "Compare the readings and discuss sound wave energy",
      ]}
      nextRoute="/SoundPollutionHunter/activity1"
    />
  );
}
