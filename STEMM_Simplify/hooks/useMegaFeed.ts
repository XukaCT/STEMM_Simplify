import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface FeedItem {
  id: string;
  collectionName: string;
  activityType: "video" | "reaction" | "breathing" | "generic";
  title: string;
  activityName: string;
  teamName: string;
  location: string;
  rating: number;
  points: number;
  rank: number;
  createdAt: string;
  heroLabel?: string;
  heroStat?: string;
  hasMedia?: boolean;
  rawData: any;
}

export function useMegaFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        const collectionsToFetch = [
          { name: "parachute_challenge", type: "video" },
          { name: "handFan_Challenges", type: "video" },
          { name: "reaction_Challenge", type: "reaction" },
          { name: "breathing_challenge", type: "breathing" },
          { name: "human_performance_challenge", type: "generic" },
          { name: "earthquake_Challenge", type: "generic" },
          { name: "sound_challenge", type: "generic" },
        ];

        let allPosts: FeedItem[] = [];

        await Promise.all(
          collectionsToFetch.map(async (coll) => {
            const querySnapshot = await getDocs(collection(db, coll.name));
            const docsArray = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }));

            // Sort by points to calculate REAL rank
            docsArray.sort(
              (a, b) => (b.data.points || 0) - (a.data.points || 0),
            );

            docsArray.forEach((docObj, index) => {
              const data = docObj.data;
              const calculatedRank = index + 1;

              let heroLabel = "";
              let heroStat = "";

              if (coll.name === "reaction_Challenge") {
                let best = 9999;
                (data.teamRecords || []).forEach((r: any) => {
                  if (typeof r.score === "string" && r.score.includes("ms")) {
                    const s = parseInt(r.score);
                    if (!isNaN(s) && s < best) best = s;
                  }
                });
                heroLabel = "BEST REACTION";
                heroStat = best !== 9999 ? `${best} ms` : "-- ms";
              } else if (coll.name === "breathing_challenge") {
                heroLabel = "RESTING RATE";
                heroStat = data.atRestBPM ? `${data.atRestBPM} bpm` : "-- bpm";
              } else if (coll.name === "human_performance_challenge") {
                heroLabel = "BEST VARIANCE";
                heroStat =
                  data.bestPerformance?.value !== undefined
                    ? `±${Number(data.bestPerformance.value).toFixed(2)}cm`
                    : "--";
              } else if (coll.name === "sound_challenge") {
                const safeResults = data.results || [];
                const dbValues = safeResults
                  .map((r: any) => Number(r.decibels || r.db))
                  .filter((n: number) => !isNaN(n));
                const maxDb =
                  dbValues.length > 0 ? Math.max(...dbValues) : "--";
                heroLabel = "PEAK VOLUME";
                heroStat = maxDb !== "--" ? `${maxDb} dB` : "-- dB";
              } else if (coll.name === "earthquake_Challenge") {
                const safeResults = data.results || data.designsTested || [];
                heroLabel = "EARTHQUAKE SIM";
                heroStat =
                  safeResults.length > 0
                    ? `${safeResults.length} Tests`
                    : "Logged";
              }

              const safeResults = data.results || data.designsTested || [];
              const hasMedia = !!(
                data.withVideoUrl ||
                data.noVideoUrl ||
                data.videoUrl ||
                data.videoUri ||
                data.audioUrl ||
                data.audioUri ||
                safeResults.some(
                  (r: any) =>
                    r.videoUrl || r.videoUri || r.audioUrl || r.audioUri,
                )
              );

              allPosts.push({
                id: docObj.id,
                collectionName: coll.name,
                activityType: coll.type as any,
                title: data.activityName || "Activity",
                activityName: data.activityName || "Unknown Activity",
                teamName: data.teamName || "Unknown Team",
                location: data.locationName || "Lab",
                rating: data.rating || 0,
                points: data.points || 0,
                rank: calculatedRank,
                createdAt: data.createdAt || new Date().toISOString(),
                heroLabel,
                heroStat,
                hasMedia,
                rawData: data,
              });
            });
          }),
        );

        allPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setFeedItems(allPosts);
      } catch (error) {
        console.error("Error fetching mega feed: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllActivities();
  }, []);

  return { feedItems, loading };
}
