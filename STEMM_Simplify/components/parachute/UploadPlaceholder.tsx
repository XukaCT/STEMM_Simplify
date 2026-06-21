import { CheckCircle, Video } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface UploadPlaceholderProps {
  label: string;
  color: string;
  iconColor: string;
  hasVideo: boolean;
  onPress: () => void;
}

export default function UploadPlaceholder({
  label,
  color,
  iconColor,
  hasVideo,
  onPress,
}: UploadPlaceholderProps) {
  return (
    <TouchableOpacity
      style={[
        styles.uploadBox,
        { backgroundColor: color, borderColor: iconColor },
      ]}
      onPress={onPress}
    >
      {hasVideo ? (
        <CheckCircle size={24} color={iconColor} />
      ) : (
        <Video size={24} color={iconColor} />
      )}
      <Text style={[styles.uploadText, { color: iconColor }]}>{label}</Text>
      <Text style={[styles.uploadSubtext, { color: iconColor }]}>
        {hasVideo ? "Video Selected!" : "Tap to upload"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  uploadBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
  },
  uploadText: { fontSize: 12, fontWeight: "bold", marginTop: 8 },
  uploadSubtext: { fontSize: 10, marginTop: 4 },
});
