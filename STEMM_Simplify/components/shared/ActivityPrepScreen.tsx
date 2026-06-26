import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface KnowledgeBlock {
  title: string;
  details: string[];
}

interface ActivityPrepScreenProps {
  title: string;
  subtitle: string;
  overview: string;
  equipmentList: string[];
  instructions: string[];
  nextRoute: any;
  diagram?: React.ReactNode;
  knowledgeBlocks?: KnowledgeBlock[];
}

export default function ActivityPrepScreen({
  title,
  subtitle,
  overview,
  equipmentList,
  instructions,
  nextRoute,
  diagram,
  knowledgeBlocks,
}: ActivityPrepScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [checkedItems, setCheckedItems] = useState(
    new Array(equipmentList.length).fill(false),
  );

  const toggleCheckbox = (index: number) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const handleStart = () => {
    const startTime = Date.now();
    router.push({
      pathname: nextRoute,
      params: { startTime: startTime.toString() },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.tabBar}>
        {["Instructions", "Diagram", "Knowledge"].map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(index)}
            style={[
              styles.tabButton,
              activeTab === index && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {activeTab === 0 && (
          <View>
            <View style={styles.overviewCard}>
              <Text style={styles.cardLabel}>Overview</Text>
              <Text style={styles.overviewText}>{overview}</Text>
            </View>

            <View style={styles.whiteCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons
                  name="build"
                  size={20}
                  color="#42ADD9"
                  style={styles.cardIcon}
                />
                <Text style={styles.sectionTitle}>Equipment Needed</Text>
              </View>
              {equipmentList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.equipmentRow}
                  onPress={() => toggleCheckbox(index)}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name={checkedItems[index] ? "checkbox" : "square-outline"}
                    size={22}
                    color={checkedItems[index] ? "#42ADD9" : "#CCC"}
                  />
                  <Text
                    style={[
                      styles.equipmentText,
                      checkedItems[index] && styles.checkedText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.whiteCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons
                  name="list"
                  size={20}
                  color="#42ADD9"
                  style={styles.cardIcon}
                />
                <Text style={styles.sectionTitle}>Instructions</Text>
              </View>
              {instructions.map((step, index) => (
                <View key={index} style={styles.instructionRow}>
                  <View style={styles.numberCircle}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 1 && (
          <View style={styles.whiteCard}>
            <Text style={styles.sectionTitle}>Activity Setup Diagram</Text>
            {diagram ? (
              <View style={{ marginTop: 20 }}>{diagram}</View>
            ) : (
              <View style={styles.placeholderDiagram}>
                <Ionicons name="construct-outline" size={48} color="#CCC" />
                <Text style={styles.placeholderText}>Diagram coming soon.</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 2 && (
          <View style={styles.whiteCard}>
            <View style={styles.cardHeaderRow}>
              <Ionicons
                name="school"
                size={20}
                color="#42ADD9"
                style={styles.cardIcon}
              />
              <Text style={styles.sectionTitle}>Science & Theory</Text>
            </View>

            {knowledgeBlocks && knowledgeBlocks.length > 0 ? (
              knowledgeBlocks.map((block, idx) => (
                <View key={idx} style={styles.knowledgeBlock}>
                  <Text style={styles.knowledgeTitle}>{block.title}</Text>
                  {block.details.map((text, i) => (
                    <Text key={i} style={styles.knowledgeDetail}>
                      {text}
                    </Text>
                  ))}
                </View>
              ))
            ) : (
              <Text style={styles.placeholderText}>
                Detailed knowledge and curriculum links coming soon.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>Start Activity</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: { marginBottom: 10 },
  headerTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  headerSubtitle: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },

  tabBar: {
    flexDirection: "row",
    backgroundColor: "#000",
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabButtonActive: { borderBottomColor: "#00A2D9" },
  tabText: { color: "#9CA3AF", fontSize: 14, fontWeight: "bold" },
  tabTextActive: { color: "#00A2D9" },

  scrollContent: {
    padding: 20,
    paddingBottom: 120,
    backgroundColor: "#F7F8FA",
    minHeight: "100%",
  },
  overviewCard: {
    backgroundColor: "#00A2D9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardLabel: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  overviewText: { color: "#FFF", fontSize: 14, lineHeight: 22, opacity: 0.9 },
  whiteCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 10,
  },
  cardIcon: { marginRight: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  equipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  equipmentText: { fontSize: 14, color: "#666", marginLeft: 12, flex: 1 },
  checkedText: { textDecorationLine: "line-through", color: "#AAA" },
  instructionRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  numberCircle: {
    backgroundColor: "#42ADD9",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  numberText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  stepText: { flex: 1, fontSize: 14, color: "#555", lineHeight: 20 },

  placeholderDiagram: {
    height: 200,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 20,
  },
  placeholderText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  knowledgeBlock: { marginBottom: 20 },
  knowledgeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  knowledgeDetail: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 4,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(247, 248, 250, 0.9)",
  },
  startButton: {
    backgroundColor: "#42ADD9",
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00A2D9 ",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  startButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
