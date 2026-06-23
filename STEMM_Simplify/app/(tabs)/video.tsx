import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabHeader from "../../components/shared/TabHeader";
import FeedCard from "../../components/video/FeedCard";
import VideoModal from "../../components/video/videoModal";
import { FeedItem, useMegaFeed } from "../../hooks/useMegaFeed";

const FILTERS = [
  "All Teams",
  "Parachute Drop",
  "Reaction Board",
  "Human Performance",
  "Hand Fan",
  "Sound",
];

export default function VideoHubScreen() {
  const [activeFilter, setActiveFilter] = useState("All Teams");
  const [selectedPost, setSelectedPost] = useState<FeedItem | null>(null);
  const { feedItems, loading, deleteActivity } = useMegaFeed();

  const filteredItems =
    activeFilter === "All Teams"
      ? feedItems
      : feedItems.filter((item) => {
          const filterMap: { [key: string]: string } = {
            "Parachute Drop": "parachute",
            "Reaction Board": "reaction",
            "Human Performance": "human_performance",
            "Hand Fan": "handfan",
            Sound: "sound",
          };
          const searchKeyword = filterMap[activeFilter] || activeFilter;
          return item.collectionName
            .toLowerCase()
            .includes(searchKeyword.toLowerCase());
        });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Unified Tab Header */}
      <TabHeader title="STEMM Hub" subtitle="Universal Activity Feed" />

      <View style={styles.container}>
        <View style={{ height: 60 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  activeFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF5A00" />
            <Text style={styles.loadingText}>Fetching database...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.feedContainer}>
              {filteredItems.length === 0 ? (
                <Text style={styles.emptyText}>
                  No activities found for this category.
                </Text>
              ) : (
                filteredItems.map((item) => (
                  <FeedCard
                    key={item.id}
                    item={item}
                    onPress={() => setSelectedPost(item)}
                  />
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>

      {/* THE FIX: We don't need to rebuild the object with `rawData` anymore! 
          The new useMegaFeed hook puts everything directly on the selectedPost. */}
      <VideoModal
        selectedPost={selectedPost}
        onClose={() => setSelectedPost(null)}
        onDelete={async (id) => {
          await deleteActivity(id);
          setSelectedPost(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000000" },
  container: { flex: 1, backgroundColor: "#f9fafb" },
  filterContainer: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  filterChip: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    height: 36,
    justifyContent: "center",
  },
  filterChipActive: { backgroundColor: "#FF5A00" },
  filterText: { color: "#4b5563", fontSize: 14, fontWeight: "600" },
  filterTextActive: { color: "#ffffff" },
  feedContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 24,
    paddingTop: 10,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#6b7280", fontWeight: "500" },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
    fontSize: 16,
  },
});
