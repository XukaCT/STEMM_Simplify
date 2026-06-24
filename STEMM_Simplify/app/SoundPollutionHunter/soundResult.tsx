import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SoundRecordingList from "../../components/sound/SoundRecordingList";
import UniversalMap from "../../components/universalMap";
import { GlobalStyles } from "../../constants/GlobalStyles";
import { saveActivityToFeed } from "../../utils/localStore";

const ACTIVITY_ID = "2";

export default function ResultScreen() {
  const params = useLocalSearchParams();

  let parsedRaw = [];
  if (typeof params.results === "string") {
    try {
      parsedRaw = JSON.parse(decodeURIComponent(params.results));
    } catch (e) {
      parsedRaw = JSON.parse(params.results);
    }
  } else {
    parsedRaw = params.results || [];
  }
  const results = parsedRaw;
  const teamName = (params.teamName as string) || "Unknown Team";

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

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    })();
  }, []);

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
      const submissionData = {
        collectionName: "sound_challenge",
        activityName: "Sound Challenge",
        activityType: "generic", // Leaves FeedCard generic, but opens Modal with media player
        title: "Audio Log Complete!",
        teamName: teamName,
        locationName: locationName || "Local",
        rating,
        comments,

        // FIX 1: Point directly to the first index of the array!
        videoUrl: results.length > 0 ? results.audioUri : null,

        // FIX 2: Standardize the key name so ModalHero.tsx can find it!
        results: results,

        points: finalScore,
        createdAt: new Date().toISOString(),
        heroLabel: "NOISE",
        heroStat: `${results.length} LOGS`,
      };

      await saveActivityToFeed(submissionData);

      Alert.alert("Success", "Results submitted offline! 🚀");
      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit results.");
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={GlobalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={GlobalStyles.headerContainer}>
          <View style={GlobalStyles.successCircle}>
            <Ionicons name="checkmark" size={32} color="#fff" />
          </View>
          <Text style={GlobalStyles.headerTitle}>Activity Complete!</Text>
          <Text style={GlobalStyles.headerSubtitle}>
            Share your results with the team
          </Text>
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Ionicons name="cloud-upload-outline" size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Recorded Clips</Text>
          </View>
          <SoundRecordingList results={results} />
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Ionicons name="star-outline" size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Rate this Activity</Text>
          </View>
          <View style={GlobalStyles.starsContainer}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Ionicons
                  name={rating >= s ? "star" : "star-outline"}
                  size={36}
                  color={rating >= s ? "#FF5A00" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Ionicons name="chatbubble-outline" size={20} color="#FF5A00" />
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
            <Ionicons name="location-outline" size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>Location (Tap to Edit)</Text>
          </View>
          <View style={GlobalStyles.locationBox}>
            <Ionicons name="location" size={16} color="#888" />
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
          onPress={handleSubmit}
          disabled={rating === 0 || isSubmitting}
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
              <Ionicons name="close" size={24} color="#111" />
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
