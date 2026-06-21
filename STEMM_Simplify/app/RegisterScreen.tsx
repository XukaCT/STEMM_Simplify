import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [teamName, setTeamName] = useState("");
  const [grade, setGrade] = useState("");
  const [members, setMembers] = useState([{ id: Date.now(), name: "" }]);

  const [isGradeModalVisible, setGradeModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    teamName.trim() !== "" &&
    grade !== "" &&
    members.some((m) => m.name.trim() !== "");

  const addMember = () =>
    setMembers([...members, { id: Date.now(), name: "" }]);
  const updateMember = (id: number, text: string) =>
    setMembers(members.map((m) => (m.id === id ? { ...m, name: text } : m)));
  const removeMember = (id: number) =>
    setMembers(members.filter((m) => m.id !== id));

  const handleLetsGo = async () => {
    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const validMembers = members
        .filter((m) => m.name.trim() !== "")
        .map((m) => m.name.trim());

      // Create a local mock payload (You can replace this with AsyncStorage later to save locally)
      const newTeamPayload = {
        teamName: teamName.trim(),
        grade: grade,
        members: validMembers,
        totalPoints: 0,
        activity1_points: 0,
        activity2_points: 0,
        activity3_points: 0,
        activity4_points: 0,
        activity5_points: 0,
        activity6_points: 0,
        activity7_points: 0,
        completeActivities: [],
        createdAt: new Date().toISOString(),
      };

      // Simulate network delay
      setTimeout(() => {
        setIsSubmitting(false);
        router.replace("/(tabs)/dashboard");
      }, 500);
    } catch (error: any) {
      console.error("Failed to save team:", error);
      Alert.alert("Submission Error", error.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F4F4F4" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerEyebrow}>STEMM CHALLENGE</Text>
        <Text style={styles.headerTitle}>Set Up{"\n"}Your Team</Text>
        <Text style={styles.headerSubtitle}>
          Fill in your details before starting.
        </Text>
      </View>

      {/* FORM */}
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.label}>TEAM NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. The Rocket Scientists"
            placeholderTextColor="#C4C4C4"
            value={teamName}
            onChangeText={setTeamName}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>GRADE</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            activeOpacity={0.7}
            onPress={() => setGradeModalVisible(true)}
          >
            <Text style={[styles.input, !grade && { color: "#C4C4C4" }]}>
              {grade || "Select your grade"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.membersHeader}>
            <Text style={styles.label}>MEMBERS</Text>
            {members.length > 0 && (
              <View style={styles.memberCountBadge}>
                <Text style={styles.memberCountText}>{members.length}</Text>
              </View>
            )}
          </View>

          {members.map((member, index) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberAvatarText}>{index + 1}</Text>
              </View>
              <TextInput
                style={styles.memberInput}
                placeholder={`Member ${index + 1}`}
                placeholderTextColor="#C4C4C4"
                value={member.name}
                onChangeText={(text) => updateMember(member.id, text)}
              />
              {members.length > 1 && (
                <TouchableOpacity onPress={() => removeMember(member.id)}>
                  <Ionicons name="close-outline" size={20} color="#C4C4C4" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addMemberBtn} onPress={addMember}>
            <Ionicons name="add" size={18} color="#FF5A00" />
            <Text style={styles.addMemberText}>Add member</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleLetsGo}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Let's Go</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={isGradeModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Grade</Text>
            {["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"].map(
              (g) => (
                <TouchableOpacity
                  key={g}
                  style={styles.modalOption}
                  onPress={() => {
                    setGrade(g);
                    setGradeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{g}</Text>
                </TouchableOpacity>
              ),
            )}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setGradeModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // KEEP YOUR EXISTING STYLES HERE
  headerContainer: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerEyebrow: {
    color: "#FF5A00",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 40,
    marginBottom: 12,
  },
  headerSubtitle: { color: "#888", fontSize: 14 },
  formContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    color: "#A0A0A0",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 12,
  },
  input: { fontSize: 16, color: "#000", fontWeight: "500", paddingVertical: 5 },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  membersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  memberCountBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  memberCountText: { color: "#FF5A00", fontSize: 12, fontWeight: "bold" },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingVertical: 12,
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF5A00",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberAvatarText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  memberInput: { flex: 1, fontSize: 14, color: "#000" },
  addMemberBtn: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  addMemberText: {
    color: "#FF5A00",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: "#FF5A00",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    borderRadius: 16,
    marginTop: 10,
  },
  submitButtonDisabled: { backgroundColor: "#FFCCB3" },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    width: "80%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalOptionText: { fontSize: 16, textAlign: "center" },
  modalCancel: { marginTop: 15, paddingVertical: 15 },
  modalCancelText: {
    color: "#FF5A00",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
