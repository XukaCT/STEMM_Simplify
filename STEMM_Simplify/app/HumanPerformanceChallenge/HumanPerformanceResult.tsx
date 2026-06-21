import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  MapPin,
  Microscope,
  Star,
  Trophy,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MovementList from "../../components/humanPerformance/MovementList";
import UniversalMap from "../../components/universalMap";
import { GlobalStyles } from "../../constants/GlobalStyles";

const ACTIVITY_ID = "5";

export default function HumanPerformanceResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activityData = params.activityData;

  const [records, setRecords] = useState<any[]>(() => {
    if (activityData && typeof activityData === "string") {
      try {
        return JSON.parse(activityData);
      } catch (e) {
        console.error("Failed to parse activity data", e);
        return [];
      }
    }
    return [];
  });

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

  const bestRecord =
    records.length > 0
      ? records.reduce((min, current) =>
          current.value < min.value ? current : min,
        )
      : null;

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
    if (rating === 0) return;
    setIsSubmitting(true);

    try {
      const submissionData = {
        activityName: "Human Performance Lab",
        rating,
        comments,
        recordedMovements: records,
        bestPerformance: bestRecord,
        locationName: locationName,
        rawCoordinates: coordinate,
        points: finalScore,
        createdAt: new Date().toISOString(),
      };

      setTimeout(() => {
        alert(`New High Score! 🏆 You earned ${finalScore} points!`);
        setIsSubmitting(false);
        router.replace("/(tabs)/dashboard");
      }, 500);
    } catch (e) {
      console.error("Submission error: ", e);
      alert("Failed to save results.");
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
        {/* HEADER (Global) */}
        <View style={GlobalStyles.headerContainer}>
          <View style={GlobalStyles.successCircle}>
            <Check size={32} color="#fff" />
          </View>
          <Text style={GlobalStyles.headerTitle}>Activity Complete!</Text>
          <Text style={GlobalStyles.headerSubtitle}>
            Share your recorded movement data
          </Text>
        </View>

        {/* SCORE DISPLAY CARD (Global + Overrides) */}
        <View
          style={[
            GlobalStyles.card,
            {
              alignItems: "center",
              backgroundColor: "#FFF5ED",
              borderColor: "#FFE6D5",
            },
          ]}
        >
          <Text
            style={{
              color: "#FF6B00",
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            TOTAL POINTS EARNED
          </Text>
          <Text style={{ fontSize: 48, fontWeight: "bold", color: "#111" }}>
            {finalScore}
          </Text>
          <Text style={{ color: "#666", fontSize: 14, marginTop: 5 }}>
            Completed in {sessionSeconds}s
          </Text>
        </View>

        {/* REFACTORED COMPONENT: Recorded Movement Data List */}
        <View style={styles.dataCard}>
          <View style={styles.dataCardHeader}>
            <Text style={styles.dataCardTitle}>RECORDED MOVEMENT DATA</Text>
          </View>
          <MovementList records={records} />
        </View>

        {/* BEST PERFORMANCE CARD (Local specific style) */}
        {bestRecord && (
          <View style={styles.bestCard}>
            <View style={styles.trophyContainer}>
              <Trophy size={20} color="#fff" />
            </View>
            <View style={styles.bestInfo}>
              <Text style={styles.bestTitle}>BEST PERFORMANCE</Text>
              <Text style={styles.bestMovement}>{bestRecord.movement}</Text>
              <Text style={styles.bestDetails}>
                ±{bestRecord.value.toFixed(2)}cm — {bestRecord.status}
              </Text>
            </View>
          </View>
        )}

        {/* UNDERSTANDING BOX (Local specific style) */}
        <View style={styles.understandingBox}>
          <View style={styles.understandingHeader}>
            <Microscope size={18} color="#1E3A8A" />
            <Text style={styles.understandingTitle}>
              Understanding Human Movement
            </Text>
          </View>
          <Text style={styles.understandingIntro}>
            The human body moves through coordinated muscle contractions and
            joint rotations. Smooth, controlled movements indicate good{" "}
            <Text style={{ fontWeight: "bold" }}>motor control</Text> and muscle
            coordination.
          </Text>
          <View style={styles.keyFactsCard}>
            <Text style={styles.keyFactsTitle}>KEY FACTS</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Slower movements tend to be smoother and more controlled
              </Text>
              <Text style={styles.bulletItem}>
                • Practice improves coordination and reduces shakiness
              </Text>
              <Text style={styles.bulletItem}>
                • Muscle fatigue increases movement irregularity
              </Text>
            </View>
          </View>
        </View>

        {/* RATING CARD (Global) */}
        <View style={GlobalStyles.card}>
          <Text style={GlobalStyles.ratingTitle}>Rate This Activity</Text>
          <View style={GlobalStyles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star
                  size={36}
                  color={rating >= star ? "#FF5A00" : "#D1D5DB"}
                  fill={rating >= star ? "#FF5A00" : "transparent"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={GlobalStyles.commentsLabel}>
            Comments <Text style={{ color: "#9CA3AF" }}>(Optional)</Text>
          </Text>
          <TextInput
            style={GlobalStyles.textInput}
            placeholder="What did you notice about your movement patterns?"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
            textAlignVertical="top"
          />
        </View>

        {/* LOCATION CARD (Global) */}
        <TouchableOpacity
          style={[GlobalStyles.card, GlobalStyles.interactiveLocationCard]}
          onPress={openMap}
          activeOpacity={0.8}
        >
          <View style={GlobalStyles.cardHeader}>
            <MapPin size={20} color="#FF5A00" />
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

        {/* SUBMIT BUTTON (Global) */}
        <TouchableOpacity
          style={[
            GlobalStyles.submitButton,
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
            Please rate the activity to submit
          </Text>
        )}
      </ScrollView>

      {/* --- MAP MODAL (Global) --- */}
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
          <View style={GlobalStyles.mapInstructionBanner}>
            <Text style={GlobalStyles.mapInstructionText}>
              Tap anywhere on the map to drop a pin.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dataCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 16,
  },
  dataCardHeader: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dataCardTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  bestCard: {
    backgroundColor: "#ECFCCB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BEF264",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  trophyContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  bestInfo: { flex: 1 },
  bestTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#10B981",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bestMovement: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 2,
  },
  bestDetails: { fontSize: 12, color: "#4B5563" },

  understandingBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  understandingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  understandingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginLeft: 8,
  },
  understandingIntro: {
    fontSize: 13,
    color: "#1E3A8A",
    lineHeight: 20,
    marginBottom: 16,
  },
  keyFactsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  keyFactsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E3A8A",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bulletList: { gap: 6 },
  bulletItem: { fontSize: 12, color: "#1E3A8A", lineHeight: 18 },
});
