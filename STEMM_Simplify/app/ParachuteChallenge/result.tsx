import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Check,
  Lightbulb,
  MapPin,
  MessageSquare,
  Star,
  Timer,
  Video,
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
import DropComparison from "../../components/parachute/DropComparison";
import UploadPlaceholder from "../../components/parachute/UploadPlaceholder";
import UniversalMap from "../../components/universalMap";
import { GlobalStyles } from "../../constants/GlobalStyles";

const ACTIVITY_ID = "1";

export default function ParachuteResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [rating, setRating] = useState(0);

  const [videoNoUri, setVideoNoUri] = useState<string | null>(null);
  const [videoWithUri, setVideoWithUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState("");

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

  const heightNo = parseFloat(params.heightNo as string) || 0;
  const timeNo = parseFloat(params.timeNo as string) || 0;
  const heightWith = parseFloat(params.heightWith as string) || 0;
  const timeWith = parseFloat(params.timeWith as string) || 0;
  const startTime = parseInt(params.startTime as string) || Date.now();

  const endTime = Date.now();
  const sessionSeconds = Math.floor((endTime - startTime) / 1000);
  const finalScore = Math.max(0, 5000 - sessionSeconds) + 1000;

  const speedNo = timeNo > 0 ? (heightNo / timeNo).toFixed(2) : "0.00";
  const speedWith = timeWith > 0 ? (heightWith / timeWith).toFixed(2) : "0.00";
  const timeDiffPercent =
    timeNo > 0 ? (((timeWith - timeNo) / timeNo) * 100).toFixed(1) : "0.0";
  const isSuccess = parseFloat(timeDiffPercent) > 0;

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

  const pickVideo = async (type: "no" | "with") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "videos" as any,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "no") setVideoNoUri(result.assets[0].uri);
      if (type === "with") setVideoWithUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);

    try {
      const activityData = {
        activityName: "Parachute Drop",
        heightNo,
        timeNo,
        speedNo: parseFloat(speedNo as string),
        heightWith,
        timeWith,
        speedWith: parseFloat(speedWith as string),
        timeDiffPercent: parseFloat(timeDiffPercent as string),
        rating,
        comments,
        noVideoUrl: videoNoUri, // Simulated local saving
        withVideoUrl: videoWithUri,
        locationName: locationName,
        rawCoordinates: coordinate,
        points: finalScore,
        createdAt: new Date().toISOString(),
      };

      setTimeout(() => {
        alert("Results submitted! Your team's dashboard has been updated. 🚀");
        setIsSubmitting(false);
        router.replace("/(tabs)/dashboard");
      }, 500);
    } catch (e) {
      console.error("Submission error: ", e);
      alert("Failed to save results. Please try again.");
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
        {/* Header (Global) */}
        <View style={GlobalStyles.headerContainer}>
          <View style={GlobalStyles.successCircle}>
            <Check size={32} color="#fff" />
          </View>
          <Text style={GlobalStyles.headerTitle}>Activity Complete!</Text>
          <Text style={GlobalStyles.headerSubtitle}>
            Share your parachute data
          </Text>
        </View>

        {/* Drop Comparison (Refactored) */}
        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Timer size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Drop Comparison</Text>
          </View>
          <DropComparison
            heightNo={heightNo}
            timeNo={timeNo}
            speedNo={speedNo}
            heightWith={heightWith}
            timeWith={timeWith}
            speedWith={speedWith}
            timeDiffPercent={timeDiffPercent}
            isSuccess={isSuccess}
          />
        </View>

        {/* Understanding Box (Local) */}
        <View style={styles.understandingBox}>
          <View style={styles.understandingHeader}>
            <Lightbulb size={18} color="#1E3A8A" />
            <Text style={styles.understandingTitle}>
              Science Behind Parachutes
            </Text>
          </View>
          <Text style={styles.understandingIntro}>
            Parachutes work by increasing{" "}
            <Text style={{ fontWeight: "bold" }}>air resistance (drag)</Text>.
            When a large surface area pushes against air molecules, it creates
            an upward force that slows descent.
          </Text>
          <View style={styles.keyFactsCard}>
            <Text style={styles.keyFactsTitle}>KEY FACTS</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                • Drag force increases with surface area
              </Text>
              <Text style={styles.bulletItem}>
                • Larger canopy = more air resistance = slower fall
              </Text>
              <Text style={styles.bulletItem}>
                • Even string distribution keeps the parachute stable
              </Text>
            </View>
          </View>
        </View>

        {/* Video Uploads (Refactored) */}
        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Video size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>
              Experiment Videos{" "}
              <Text
                style={{ color: "#9CA3AF", fontSize: 13, fontWeight: "normal" }}
              >
                (Optional)
              </Text>
            </Text>
          </View>
          <View style={styles.row}>
            <UploadPlaceholder
              label="No Parachute"
              color="#FEF2F2"
              iconColor="#EF4444"
              hasVideo={!!videoNoUri}
              onPress={() => pickVideo("no")}
            />
            <UploadPlaceholder
              label="With Parachute"
              color="#F0FDF4"
              iconColor="#10B981"
              hasVideo={!!videoWithUri}
              onPress={() => pickVideo("with")}
            />
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
          <Text style={GlobalStyles.commentsLabel}>
            What did you learn about air resistance?
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
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
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
