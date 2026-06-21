import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, File, Paths } from "expo-file-system/next";

const FEED_KEY = "@mega_feed_activities";

// 1. Move video from cache to permanent local storage using the NEW API
export const saveVideoLocally = async (
  cacheUri: string,
  filename: string,
  folderName: string = "general",
): Promise<string | null> => {
  try {
    if (!cacheUri) return null;

    // 1. Target the specific activity folder in the phone's Documents directory
    const activityFolder = new Directory(Paths.document, folderName);

    // 2. Safely create the folder if it doesn't exist
    if (!activityFolder.exists) {
      console.log(`Pre-making folder: ${folderName}`);
      activityFolder.create();
    }

    // 3. Define the source file (cache) and destination file (permanent)
    const cachedFile = new File(cacheUri);
    const permanentFile = new File(activityFolder, filename);

    // 4. Copy the file over
    cachedFile.copy(permanentFile);

    // Return the new permanent path for your Mega Feed
    return permanentFile.uri;
  } catch (error) {
    console.error(`Failed to save video locally in ${folderName}:`, error);
    return cacheUri; // Fallback to the temporary cache file if the copy fails
  }
};

// 2. Save the activity data to our offline Feed
export const saveActivityToFeed = async (activityPayload: any) => {
  try {
    const existingData = await AsyncStorage.getItem(FEED_KEY);
    const feed = existingData ? JSON.parse(existingData) : [];

    const newActivity = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...activityPayload,
    };

    feed.unshift(newActivity);
    await AsyncStorage.setItem(FEED_KEY, JSON.stringify(feed));
  } catch (error) {
    console.error("Failed to save activity to local feed:", error);
  }
};

// 3. Retrieve the feed for the Video Hub
export const getLocalFeed = async () => {
  try {
    const existingData = await AsyncStorage.getItem(FEED_KEY);
    return existingData ? JSON.parse(existingData) : [];
  } catch (error) {
    console.error("Failed to get local feed:", error);
    return [];
  }
};

// 4. Wipe feed for testing
export const clearLocalFeed = async () => {
  await AsyncStorage.removeItem(FEED_KEY);
};
