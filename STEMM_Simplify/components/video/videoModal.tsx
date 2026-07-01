import { FontAwesome5 } from "@expo/vector-icons";
import { Trash2 } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  onDelete: (id: string) => void;
}

export default function VideoModal({
  selectedPost,
  onClose,
  onDelete,
}: VideoModalProps) {
  if (!selectedPost) return null;

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={selectedPost !== null}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ModalHero post={selectedPost} onClose={onClose} />

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

          {/* THE NEW PLACEMENT FOR THE DELETE BUTTON */}
          <TouchableOpacity
            style={styles.deleteActivityButton}
            onPress={() => {
              Alert.alert(
                "Delete Activity",
                "Are you sure you want to delete this entire activity log? This cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete(selectedPost.id!),
                  },
                ],
              );
            }}
          >
            <Trash2 size={18} color="#EF4444" />
            <Text style={styles.deleteActivityText}>
              Delete Entire Activity
            </Text>
          </TouchableOpacity>

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
  deleteActivityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
  },
  deleteActivityText: { color: "#EF4444", fontWeight: "bold", fontSize: 15 },
});
