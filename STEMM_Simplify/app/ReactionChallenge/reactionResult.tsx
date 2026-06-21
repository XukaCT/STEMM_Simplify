import { auth, db } from "@/firebaseConfig";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import {
  Check,
  MapPin,
  MessageSquare,
  Star,
  X,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactionTimeList from "../../components/reaction/ReactionTimeList";
import UniversalMap from "../../components/universalMap";
import { GlobalStyles } from "../../constants/GlobalStyles";

const ACTIVITY_ID = "6";

export default function ReactionResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activityData = params.activityData;

  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse the records
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

  // Calculate points
  const calculateRealPoints = () => {
    if (records.length === 0) return 500;
    let totalPoints = 0;
    records.forEach((r) => {
      if (r.phase.includes("Phase 1")) {
        const time = parseInt(r.score);
        if (!isNaN(time)) totalPoints += Math.max(10, 1000 - time);
      } else if (r.phase.includes("Phase 2")) {
        const acc = parseInt(r.score);
        if (!isNaN(acc)) totalPoints += acc * 10;
      }
    });
    return totalPoints;
  };
  const finalScore = calculateRealPoints();

  // Location States
  const [coordinate, setCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Interactive Map States
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
    if (rating === 0) return;
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const teamId = userDocSnap.data()?.teamId;

      let fetchedTeamName = "Unknown Team";
      let previousBest = 0;
      let teamDocRef = null;

      if (teamId) {
        teamDocRef = doc(db, "teams", teamId);
        const teamDocSnap = await getDoc(teamDocRef);
        if (teamDocSnap.exists()) {
          const teamData = teamDocSnap.data();
          fetchedTeamName =
            teamData.name ||
            teamData.teamName ||
            teamData.title ||
            `Team ${teamId.substring(0, 4)}`;
          previousBest = teamData.activity6_points || 0;
        }
      }

      const submissionData = {
        activityName: "Reaction Board Challenge",
        teamName: fetchedTeamName,
        teamId: teamId || "none",
        rating,
        comments,
        teamRecords: records,
        locationName: locationName,
        rawCoordinates: coordinate,
        points: finalScore,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "reaction_Challenge"), submissionData);

      if (teamDocRef) {
        if (finalScore > previousBest) {
          const pointsToAdd = finalScore - previousBest;
          await updateDoc(teamDocRef, {
            activity6_points: finalScore,
            totalPoints: increment(pointsToAdd),
            completedActivities: arrayUnion(ACTIVITY_ID),
          });
        } else {
          await updateDoc(teamDocRef, {
            completedActivities: arrayUnion(ACTIVITY_ID),
          });
        }
      }

      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      console.error("Submission error: ", e);
      alert("Failed to save results. Check your connection and console.");
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
            Share your team's results
          </Text>
        </View>

        {/* Data List Component (Refactored) */}
        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Zap size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Team Results Summary</Text>
          </View>
          <ReactionTimeList records={records} />
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
            What did you learn? Did dominant hands perform better?
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
