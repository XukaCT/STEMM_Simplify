import { useEffect, useState } from "react";

export function useTeamData() {
  const [teamData, setTeamData] = useState<any>(null);
  const [teamRank, setTeamRank] = useState<number | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    // Simulate loading data locally
    const loadMockData = () => {
      setTimeout(() => {
        setTeamData({
          teamName: "The Local Explorers",
          grade: "Grade 3",
          members: ["Alex", "Jordan"],
          totalPoints: 120,
          completeActivities: ["parachute_challenge"],
        });
        setTeamRank(1);
        setLoadingTeam(false);
      }, 500);
    };

    loadMockData();
  }, []);

  return { teamData, teamRank, loadingTeam };
}
