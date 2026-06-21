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
    const fetchLocalActivities = () => {
      try {
        // Return an empty feed for now as it's a standalone offline app
        // You can import a static JSON array here if you want dummy feed posts
        setFeedItems([]);
      } catch (error) {
        console.error("Error fetching local feed: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate network delay
    setTimeout(() => {
      fetchLocalActivities();
    }, 500);
  }, []);

  return { feedItems, loading };
}
