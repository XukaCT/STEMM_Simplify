import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Activity, Check, MessageSquare } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EarthquakeDesignList from "../../components/earthquake/EarthquakeDesignList";
import { GlobalStyles } from "../../constants/GlobalStyles";

// 1. IMPORT OFFLINE STORAGE
import { saveActivityToFeed } from "../../utils/localStore";

const ACTIVITY_ID = "4";

export default function EarthquakeResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [designs, setDesigns] = useState<any[]>([]);

  // 2. LOAD DATA FROM ASYNC STORAGE
  useEffect(() => {
    const loadTempData = async () => {
      try {
        const stored = await AsyncStorage.getItem("@temp_earthquake_data");
        if (stored) {
          setDesigns(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load temp results", e);
      }
    };
    loadTempData();
  }, []);

  // 3. SCIENTIFIC POINT SYSTEM (WITH CAP)
  const calculatePoints = () => {
    const basePoints = 1000;

    // ANTI-ABUSE: Cap trial points at 3 designs
    const validTrialsForPoints = Math.min(designs.length, 3);
    const trialPoints = validTrialsForPoints * 400;

    // Performance points: Reward them for achieving the LOWEST shake intensity
    let bestShake = 99.9;
    designs.forEach((d) => {
      const actualShake = parseFloat(d.actual);
      if (!isNaN(actualShake) && actualShake > 0 && actualShake < bestShake) {
        bestShake = actualShake;
      }
    });

    // The lower the shake, the higher the points! (If they get it below 1.5G)
    let performancePoints = 0;
    if (bestShake < 1.5) {
      performancePoints = Math.floor((1.5 - bestShake) * 1500);
    }

    return basePoints + trialPoints + performancePoints;
  };

  const finalScore = calculatePoints();

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
    setIsSubmitting(true);

    try {
      // 4. SAVE TO OFFLINE FEED (No Firebase)
      const submissionData = {
        collectionName: "earthquake_Challenge",
        activityName: "Earthquake Structure",
        activityType: "generic",
        title: "Structural Test Complete!",
        teamName: "My Team",
        rating,
        comments,
        results: designs,
        locationName: locationName || "Local Device",
        points: finalScore,
        createdAt: new Date().toISOString(),
        heroLabel: "STRUCTURES",
        heroStat: `${designs.length} TESTED`,
      };

      await saveActivityToFeed(submissionData);

      // Clean up temp data
      await AsyncStorage.removeItem("@temp_earthquake_data");

      setIsSubmitting(false);
      router.replace("/(tabs)/dashboard");
    } catch (e) {
      console.error("Submission error: ", e);
      alert("Failed to save results. Check your console.");
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
            Share your results with the team
          </Text>
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <Activity size={20} color="#FF5A00" />
            <Text style={GlobalStyles.cardTitle}>
              Tested Structures Summary
            </Text>
          </View>
          <EarthquakeDesignList designs={designs} />
        </View>

        <View style={GlobalStyles.card}>
          <View style={GlobalStyles.cardHeader}>
            <MessageSquare size={20} color="#FF5A00" />
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
      </ScrollView>
    </SafeAreaView>
  );
}
