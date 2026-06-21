import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "../../constants/GlobalStyles";

// IMPORT YOUR LOCAL STORAGE UTILS
import { saveActivityToFeed, saveVideoLocally } from "../../utils/localStore";

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

  // Location logic remains same...
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

  const pickVideo = async (type: "no" | "with") => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false, // MANDATORY FOR ANDROID
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

      // SAVE VIDEOS TO LOCAL FOLDER
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
        points: finalScore,
      };

      // SAVE TO LOCAL FEED
      await saveActivityToFeed(activityData);

      alert("Results saved offline! 🚀");
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
      <ScrollView contentContainerStyle={GlobalStyles.scrollContent}>
        {/* ... KEEP YOUR UI RENDERING CODE SAME AS BEFORE ... */}
        {/* Just ensure pickVideo is called correctly in your UploadPlaceholder props */}
      </ScrollView>
    </SafeAreaView>
  );
}
