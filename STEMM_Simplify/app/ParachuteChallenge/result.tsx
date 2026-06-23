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

// IMPORT YOUR LOCAL STORAGE UTILS
import { saveActivityToFeed, saveVideoLocally } from "../../utils/localStore";

export default function ParachuteResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [rating, setRating] = useState(0);

  // AUTOMATICALLY UNPACK VIDEOS (If recorded on previous pages)
  const [videoNoUri, setVideoNoUri] = useState<string | null>(
    (params.videoNoUri as string) || null,
  );
  const [videoWithUri, setVideoWithUri] = useState<string | null>(
    (params.videoWithUri as string) || null,
  );

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
        setLocationName(
          [place.name || place.street, place.city].filter(Boolean).join(", ") ||
            "Unknown area",
        );
      }
    } catch (error) {
      setLocationError("Failed to fetch address");
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setCoordinate(coords);
        await fetchAddressFromCoords(coords.latitude, coords.longitude);
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
      setCoordinate(tempCoordinate);
      await fetchAddressFromCoords(
        tempCoordinate.latitude,
        tempCoordinate.longitude,
      );
    }
  };

  // FALLBACK: Only used if they didn't record a video on the previous pages
  const pickVideo = async (type: "no" | "with") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"], // Future-proof syntax
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (type === "no") setVideoNoUri(result.assets[0].uri);
      if (type === "with") setVideoWithUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);

    try {
      const timestamp = Date.now();

      const localNoVideoUrl = videoNoUri
        ? await saveVideoLocally(
            videoNoUri,
            `no_parachute_${timestamp}.mp4`,
            "parachute",
          )
        : null;
      const localWithVideoUrl = videoWithUri
        ? await saveVideoLocally(
            videoWithUri,
            `with_parachute_${timestamp}.mp4`,
            "parachute",
          )
        : null;

      const activityData = {
        activityName: "Parachute Drop",
        activityType: "video",
        title: "Parachute Drop Complete!",
        teamName: "My Team",
        locationName: locationName || "Local",
        rating,
        comments,
        videoUrl: localWithVideoUrl || localNoVideoUrl,
        noVideoUrl: localNoVideoUrl,
        withVideoUrl: localWithVideoUrl,
        heightNo,
        timeNo,
        heightWith,
        timeWith,
        points: finalScore,
      };

      await saveActivityToFeed(activityData);

      alert("Results saved! 🚀");
      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to save.");
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
            Share your parachute data
          </Text>
        </View>

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

        {/* --- DYNAMIC VIDEO SECTION --- */}
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
            {/* BASELINE VIDEO: Show locked UI if recorded, Upload button if missing */}
            {videoNoUri ? (
              <View
                style={[
                  styles.attachedBox,
                  { backgroundColor: "#FEF2F2", borderColor: "#EF4444" },
                ]}
              >
                <Check size={28} color="#EF4444" />
                <Text style={[styles.attachedText, { color: "#EF4444" }]}>
                  Baseline Video Attached!
                </Text>
              </View>
            ) : (
              <UploadPlaceholder
                label="Upload Baseline"
                color="#FEF2F2"
                iconColor="#EF4444"
                hasVideo={false}
                onPress={() => pickVideo("no")}
              />
            )}

            {/* IMPACT VIDEO: Show locked UI if recorded, Upload button if missing */}
            {videoWithUri ? (
              <View
                style={[
                  styles.attachedBox,
                  { backgroundColor: "#F0FDF4", borderColor: "#10B981" },
                ]}
              >
                <Check size={28} color="#10B981" />
                <Text style={[styles.attachedText, { color: "#10B981" }]}>
                  Impact Video Attached!
                </Text>
              </View>
            ) : (
              <UploadPlaceholder
                label="Upload Impact"
                color="#F0FDF4"
                iconColor="#10B981"
                hasVideo={false}
                onPress={() => pickVideo("with")}
              />
            )}
          </View>
        </View>

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

  // NEW STYLES FOR THE ATTACHED VIDEO BOXES
  attachedBox: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  attachedText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },

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
