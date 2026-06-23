import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video as ExpoVideo, ResizeMode } from "expo-av"; // Video Player
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  MapPin,
  MessageSquare,
  Play,
  Star,
  Video as VideoIcon,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UniversalMap from "../../components/universalMap";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { saveActivityToFeed } from "../../utils/localStore";

const ACTIVITY_ID = "3";

export default function HandFanResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [results, setResults] = useState<any[]>([]);

  // Rewatch Player State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentPlayUri, setCurrentPlayUri] = useState<string | null>(null);

  const openVideo = (uri: string) => {
    setCurrentPlayUri(uri);
    setIsPlayingVideo(true);
  };

  const closeVideo = () => {
    setIsPlayingVideo(false);
    setCurrentPlayUri(null);
  };

  // Load the data directly from the safe local storage
  useEffect(() => {
    const loadTempData = async () => {
      try {
        const stored = await AsyncStorage.getItem("@temp_handfan_data");
        if (stored) {
          setResults(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load temp results", e);
      }
    };
    loadTempData();
  }, []);

  const startTimeString = params.startTime as string;
  const startTime = startTimeString ? parseInt(startTimeString) : Date.now();
  const endTime = Date.now();
  const sessionSeconds = Math.floor((endTime - startTime) / 1000);
  const finalScore = Math.max(0, 5000 - sessionSeconds) + 1000;

  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [coordinate, setCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [tempCoordinate, setTempCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      let geocodeArray = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      if (geocodeArray && geocodeArray.length > 0) {
        const place = geocodeArray[0];
        const streetInfo = place.name || place.street;
        const cityInfo = place.city || place.subregion || place.region;
        setLocationName(
          [streetInfo, cityInfo].filter(Boolean).join(", ") || "Unknown area",
        );
      } else {
        setLocationName("Address not found");
      }
    } catch (error) {
      setLocationError("Failed to fetch address");
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permission denied");
        return;
      }
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const initialCoords = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setCoordinate(initialCoords);
        await fetchAddressFromCoords(
          initialCoords.latitude,
          initialCoords.longitude,
        );
      } catch (error) {
        setLocationError("Failed to fetch location");
      }
    })();
  }, []);

  const openMap = () => {
    if (coordinate) setTempCoordinate(coordinate);
    setIsMapVisible(true);
  };

  const confirmNewLocation = async () => {
    setIsMapVisible(false);
    if (tempCoordinate) {
      setLocationName("Updating address...");
      setCoordinate(tempCoordinate);
      await fetchAddressFromCoords(
        tempCoordinate.latitude,
        tempCoordinate.longitude,
      );
    }
  };

  const handleSubmit = async () => {
    if (rating === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Find the first valid video to use as the Main Video for the Dashboard Hub
      const mainVideoUrl = results.find((r) => r.videoUri)?.videoUri || null;

      const activityData = {
        collectionName: "handfan_challenge",
        activityName: "Hand Fan Challenge",
        activityType: "video",
        title: "Engineering Test Complete!",
        teamName: "My Team",
        rating,
        comments,
        results: results, // Pass the entire array to the MegaFeed
        locationName: locationName || "Local Device",
        videoUrl: mainVideoUrl,
        points: finalScore,
        createdAt: new Date().toISOString(),
        heroLabel: "DESIGNS",
        heroStat: `${results.length} TESTED`,
      };

      await saveActivityToFeed(activityData);

      // Clean up the temporary storage so it doesn't stay on the device forever!
      await AsyncStorage.removeItem("@temp_handfan_data");

      Alert.alert("Success", "Results submitted offline! 🚀");
      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      console.error("Submission error: ", e);
      Alert.alert("Error", "Failed to save results.");
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={GlobalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={GlobalStyles.headerContainer}>
          <View style={GlobalStyles.successCircle}>
            <Check size={32} color="#fff" />
          </View>
          <Text style={GlobalStyles.headerTitle}>Activity Complete!</Text>
          <Text style={GlobalStyles.headerSubtitle}>
            Review and share your results
          </Text>
        </View>

        {/* DUMMY READ-ONLY RESULTS SECTION */}
        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <VideoIcon size={20} color="#0284C7" />
            <Text style={GlobalStyles.cardTitle}>Final Test Log</Text>
          </View>

          {results.length === 0 ? (
            <Text
              style={{ color: "#888", fontStyle: "italic", marginBottom: 16 }}
            >
              No results recorded.
            </Text>
          ) : (
            results.map((item, index) => (
              <View key={item.id} style={styles.readOnlyBlock}>
                <View style={styles.readOnlyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.readOnlyTitle}>{item.design}</Text>
                    <Text style={styles.readOnlySubtitle}>
                      {item.phase} • Dist: {item.distance}
                    </Text>
                  </View>
                  <Text style={styles.readOnlyAngle}>{item.angle}</Text>
                </View>

                {item.videoUri ? (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => openVideo(item.videoUri!)}
                  >
                    <Play size={16} color="#0284C7" fill="#0284C7" />
                    <Text style={styles.playButtonText}>Watch Test Video</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.noVideoBadge}>
                    <Text style={styles.noVideoText}>No Video Recorded</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Star size={20} color="#0284C7" />
            <Text style={GlobalStyles.cardTitle}>Rate this Activity</Text>
          </View>
          <View style={GlobalStyles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star
                  size={36}
                  color={rating >= star ? "#0284C7" : "#D1D5DB"}
                  fill={rating >= star ? "#0284C7" : "transparent"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <MessageSquare size={20} color="#0284C7" />
            <Text style={GlobalStyles.cardTitle}>Outcome Comments</Text>
          </View>
          <Text style={GlobalStyles.commentsLabel}>
            What did you learn? What worked well?
          </Text>
          <TextInput
            style={GlobalStyles.textInput}
            placeholder="Type your observations here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[GlobalStyles.card, GlobalStyles.interactiveLocationCard]}
          onPress={openMap}
          activeOpacity={0.8}
        >
          <View style={GlobalStyles.cardHeader}>
            <MapPin size={20} color="#0284C7" />
            <Text style={GlobalStyles.cardTitle}>Location (Tap to Edit)</Text>
          </View>
          <View style={GlobalStyles.locationBox}>
            <MapPin size={16} color="#888" />
            <View style={GlobalStyles.locationTextContainer}>
              <Text style={GlobalStyles.locationTitle}>Logged Location</Text>
              <Text style={GlobalStyles.locationSubtitle}>
                {locationError || locationName || "Fetching address..."}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            GlobalStyles.submitButton,
            { backgroundColor: "#0284C7" },
            (rating === 0 || isSubmitting) && GlobalStyles.submitButtonDisabled,
          ]}
          disabled={rating === 0 || isSubmitting}
          onPress={handleSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={GlobalStyles.submitButtonText}>Submit Results</Text>
          )}
        </TouchableOpacity>
        {rating === 0 && (
          <Text style={GlobalStyles.footerText}>
            Please rate the activity to continue
          </Text>
        )}
      </ScrollView>

      {/* REWATCH MODAL */}
      <Modal
        visible={isPlayingVideo}
        transparent={true}
        animationType="fade"
        onRequestClose={closeVideo}
      >
        <View style={styles.modalBackground}>
          <View style={styles.videoPlayerContainer}>
            <TouchableOpacity
              style={styles.closeVideoButton}
              onPress={closeVideo}
            >
              <X size={28} color="#fff" />
            </TouchableOpacity>
            {currentPlayUri && (
              <ExpoVideo
                source={{ uri: currentPlayUri }}
                style={styles.fullVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isMapVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={GlobalStyles.modalContainer}>
          <View style={GlobalStyles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsMapVisible(false)}
              style={GlobalStyles.modalCancelButton}
            >
              <X size={24} color="#111" />
            </TouchableOpacity>
            <Text style={GlobalStyles.modalTitle}>Adjust Location</Text>
            <TouchableOpacity
              onPress={confirmNewLocation}
              style={GlobalStyles.modalConfirmButton}
            >
              <Text style={GlobalStyles.modalConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
          <UniversalMap
            initialRegion={{
              latitude: tempCoordinate?.latitude || -37.8136,
              longitude: tempCoordinate?.longitude || 144.9631,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            tempCoordinate={tempCoordinate}
            onPress={(e: any) => setTempCoordinate(e.nativeEvent.coordinate)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Read Only List Styles
  readOnlyBlock: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  readOnlyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  readOnlyTitle: { fontWeight: "600", fontSize: 15, color: "#333" },
  readOnlySubtitle: { fontSize: 12, color: "#666", marginTop: 2 },
  readOnlyAngle: { fontSize: 18, fontWeight: "bold", color: "#FF6B00" },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0F2FE",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  playButtonText: {
    color: "#0284C7",
    fontWeight: "600",
    fontSize: 13,
    marginLeft: 6,
  },
  noVideoBadge: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  noVideoText: { color: "#9CA3AF", fontSize: 12, fontStyle: "italic" },

  // Rewatch Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayerContainer: {
    width: "100%",
    height: 500,
    backgroundColor: "#000",
    position: "relative",
  },
  closeVideoButton: {
    position: "absolute",
    top: -50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  fullVideo: { width: "100%", height: "100%" },
});
