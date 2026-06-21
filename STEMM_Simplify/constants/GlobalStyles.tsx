import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  // --- Layouts ---
  safeArea: { flex: 1, backgroundColor: "#fff" }, // Fixed the name here!
  scrollContent: { padding: 20, paddingBottom: 40 },

  // --- Headers ---
  headerContainer: { alignItems: "center", marginBottom: 24, marginTop: 10 },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF5A00",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#111" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },

  // --- Standard Cards ---
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#111", marginLeft: 8 },

  // --- Forms & Inputs ---
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    height: 100,
    fontSize: 14,
    color: "#111",
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
  },

  // --- Interactive Location Box ---
  interactiveLocationCard: {
    borderColor: "#DBEAFE",
    backgroundColor: "#F0F9FF",
    marginBottom: 32,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  locationTextContainer: { marginLeft: 12, flex: 1 },
  locationTitle: { fontSize: 13, color: "#555", fontWeight: "600" },
  locationSubtitle: {
    fontSize: 13,
    color: "#111",
    marginTop: 2,
    fontWeight: "500",
  },

  // --- Buttons ---
  submitButton: {
    backgroundColor: "#FF5A00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitButtonDisabled: { backgroundColor: "#FFB088" },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footerText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 12,
  },

  // --- Map Modal ---
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    backgroundColor: "#fff",
  },
  modalCancelButton: { padding: 4 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#111" },
  modalConfirmButton: {
    backgroundColor: "#FF5A00",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  commentsLabel: {
    fontSize: 12,
    color: "#111",
    marginBottom: 8,
    fontWeight: "500",
  },
  modalConfirmText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  mapInstructionBanner: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#111",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapInstructionText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
