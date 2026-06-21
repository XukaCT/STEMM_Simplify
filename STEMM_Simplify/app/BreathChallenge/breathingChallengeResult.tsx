import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  MapPin,
  MessageSquare,
  Star,
  Wind,
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
import BreathingDataList from "../../components/breath/BreathingDataList";
import UniversalMap from "../../components/universalMap";
import { GlobalStyles } from "../../constants/GlobalStyles";

const ACTIVITY_ID = "7";

export default function BreathingPaceResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { atRest, afterExercise } = params;

  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startTimeString = params.startTime as string;
  const startTime = startTimeString ? parseInt(startTimeString) : Date.now();
  const endTime = Date.now();
  const sessionSeconds = Math.floor((endTime - startTime) / 1000);
  const finalScore = Math.max(0, 5000 - sessionSeconds) + 1000;

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

  const parsedAtRest = atRest ? Number(atRest) : null;
  const parsedAfterExercise: number[] = (() => {
    if (afterExercise && typeof afterExercise === "string") {
      try {
        return JSON.parse(afterExercise);
      } catch (e) {
        console.error("Failed to parse afterExercise data", e);
        return [];
      }
    }
    return [];
  })();

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
        const addressString = [streetInfo, cityInfo].filter(Boolean).join(", ");
        setLocationName(addressString || "Unknown area");
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
      // Local payload construction for future use if needed
      const submissionData = {
        activityName: "Breathing Pace Trainer",
        rating,
        comments,
        atRestBPM: parsedAtRest,
        afterExerciseBPMs: parsedAfterExercise,
        locationName: locationName,
        rawCoordinates: coordinate,
        points: finalScore,
        createdAt: new Date().toISOString(),
      };

      // Simulate network save
      setTimeout(() => {
        setIsSubmitting(false);
        router.replace("/(tabs)/dashboard");
      }, 500);
    } catch (e) {
      alert("Failed to save results.");
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView contentContainerStyle={GlobalStyles.scrollContent}>
        {/* Header (Global) */}
        <View style={GlobalStyles.headerContainer}>
          <View style={GlobalStyles.successCircle}>
            <Check size={32} color="#fff" />
          </View>
          <Text style={GlobalStyles.headerTitle}>Activity Complete!</Text>
          <Text style={GlobalStyles.headerSubtitle}>
            Share your breathing data
          </Text>
        </View>

        {/* Display Tested Results Summary (Refactored) */}
        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Wind size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Breathing Pace Summary</Text>
          </View>
          <BreathingDataList
            parsedAtRest={parsedAtRest}
            parsedAfterExercise={parsedAfterExercise}
          />
        </View>

        {/* Understanding Box (Local) */}
        <View style={styles.understandingBox}>
          <Text style={styles.understandingTitle}>
            Understanding Breathing Rate
          </Text>
          <Text style={styles.understandingIntro}>
            Breathing rate increases during exercise because muscles need more
            oxygen and produce more carbon dioxide.
          </Text>
          <View style={styles.keyFactsCard}>
            <Text style={styles.keyFactsTitle}>Respiratory Response:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Exercise increases breathing rate 2-3x normal
              </Text>
              <Text style={styles.bulletItem}>
                • Fitter individuals return to rest rate faster
              </Text>
            </View>
          </View>
        </View>

        {/* Rating Card (Global) */}
        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Star size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Rate this Activity</Text>
          </View>
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
        </View>

        {/* Comments Card (Global) */}
        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <MessageSquare size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Outcome Comments</Text>
          </View>
          <TextInput
            style={GlobalStyles.textInput}
            placeholder="How did your breathing change? How long did it take to recover?"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
            textAlignVertical="top"
          />
        </View>

        {/* INTERACTIVE LOCATION CARD (Global) */}
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

        {/* Submit Button (Global) */}
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
            Please rate the activity to continue
          </Text>
        )}
      </ScrollView>

      {/* --- FULL SCREEN MAP MODAL (Global) --- */}
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
  understandingBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  understandingTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  understandingIntro: {
    fontSize: 12,
    color: "#1E3A8A",
    lineHeight: 18,
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
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  bulletList: { gap: 6 },
  bulletItem: { fontSize: 12, color: "#1E3A8A", lineHeight: 18 },
});
