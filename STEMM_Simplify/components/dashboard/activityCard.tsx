import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActivityCardProps {
  item: {
    id: string;
    title: string;
    category: string;
    desc: string;
    icon: string;
    routeName: string;
  };
  isCompleted: boolean;
}

export default function ActivityCard({ item, isCompleted }: ActivityCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.activityCard, isCompleted && styles.activityCardCompleted]}
      activeOpacity={0.7}
      onPress={() => router.push(item.routeName as any)}
    >
      <View
        style={[
          styles.activityIconBox,
          isCompleted && { backgroundColor: "#10B981" },
        ]}
      >
        <Ionicons
          name={isCompleted ? "checkmark" : (item.icon as any)}
          size={24}
          color="#FFF"
        />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityCategory}>{item.category}</Text>
        <Text style={styles.activityDesc}>{item.desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  activityCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  activityCardCompleted: { backgroundColor: "#F0FDF4", borderColor: "#2EE6A6" },
  activityIconBox: {
    backgroundColor: "#00A2D9",
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 15, fontWeight: "bold", color: "#333" },
  activityCategory: {
    fontSize: 11,
    color: "#00A2D9",
    marginTop: 2,
    marginBottom: 4,
  },
  activityDesc: { fontSize: 12, color: "#777" },
});
