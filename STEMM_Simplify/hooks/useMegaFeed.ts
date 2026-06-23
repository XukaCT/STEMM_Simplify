import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

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
  [key: string]: any; // Allows custom properties (teamRecords, results, etc.) to flow through
}

export function useMegaFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const deleteActivity = async (id: string) => {
    try {
      const storedData = await AsyncStorage.getItem("@mega_feed_activities");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const updatedData = parsedData.filter((item: any) => item.id !== id);
        await AsyncStorage.setItem(
          "@mega_feed_activities",
          JSON.stringify(updatedData),
        );
        // Refresh the feed instantly
        await fetchOfflineActivities();
      }
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };

  const fetchOfflineActivities = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem("@mega_feed_activities");

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        const formattedItems: FeedItem[] = parsedData.map(
          (item: any, index: number) => {
            // Deep check to see if any videos or audio files were attached in the arrays
            const hasMedia = !!(
              item.videoUrl ||
              item.withVideoUrl ||
              item.noVideoUrl ||
              item.audioUri ||
              item.audioUrl ||
              (item.results &&
                item.results.some(
                  (r: any) =>
                    r.videoUrl || r.videoUri || r.audioUri || r.audioUrl,
                )) ||
              (item.designsTested &&
                item.designsTested.some(
                  (r: any) => r.videoUrl || r.videoUri,
                )) ||
              (item.recordedMovements &&
                item.recordedMovements.some(
                  (r: any) => r.videoUrl || r.videoUri,
                ))
            );

            return {
              ...item, // Spread raw data so the Modal gets teamRecords, recordedMovements, etc.
              id: item.id || index.toString(),
              collectionName: item.collectionName || "generic_challenge",
              activityType: item.activityType || "generic",
              title: item.title || "Activity Complete!",
              activityName: item.activityName || "Unknown Activity",
              teamName: item.teamName || "My Team",
              location: item.locationName || "Local Device",
              rating: item.rating || 5,
              points: item.points || 0,
              createdAt: item.createdAt || new Date().toISOString(),
              heroLabel: item.heroLabel || "SCORE",
              heroStat:
                item.heroStat || (item.points ? item.points.toString() : "0"),
              hasMedia: hasMedia,
            };
          },
        );

        // 1. Sort chronologically (Newest first for the feed)
        const sortedData = formattedItems.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        // 2. Calculate global rank based on points
        const rankedData = [...sortedData].sort((a, b) => b.points - a.points);
        const finalData = sortedData.map((item) => ({
          ...item,
          rank: rankedData.findIndex((r) => r.id === item.id) + 1,
        }));

        setFeedItems(finalData);
      } else {
        setFeedItems([]);
      }
    } catch (error) {
      console.error("Error fetching offline feed: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Instantly refreshes whenever the user taps the Video Tab
  useFocusEffect(
    useCallback(() => {
      fetchOfflineActivities();
    }, []),
  );
  return {
    feedItems,
    loading,
    refreshFeed: fetchOfflineActivities,
    deleteActivity,
  };
}
