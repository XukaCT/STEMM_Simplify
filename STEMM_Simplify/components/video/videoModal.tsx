import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import ModalHero from "./ModalHero";
import ModalResults from "./ModalResult";

export interface VideoPost {
  id?: string;
  rank?: number;
  activityName: string;
  title: string;
  teamName: string;
  location: string;
  rating: number;
  points: number;
  comments?: string;
  collectionName?: string;
  noVideoUrl?: string;
  withVideoUrl?: string;
  videoUrl?: string;
  videoUri?: string;
  audioUri?: string;
  audioUrl?: string;
  results?: any[];
  designsTested?: any[];
  teamRecords?: any[];
  afterExerciseBPMs?: number[];
  recordedMovements?: any[];
  [key: string]: any;
}

interface VideoModalProps {
  selectedPost: VideoPost | null;
  onClose: () => void;
}

export default function VideoModal({ selectedPost, onClose }: VideoModalProps) {
  if (!selectedPost) return null;

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={selectedPost !== null}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Extracted Hero & Media Player Component */}
        <ModalHero post={selectedPost} />

        {/* Scrollable Modal Content */}
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleSection}>
            <Text style={styles.modalActivityLabel}>
              {selectedPost.activityName.toUpperCase()}
            </Text>
            <Text style={styles.modalTitle}>{selectedPost.title}</Text>

            <View style={styles.modalMetaRow}>
              <View style={styles.metaItem}>
                <FontAwesome5 name="users" size={14} color="#6B7280" />
                <Text style={styles.modalMetaText}>
                  {selectedPost.teamName}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#6B7280" />
                <Text style={styles.modalMetaText}>
                  {selectedPost.location}
                </Text>
              </View>
            </View>
          </View>

          {/* Sleek Stats Row */}
          <View style={styles.sleekStatsRow}>
            <View style={[styles.sleekStatBox, { backgroundColor: "#000" }]}>
              <FontAwesome5 name="trophy" size={16} color="#FF5A00" />
              <Text style={[styles.sleekStatValue, { color: "#fff" }]}>
                {selectedPost.points}
              </Text>
              <Text style={[styles.sleekStatLabel, { color: "#9CA3AF" }]}>
                POINTS
              </Text>
            </View>

            <View style={[styles.sleekStatBox, { backgroundColor: "#FF5A00" }]}>
              <FontAwesome5 name="medal" size={16} color="#fff" />
              <Text style={[styles.sleekStatValue, { color: "#fff" }]}>
                #{selectedPost.rank || "--"}
              </Text>
              <Text style={[styles.sleekStatLabel, { color: "#FFE6D5" }]}>
                RANK
              </Text>
            </View>

            <View
              style={[
                styles.sleekStatBox,
                {
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                },
              ]}
            >
              <FontAwesome5 name="star" solid size={16} color="#FF5A00" />
              <Text style={[styles.sleekStatValue, { color: "#111" }]}>
                {selectedPost.rating
                  ? Number(selectedPost.rating).toFixed(1)
                  : "0.0"}
              </Text>
              <Text style={[styles.sleekStatLabel, { color: "#6B7280" }]}>
                RATING
              </Text>
            </View>
          </View>

          {/* Extracted Dynamic Results Tables */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>RESULTS</Text>
            <ModalResults post={selectedPost} />
          </View>

          {selectedPost.comments ? (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>TEAM NOTES</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesText}>{selectedPost.comments}</Text>
              </View>
            </View>
          ) : null}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "#f9fafb" },
  modalContent: { flex: 1, paddingHorizontal: 20 },
  titleSection: { paddingVertical: 20, paddingBottom: 10 },
  modalActivityLabel: {
    color: "#FF5A00",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    lineHeight: 30,
    marginBottom: 12,
  },
  modalMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 12,
  },
  modalMetaText: { fontSize: 14, color: "#6B7280" },
  sleekStatsRow: { flexDirection: "row", gap: 12, marginBottom: 30 },
  sleekStatBox: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sleekStatValue: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 2,
  },
  sleekStatLabel: { fontSize: 10, fontWeight: "bold", letterSpacing: 0.5 },
  sectionContainer: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  notesCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  notesText: { fontSize: 15, color: "#374151", lineHeight: 24 },
});
