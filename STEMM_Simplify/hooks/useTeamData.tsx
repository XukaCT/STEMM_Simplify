import { auth, db } from "@/firebaseConfig";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export function useTeamData() {
  const [teamData, setTeamData] = useState<any>(null);
  const [teamRank, setTeamRank] = useState<number | null>(null);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoadingTeam(false);
      return;
    }

    let teamUnsub: () => void;

    // 1. Listen to the User's profile to get their teamId
    const userUnsub = onSnapshot(doc(db, "users", user.uid), (userDocSnap) => {
      if (userDocSnap.exists()) {
        const myTeamId = userDocSnap.data().teamId;

        if (myTeamId) {
          // Fetch the whole leaderboard sorted by points
          const teamsQuery = query(
            collection(db, "teams"),
            orderBy("totalPoints", "desc"),
          );

          // Find our team in the list to calculate the exact rank
          teamUnsub = onSnapshot(teamsQuery, (snapshot) => {
            let currentRank = 0;
            let foundTeamData = null;

            snapshot.docs.forEach((doc, index) => {
              if (doc.id === myTeamId) {
                currentRank = index + 1;
                foundTeamData = doc.data();
              }
            });

            setTeamData(foundTeamData);
            setTeamRank(currentRank);
            setLoadingTeam(false);
          });
        } else {
          setLoadingTeam(false);
        }
      } else {
        setLoadingTeam(false);
      }
    });

    return () => {
      userUnsub();
      if (teamUnsub) teamUnsub();
    };
  }, []);

  return { teamData, teamRank, loadingTeam };
}
